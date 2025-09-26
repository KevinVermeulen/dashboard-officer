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

  // Récupérer le nombre de nouvelles conversations créées entre deux dates
  async getNewConversationsCount(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<number> {
    try {
      const params: any = {
        per_page: 1 // On ne récupère qu'une conversation pour avoir le total_count
      };

      // Ajouter les filtres de date si fournis
      if (filters.startDate) {
        params.created_at_after = Math.floor(new Date(filters.startDate).getTime() / 1000);
      }
      if (filters.endDate) {
        // Ajouter 24h pour inclure toute la journée de fin
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        params.created_at_before = Math.floor(endDate.getTime() / 1000);
      }

      const response = await this.getConversations(params);
      
      // Si pas de filtre par agent, on peut utiliser directement total_count
      if (!filters.selectedAgent || filters.selectedAgent === '') {
        return response.total_count || 0;
      }

      // Si filtre par agent, on doit récupérer toutes les conversations pour filtrer
      const allParams = { ...params };
      delete allParams.per_page;
      
      const allResponse = await this.getConversations(allParams);
      let conversations = allResponse.conversations || [];

      // Récupérer les admins pour faire le mapping nom -> ID
      const admins = await this.getAdmins();
      const selectedAdmin = admins.admins?.find((admin: any) => 
        admin.name === filters.selectedAgent
      );
      
      if (selectedAdmin) {
        conversations = conversations.filter((conv: any) => 
          conv.assignee?.id === selectedAdmin.id
        );
      }

      return conversations.length;
    } catch (error) {
      console.error('Erreur lors de la récupération des nouvelles conversations:', error);
      return 0;
    }
  }

  // Récupérer le nombre de conversations ouvertes avec filtres
  async getOpenConversationsCount(filters: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  } = {}): Promise<number> {
    try {
      const params: any = {
        state: 'open',
        per_page: 1 // On ne récupère qu'une conversation pour avoir le total_count
      };

      // Ajouter les filtres de date si fournis
      if (filters.startDate) {
        params.created_at_after = Math.floor(new Date(filters.startDate).getTime() / 1000);
      }
      if (filters.endDate) {
        // Ajouter 24h pour inclure toute la journée de fin
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        params.created_at_before = Math.floor(endDate.getTime() / 1000);
      }

      const response = await this.getConversations(params);
      
      // Si pas de filtre par agent, on peut utiliser directement total_count
      if (!filters.selectedAgent || filters.selectedAgent === '') {
        return response.total_count || 0;
      }

      // Si filtre par agent, on doit récupérer toutes les conversations pour filtrer
      // (limitation de l'API Intercom qui ne permet pas de filtrer par assignee directement)
      const allParams = { ...params };
      delete allParams.per_page; // Récupérer toutes les conversations
      
      const allResponse = await this.getConversations(allParams);
      let conversations = allResponse.conversations || [];

      // Récupérer les admins pour faire le mapping nom -> ID
      const admins = await this.getAdmins();
      const selectedAdmin = admins.admins?.find((admin: any) => 
        admin.name === filters.selectedAgent
      );
      
      if (selectedAdmin) {
        conversations = conversations.filter((conv: any) => 
          conv.assignee?.id === selectedAdmin.id
        );
      }

      return conversations.length;
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations ouvertes:', error);
      return 0;
    }
  }

  // Récupérer les admins (agents)
  async getAdmins() {
    return this.apiCall('/admins');
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
      // Récupérer les données réelles de l'API
      const openConversationsCount = await this.getOpenConversationsCount(filters);
      const newConversationsCount = await this.getNewConversationsCount(filters);
      
      // Pour les autres métriques, on garde les données mockées pour l'instant
      // et on remplace les données réelles
      const realMetrics: IntercomMetrics = {
        ...mockIntercomData,
        openTickets: openConversationsCount,
        newTickets: newConversationsCount
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
  const [data, setData] = React.useState<IntercomMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const metrics = await intercomService.getMetrics(filters);
        setData(metrics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.startDate, filters.endDate, filters.selectedAgent, filters]);

  const refetch = async (newFilters?: {
    startDate?: string;
    endDate?: string;
    selectedAgent?: string;
  }) => {
    const filtersToUse = newFilters || filters;
    try {
      setLoading(true);
      const metrics = await intercomService.getMetrics(filtersToUse);
      setData(metrics);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export default IntercomService;
