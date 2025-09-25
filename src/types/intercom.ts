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
  // General additional metrics
  postOnboardingVolume: PostOnboardingVolume[];
  repeatCustomers: RepeatCustomer[];
  // Efficiency metrics
  efficiency: EfficiencyMetrics;
  // Quality & Satisfaction metrics
  quality: QualityMetrics;
  // AI & Automation metrics
  ai: AIMetrics;
}

export interface EfficiencyMetrics {
  firstResponseTime: {
    global: number; // in minutes
    byPack: PackResponseTime[];
    byAgent: AgentResponseTime[];
  };
  resolutionTime: {
    global: number; // in hours
    byPack: PackResolutionTime[];
    median: number; // in hours
  };
  openTimeBusinessHours: number; // in hours (09:00-17:00)
  autoCloseRate: number; // percentage
  averageExchangesBeforeResolution: number;
  averageExchangesBeforeCall: number;
  resolutionTimeComparison: {
    viaCall: number; // in hours
    viaWritten: number; // in hours
  };
}

export interface PackResponseTime {
  packName: 'Pro' | 'Pro+' | 'Expert' | 'Expert+';
  responseTime: number; // in minutes
}

export interface AgentResponseTime {
  agentName: string;
  responseTime: number; // in minutes
}

export interface PackResolutionTime {
  packName: 'Pro' | 'Pro+' | 'Expert' | 'Expert+';
  resolutionTime: number; // in hours
}

export interface QualityMetrics {
  csat: {
    global: number; // percentage
    byAgent: AgentCSAT[];
    byPack: PackCSAT[];
  };
  nps: number; // Net Promoter Score
  feedbackDistribution: {
    positive: number; // percentage
    negative: number; // percentage
    neutral: number; // percentage
  };
  csatByChannel: {
    viaCall: number; // percentage
    viaWritten: number; // percentage
  };
  day1ResolutionRate: number; // percentage (excluding reopened)
  reopenRate: {
    global: number; // percentage
    byAgent: AgentReopenRate[];
  };
  noBackAndForthRate: number; // percentage of tickets resolved without client back-and-forth
  teamVsIndividualComparison: {
    teamAverage: number; // CSAT percentage
    topPerformer: string; // agent name
    topPerformerScore: number; // CSAT percentage
  };
}

export interface AgentCSAT {
  agentName: string;
  csat: number; // percentage
}

export interface PackCSAT {
  packName: 'Pro' | 'Pro+' | 'Expert' | 'Expert+';
  csat: number; // percentage
}

export interface AgentReopenRate {
  agentName: string;
  reopenRate: number; // percentage
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

export interface PostOnboardingVolume {
  period: string; // e.g., "Semaine 1", "Semaine 2", etc.
  ticketCount: number;
}

export interface RepeatCustomer {
  customerName: string;
  ticketCount: number;
  lastTicketDate: string;
}

export interface AIMetrics {
  finAIOnlyResolution: number; // percentage of tickets resolved by FIN AI alone
  finAIHumanResolution: number; // percentage of tickets resolved by FIN AI + human
  poorlyDocumentedTickets: number; // volume of tickets poorly documented by bot
  documentationSuggestions: DocumentationSuggestion[];
}

export interface DocumentationSuggestion {
  topic: string;
  frequency: number; // how often this topic appears in poorly documented tickets
  suggestedImprovement: string;
}

export interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  bgColor: string;
}
