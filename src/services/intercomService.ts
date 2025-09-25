import React from 'react';
import { IntercomMetrics } from '../types/intercom';
import { mockIntercomData } from '../data/mockData';

// Configuration de l'API Intercom
const INTERCOM_API_BASE = 'https://api.intercom.io';
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

  // Méthode principale pour récupérer toutes les métriques
  async getMetrics(): Promise<IntercomMetrics> {
    try {
      // Pour le moment, on utilise les données mockées
      // TODO: Implémenter les vraies requêtes API
      
      // const today = new Date().toISOString().split('T')[0];
      // const conversations = await this.getConversations();
      // const admins = await this.getAdmins();
      // const stats = await this.getConversationStats({ type: 'admin' });

      // Transformation des données API en format IntercomMetrics
      // return this.transformApiDataToMetrics(conversations, admins, stats);

      return mockIntercomData;
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

// Hook React pour utiliser le service
export const useIntercomData = () => {
  const [data, setData] = React.useState<IntercomMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const metrics = await intercomService.getMetrics();
        setData(metrics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const metrics = await intercomService.getMetrics();
        setData(metrics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    await fetchData();
  };

  return { data, loading, error, refetch };
};

export default IntercomService;
