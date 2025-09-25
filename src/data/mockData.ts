import { IntercomMetrics, StatCard } from '../types/intercom';

export const mockIntercomData: IntercomMetrics = {
  newTickets: 'X' as any,
  openTickets: 'X' as any,
  closedTickets: 'X' as any,
  reopenedTickets: 'X' as any,
  ticketsByAgent: [
    { agentName: 'X', ticketsToday: 'X' as any },
    { agentName: 'X', ticketsToday: 'X' as any },
    { agentName: 'X', ticketsToday: 'X' as any },
    { agentName: 'X', ticketsToday: 'X' as any },
  ],
  workloadByAgent: [
    { agentName: 'X', activeTickets: 'X' as any },
    { agentName: 'X', activeTickets: 'X' as any },
    { agentName: 'X', activeTickets: 'X' as any },
    { agentName: 'X', activeTickets: 'X' as any },
  ],
  jiraTransferPercentage: 'X' as any,
  ticketsByPack: [
    { packName: 'Pro', count: 'X' as any },
    { packName: 'Pro+', count: 'X' as any },
    { packName: 'Expert', count: 'X' as any },
    { packName: 'Expert+', count: 'X' as any },
  ],
  hourlyVolume: [
    { hour: '08:00', count: 'X' as any },
    { hour: '09:00', count: 'X' as any },
    { hour: '10:00', count: 'X' as any },
    { hour: '11:00', count: 'X' as any },
    { hour: '12:00', count: 'X' as any },
    { hour: '13:00', count: 'X' as any },
    { hour: '14:00', count: 'X' as any },
    { hour: '15:00', count: 'X' as any },
    { hour: '16:00', count: 'X' as any },
    { hour: '17:00', count: 'X' as any },
  ],
  backlogAge: 'X' as any,
  postOnboardingVolume: [
    { period: 'Semaine 1', ticketCount: 'X' as any },
    { period: 'Semaine 2', ticketCount: 'X' as any },
    { period: 'Semaine 3', ticketCount: 'X' as any },
    { period: 'Semaine 4', ticketCount: 'X' as any },
  ],
  repeatCustomers: [
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
    { customerName: 'X', ticketCount: 'X' as any, lastTicketDate: 'X' },
  ],
  efficiency: {
    firstResponseTime: {
      global: 45, // 45 minutes
      byPack: [
        { packName: 'Pro', responseTime: 52 },
        { packName: 'Pro+', responseTime: 38 },
        { packName: 'Expert', responseTime: 35 },
        { packName: 'Expert+', responseTime: 28 },
      ],
      byAgent: [
        { agentName: 'Marie Dubois', responseTime: 42 },
        { agentName: 'Jean Martin', responseTime: 48 },
        { agentName: 'Sophie Laurent', responseTime: 35 },
        { agentName: 'Pierre Moreau', responseTime: 55 },
      ],
    },
    resolutionTime: {
      global: 4.2, // 4.2 hours
      byPack: [
        { packName: 'Pro', resolutionTime: 5.1 },
        { packName: 'Pro+', resolutionTime: 3.8 },
        { packName: 'Expert', resolutionTime: 3.2 },
        { packName: 'Expert+', resolutionTime: 2.9 },
      ],
      median: 3.8, // 3.8 hours
    },
    openTimeBusinessHours: 2.3, // 2.3 hours in business hours
    autoCloseRate: 12.5, // 12.5%
    averageExchangesBeforeResolution: 3.2,
    averageExchangesBeforeCall: 5.8,
    resolutionTimeComparison: {
      viaCall: 1.8, // 1.8 hours
      viaWritten: 4.9, // 4.9 hours
    },
  },
  quality: {
    csat: {
      global: 87.5, // 87.5%
      byAgent: [
        { agentName: 'Marie Dubois', csat: 92.3 },
        { agentName: 'Jean Martin', csat: 85.7 },
        { agentName: 'Sophie Laurent', csat: 89.1 },
        { agentName: 'Pierre Moreau', csat: 83.4 },
      ],
      byPack: [
        { packName: 'Pro', csat: 84.2 },
        { packName: 'Pro+', csat: 87.8 },
        { packName: 'Expert', csat: 90.1 },
        { packName: 'Expert+', csat: 93.5 },
      ],
    },
    nps: 42, // Net Promoter Score
    feedbackDistribution: {
      positive: 72.3, // 72.3%
      negative: 15.2, // 15.2%
      neutral: 12.5, // 12.5%
    },
    csatByChannel: {
      viaCall: 91.2, // 91.2%
      viaWritten: 85.8, // 85.8%
    },
    day1ResolutionRate: 68.4, // 68.4%
    reopenRate: {
      global: 8.7, // 8.7%
      byAgent: [
        { agentName: 'Marie Dubois', reopenRate: 6.2 },
        { agentName: 'Jean Martin', reopenRate: 9.8 },
        { agentName: 'Sophie Laurent', reopenRate: 7.1 },
        { agentName: 'Pierre Moreau', reopenRate: 11.5 },
      ],
    },
    noBackAndForthRate: 45.6, // 45.6%
    teamVsIndividualComparison: {
      teamAverage: 87.5, // 87.5%
      topPerformer: 'Marie Dubois',
      topPerformerScore: 92.3, // 92.3%
    },
  },
  ai: {
    finAIOnlyResolution: 34.2, // 34.2% of tickets resolved by FIN AI alone
    finAIHumanResolution: 28.7, // 28.7% of tickets resolved by FIN AI + human
    poorlyDocumentedTickets: 23, // 23 tickets poorly documented by bot
    documentationSuggestions: [
      {
        topic: 'Configuration API',
        frequency: 8,
        suggestedImprovement: 'Ajouter des exemples de code pour les endpoints de configuration'
      },
      {
        topic: 'Gestion des erreurs',
        frequency: 6,
        suggestedImprovement: 'Créer une section dédiée aux codes d\'erreur courants'
      },
      {
        topic: 'Authentification OAuth',
        frequency: 5,
        suggestedImprovement: 'Détailler le processus d\'authentification avec captures d\'écran'
      },
      {
        topic: 'Webhooks',
        frequency: 4,
        suggestedImprovement: 'Ajouter des exemples de payload et de validation'
      },
      {
        topic: 'Limites de taux',
        frequency: 3,
        suggestedImprovement: 'Expliquer les stratégies de retry et backoff'
      },
    ],
  },
};

export const getStatCards = (data: IntercomMetrics): StatCard[] => [
  {
    title: 'Nouveaux Tickets',
    value: data.newTickets,
    icon: '📝',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  {
    title: 'Tickets Ouverts',
    value: data.openTickets,
    icon: '📋',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
  {
    title: 'Tickets Fermés',
    value: data.closedTickets,
    icon: '✅',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
  },
  {
    title: 'Tickets Rouverts',
    value: data.reopenedTickets,
    icon: '🔄',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
  },
  {
    title: 'Transfert Jira',
    value: `${data.jiraTransferPercentage}%`,
    icon: '🔗',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
  },
  {
    title: 'Âge Backlog',
    value: `${data.backlogAge}j`,
    icon: '⏰',
    color: 'text-red-600',
    bgColor: 'bg-red-500',
  },
];
