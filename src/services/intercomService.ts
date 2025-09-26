import React from 'react';
import { IntercomMetrics } from '../types/intercom';
import { mockIntercomData } from '../data/mockData';

// Configuration de l'API Intercom via proxy local
const INTERCOM_API_BASE = 'http://localhost:3001/api/intercom';
const INTERCOM_ACCESS_TOKEN = process.env.REACT_APP_INTERCOM_ACCESS_TOKEN;

class IntercomService {
  private accessToken: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || INTERCOM_ACCESS_TOKEN || '';
  }

  // Headers pour les requêtes API
  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  // Méthode générique pour les appels API
  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const url = `${INTERCOM_API_BASE}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Intercom API Error:', error);
      throw error;
    }
  }

  // Récupérer les conversations (tickets)
  async getConversations(params: {
    state?: 'open' | 'closed' | 'snoozed';
    created_at_after?: string;
    created_at_before?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return this.apiCall(`/conversations?${queryParams.toString()}`);
  }

  // Rechercher les conversations avec filtres avancés (utilise l'API Search)
  async searchConversations(searchBody: any) {
    return this.apiCall('/conversations/search', {
      method: 'POST',
      body: JSON.stringify(searchBody)
    });
  }

  // Convertir une date string en timestamp Unix
  private dateToTimestamp(dateString: string): number {
    return Math.floor(new Date(dateString).getTime() / 1000);
  }

  // Version optimisée - Récupérer le nombre de nouvelles conversations créées entre deux dates
  private async getNewConversationsCountOptimized(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }, selectedAdminId: string | null): Promise<number> {
    try {
      // TOUJOURS ajouter les filtres de date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage nouveaux tickets avec POST /conversations/search (optimisé):', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent,
        selectedAdminId
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      // Construire le body de recherche avec les filtres de date
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            }
          ]
        }
      };

      // Gestion du filtre par agent : soit ID spécifique soit pas de filtre
      if (filters.selectedAgent && selectedAdminId) {
        searchBody.query.value.push({
          field: "admin_assignee_id",
          operator: "=",
          value: parseInt(selectedAdminId, 10)
        });
        console.log(`Ajout du filtre agent (optimisé): ID ${selectedAdminId}`);
      }
      // Si aucun agent sélectionné, on ne filtre pas par admin_assignee_id

      console.log('Body de recherche (nouveaux tickets):', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const totalCount = response.total_count || 0;

      console.log('Réponse API complète (nouveaux tickets):', {
        total_count: response.total_count,
        per_page: response.per_page,
        conversations_length: response.conversations?.length || 0
      });
      console.log(`Nouveaux tickets trouvés via search API (optimisé): ${totalCount} (total_count)`);
      return totalCount;

    } catch (error) {
      console.error('Erreur lors de la récupération des nouvelles conversations (optimisé):', error);
      return 0;
    }
  }

  // Version optimisée - Récupérer le nombre de conversations ouvertes avec filtres de date ET d'état
  private async getOpenConversationsCountOptimized(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }, selectedAdminId: string | null): Promise<number> {
    try {
      // TOUJOURS filtrer par date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage tickets ouverts avec POST /conversations/search (optimisé):', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent,
        selectedAdminId
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      // Construire le body de recherche avec les filtres de date ET d'état (open + snoozed + pending)
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            },
            {
              field: "state",
              operator: "IN",
              value: ["open", "snoozed", "pending"]
            }
          ]
        }
      };

      // Gestion du filtre par agent : soit ID spécifique soit pas de filtre
      if (filters.selectedAgent && selectedAdminId) {
        // Agent spécifique sélectionné
        searchBody.query.value.push({
          field: "admin_assignee_id",
          operator: "=",
          value: parseInt(selectedAdminId, 10)
        });
        console.log(`Ajout du filtre agent pour tickets ouverts (optimisé): ID ${selectedAdminId}`);
      }
      // Si aucun agent sélectionné, on ne filtre pas par admin_assignee_id
      // Cela récupérera tous les tickets (assignés et non assignés)

      console.log('Body de recherche pour tickets ouverts (optimisé):', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const totalCount = response.total_count || 0;

      console.log('Réponse API complète (tickets ouverts):', {
        total_count: response.total_count,
        per_page: response.per_page,
        conversations_length: response.conversations?.length || 0
      });
      console.log(`Tickets ouverts trouvés via search API (optimisé): ${totalCount} (total_count)`);
      return totalCount;

    } catch (error) {
      console.error('Erreur lors de la récupération des tickets ouverts (optimisé):', error);
      return 0;
    }
  }

  // Version optimisée - Récupérer le nombre de conversations fermées avec filtres de date ET d'état
  private async getClosedConversationsCountOptimized(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }, selectedAdminId: string | null): Promise<number> {
    try {
      // TOUJOURS filtrer par date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage tickets fermés avec POST /conversations/search (optimisé):', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent,
        selectedAdminId
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      // Construire le body de recherche avec les filtres de date ET d'état
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            },
            {
              field: "state",
              operator: "=",
              value: "closed"
            }
          ]
        }
      };

      // Gestion du filtre par agent : soit ID spécifique soit pas de filtre
      if (filters.selectedAgent && selectedAdminId) {
        searchBody.query.value.push({
          field: "admin_assignee_id",
          operator: "=",
          value: parseInt(selectedAdminId, 10)
        });
        console.log(`Ajout du filtre agent pour tickets fermés (optimisé): ID ${selectedAdminId}`);
      }
      // Si aucun agent sélectionné, on ne filtre pas par admin_assignee_id

      console.log('Body de recherche pour tickets fermés (optimisé):', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const totalCount = response.total_count || 0;

      console.log('Réponse API complète (tickets fermés):', {
        total_count: response.total_count,
        per_page: response.per_page,
        conversations_length: response.conversations?.length || 0
      });
      console.log(`Tickets fermés trouvés via search API (optimisé): ${totalCount} (total_count)`);
      return totalCount;

    } catch (error) {
      console.error('Erreur lors de la récupération des tickets fermés (optimisé):', error);
      return 0;
    }
  }

  // Récupérer le nombre de nouvelles conversations créées entre deux dates
  async getNewConversationsCount(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<number> {
    try {
      // TOUJOURS ajouter les filtres de date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage nouveaux tickets avec POST /conversations/search:', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      console.log('Timestamps utilisés:', {
        startTimestamp,
        endTimestamp,
        startDateReadable: new Date(startTimestamp * 1000).toISOString(),
        endDateReadable: new Date(endTimestamp * 1000).toISOString()
      });

      // Construire le body de recherche avec les filtres de date
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            }
          ]
        }
      };

      // Ajouter le filtre par agent si spécifié
      if (filters.selectedAgent) {
        const admins = await this.getAdmins();
        const selectedAdmin = admins.admins?.find((admin: any) => 
          admin.name === filters.selectedAgent
        );
        
        if (selectedAdmin) {
          searchBody.query.value.push({
            field: "assignee_id",
            operator: "=",
            value: selectedAdmin.id
          });
          console.log(`Ajout du filtre agent: ${selectedAdmin.name} (ID: ${selectedAdmin.id})`);
        }
      }

      console.log('Body de recherche:', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const conversations = response.conversations || [];

      console.log(`Nouveaux tickets trouvés via search API: ${conversations.length}`);
      return conversations.length;

    } catch (error) {
      console.error('Erreur lors de la récupération des nouvelles conversations:', error);
      return 0;
    }
  }

  // Récupérer le nombre de conversations ouvertes avec filtres de date ET d'état
  async getOpenConversationsCount(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<number> {
    try {
      // TOUJOURS filtrer par date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage tickets ouverts avec POST /conversations/search:', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      console.log('Timestamps utilisés pour tickets ouverts:', {
        startTimestamp,
        endTimestamp,
        startDateReadable: new Date(startTimestamp * 1000).toISOString(),
        endDateReadable: new Date(endTimestamp * 1000).toISOString()
      });

      // Construire le body de recherche avec les filtres de date ET d'état
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            },
            {
              field: "state",
              operator: "=",
              value: "open"
            }
          ]
        }
      };

      // Ajouter le filtre par agent si spécifié
      if (filters.selectedAgent) {
        const admins = await this.getAdmins();
        const selectedAdmin = admins.admins?.find((admin: any) => 
          admin.name === filters.selectedAgent
        );
        
        if (selectedAdmin) {
          searchBody.query.value.push({
            field: "assignee_id",
            operator: "=",
            value: selectedAdmin.id
          });
          console.log(`Ajout du filtre agent pour tickets ouverts: ${selectedAdmin.name} (ID: ${selectedAdmin.id})`);
        }
      }

      console.log('Body de recherche pour tickets ouverts:', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const conversations = response.conversations || [];

      console.log(`Tickets ouverts trouvés via search API: ${conversations.length}`);
      return conversations.length;

    } catch (error) {
      console.error('Erreur lors de la récupération des tickets ouverts:', error);
      return 0;
    }
  }

  // Récupérer le nombre de conversations fermées avec filtres de date ET d'état
  async getClosedConversationsCount(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<number> {
    try {
      // TOUJOURS filtrer par date - utiliser les dates fournies ou par défaut
      const startDate = filters.startDate || (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      })();
      
      const endDate = filters.endDate || startDate;

      console.log('Filtrage tickets fermés avec POST /conversations/search:', {
        startDate,
        endDate,
        selectedAgent: filters.selectedAgent
      });

      // Convertir les dates en timestamps Unix
      const startTimestamp = this.dateToTimestamp(startDate);
      const endTimestamp = this.dateToTimestamp(endDate + 'T23:59:59.999Z');

      console.log('Timestamps utilisés pour tickets fermés:', {
        startTimestamp,
        endTimestamp,
        startDateReadable: new Date(startTimestamp * 1000).toISOString(),
        endDateReadable: new Date(endTimestamp * 1000).toISOString()
      });

      // Construire le body de recherche avec les filtres de date ET d'état
      const searchBody = {
        query: {
          operator: "AND",
          value: [
            {
              field: "created_at",
              operator: ">=",
              value: startTimestamp
            },
            {
              field: "created_at",
              operator: "<=",
              value: endTimestamp
            },
            {
              field: "state",
              operator: "=",
              value: "closed"
            }
          ]
        }
      };

      // Ajouter le filtre par agent si spécifié
      if (filters.selectedAgent) {
        const admins = await this.getAdmins();
        const selectedAdmin = admins.admins?.find((admin: any) => 
          admin.name === filters.selectedAgent
        );
        
        if (selectedAdmin) {
          searchBody.query.value.push({
            field: "assignee_id",
            operator: "=",
            value: selectedAdmin.id
          });
          console.log(`Ajout du filtre agent pour tickets fermés: ${selectedAdmin.name} (ID: ${selectedAdmin.id})`);
        }
      }

      console.log('Body de recherche pour tickets fermés:', JSON.stringify(searchBody, null, 2));

      // Utiliser l'API de recherche POST /conversations/search
      const response = await this.searchConversations(searchBody);
      const conversations = response.conversations || [];

      console.log(`Tickets fermés trouvés via search API: ${conversations.length}`);
      return conversations.length;

    } catch (error) {
      console.error('Erreur lors de la récupération des tickets fermés:', error);
      return 0;
    }
  }

  // Récupérer les admins (agents)
  async getAdmins() {
    return this.apiCall('/admins');
  }

  // Récupérer les agents filtrés par emails spécifiques
  async getFilteredAgents(): Promise<Array<{ id: string; name: string; email: string }>> {
    try {
      const allowedEmails = ['lola.ricca@vertuoza.com', 'tom@vertuoza.com'];
      const admins = await this.getAdmins();
      
      if (!admins.admins) {
        console.warn('Aucun admin trouvé dans la réponse API');
        return [];
      }

      const filteredAgents = admins.admins
        .filter((admin: any) => allowedEmails.includes(admin.email))
        .map((admin: any) => ({
          id: admin.id,
          name: admin.name,
          email: admin.email
        }));

      console.log('Agents filtrés trouvés:', filteredAgents);
      return filteredAgents;
    } catch (error) {
      console.error('Erreur lors de la récupération des agents filtrés:', error);
      return [];
    }
  }

  // Récupérer les statistiques des conversations
  async getConversationStats(params: {
    type: 'admin' | 'user';
    created_at_after?: string;
    created_at_before?: string;
  }) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return this.apiCall(`/conversations/stats?${queryParams.toString()}`);
  }

  // Méthode principale pour récupérer toutes les métriques avec filtres
  async getMetrics(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<IntercomMetrics> {
    try {
      // Récupérer l'admin une seule fois si un agent est sélectionné
      let selectedAdminId: string | null = null;
      if (filters.selectedAgent) {
        const admins = await this.getAdmins();
        const selectedAdmin = admins.admins?.find((admin: any) => 
          admin.name === filters.selectedAgent
        );
        selectedAdminId = selectedAdmin?.id || null;
        console.log(`Agent sélectionné: ${filters.selectedAgent} (ID: ${selectedAdminId})`);
      }

      // Récupérer les données réelles de l'API avec filtres de date et d'état
      const [openConversationsCount, newConversationsCount, closedConversationsCount] = await Promise.all([
        this.getOpenConversationsCountOptimized(filters, selectedAdminId),
        this.getNewConversationsCountOptimized(filters, selectedAdminId),
        this.getClosedConversationsCountOptimized(filters, selectedAdminId)
      ]);
      
      console.log('Métriques récupérées:', {
        openTickets: openConversationsCount,
        newTickets: newConversationsCount,
        closedTickets: closedConversationsCount,
        filters
      });
      
      // Pour les autres métriques, on garde les données mockées pour l'instant
      // et on remplace les données réelles
      const realMetrics: IntercomMetrics = {
        ...mockIntercomData,
        openTickets: openConversationsCount,
        newTickets: newConversationsCount,
        closedTickets: closedConversationsCount
      };

      return realMetrics;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques:', error);
      // En cas d'erreur, retourner les données mockées
      return mockIntercomData;
    }
  }

  // Méthode pour transformer les données de l'API en format IntercomMetrics
  private transformApiDataToMetrics(conversations: any, admins: any, stats: any): IntercomMetrics {
    // TODO: Implémenter la transformation des données réelles
    // Cette méthode devra analyser les données de l'API Intercom
    // et les transformer en format IntercomMetrics

    return mockIntercomData;
  }

  // Méthode pour tester la connexion à l'API
  async testConnection(): Promise<boolean> {
    try {
      await this.apiCall('/me');
      return true;
    } catch (error) {
      console.error('Test de connexion échoué:', error);
      return false;
    }
  }
}

// Instance singleton du service
export const intercomService = new IntercomService();

// Hook React pour utiliser le service avec filtres
export const useIntercomData = (filters: {
  startDate?: string;
  endDate?: string;
  selectedAgent?: string;
} = {}) => {
  const [data, setData] = React.useState<IntercomMetrics | null>(mockIntercomData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async (filtersToUse: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }) => {
    try {
      setLoading(true);
      console.log('Fetching data with filters:', filtersToUse);
      const metrics = await intercomService.getMetrics(filtersToUse);
      setData(metrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = React.useCallback(async (newFilters?: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }) => {
    const filtersToUse = newFilters || filters;
    await fetchData(filtersToUse);
  }, [fetchData, filters]);

  return { data, loading, error, refetch };
};

// Hook React pour récupérer les agents filtrés
export const useFilteredAgents = () => {
  const [agents, setAgents] = React.useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const filteredAgents = await intercomService.getFilteredAgents();
        setAgents(filteredAgents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des agents');
        console.error('Erreur lors de la récupération des agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};

export default IntercomService;
