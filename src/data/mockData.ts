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
