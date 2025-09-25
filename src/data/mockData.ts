import { IntercomMetrics, StatCard } from '../types/intercom';

export const mockIntercomData: IntercomMetrics = {
  newTickets: 47,
  openTickets: 123,
  closedTickets: 89,
  reopenedTickets: 12,
  ticketsByAgent: [
    { agentName: 'Marie Dubois', ticketsToday: 15 },
    { agentName: 'Jean Martin', ticketsToday: 12 },
    { agentName: 'Sophie Laurent', ticketsToday: 18 },
    { agentName: 'Pierre Moreau', ticketsToday: 9 },
  ],
  workloadByAgent: [
    { agentName: 'Marie Dubois', activeTickets: 8 },
    { agentName: 'Jean Martin', activeTickets: 12 },
    { agentName: 'Sophie Laurent', activeTickets: 6 },
    { agentName: 'Pierre Moreau', activeTickets: 15 },
  ],
  jiraTransferPercentage: 23.5,
  ticketsByPack: [
    { packName: 'Pro', count: 45 },
    { packName: 'Pro+', count: 32 },
    { packName: 'Expert', count: 28 },
    { packName: 'Expert+', count: 18 },
  ],
  hourlyVolume: [
    { hour: '08:00', count: 5 },
    { hour: '09:00', count: 12 },
    { hour: '10:00', count: 18 },
    { hour: '11:00', count: 15 },
    { hour: '12:00', count: 8 },
    { hour: '13:00', count: 6 },
    { hour: '14:00', count: 22 },
    { hour: '15:00', count: 19 },
    { hour: '16:00', count: 14 },
    { hour: '17:00', count: 11 },
  ],
  backlogAge: 5.2,
  postOnboardingVolume: [
    { period: 'Semaine 1', ticketCount: 23 },
    { period: 'Semaine 2', ticketCount: 18 },
    { period: 'Semaine 3', ticketCount: 15 },
    { period: 'Semaine 4', ticketCount: 12 },
  ],
  repeatCustomers: [
    { customerName: 'TechCorp Solutions', ticketCount: 47, lastTicketDate: '2025-09-24' },
    { customerName: 'Digital Innovations', ticketCount: 32, lastTicketDate: '2025-09-23' },
    { customerName: 'CloudFirst Ltd', ticketCount: 28, lastTicketDate: '2025-09-24' },
    { customerName: 'StartupHub Inc', ticketCount: 24, lastTicketDate: '2025-09-22' },
    { customerName: 'Enterprise Systems', ticketCount: 21, lastTicketDate: '2025-09-24' },
    { customerName: 'WebDev Agency', ticketCount: 19, lastTicketDate: '2025-09-23' },
    { customerName: 'DataFlow Corp', ticketCount: 17, lastTicketDate: '2025-09-21' },
    { customerName: 'MobileTech Solutions', ticketCount: 15, lastTicketDate: '2025-09-24' },
    { customerName: 'AI Ventures', ticketCount: 13, lastTicketDate: '2025-09-22' },
    { customerName: 'SaaS Dynamics', ticketCount: 11, lastTicketDate: '2025-09-23' },
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
