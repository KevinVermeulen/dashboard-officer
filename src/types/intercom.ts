export interface IntercomMetrics {
  newTickets: number;
  openTickets: number;
  closedTickets: number;
  reopenedTickets: number;
  ticketsByAgent: AgentTickets[];
  workloadByAgent: AgentWorkload[];
  jiraTransferPercentage: number;
  ticketsByPack: PackTickets[];
  hourlyVolume: HourlyVolume[];
  backlogAge: number;
}

export interface AgentTickets {
  agentName: string;
  ticketsToday: number;
}

export interface AgentWorkload {
  agentName: string;
  activeTickets: number;
}

export interface PackTickets {
  packName: 'Pro' | 'Pro+' | 'Expert' | 'Expert+';
  count: number;
}

export interface HourlyVolume {
  hour: string;
  count: number;
}

export interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
}
