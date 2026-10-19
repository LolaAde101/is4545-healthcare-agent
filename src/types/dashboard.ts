export type ServiceLine =
  | 'Emergency Medicine'
  | 'Cardiology'
  | 'Oncology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Neurology'
  | 'Obstetrics & Gynecology'
  | 'General Surgery'
  | 'Primary Care';

export type VisitType =
  | 'Inpatient'
  | 'Outpatient'
  | 'Emergency/Trauma'
  | 'Telehealth'
  | 'Ambulatory Surgery';

export type PatientPersona =
  | 'Chronic Disease Senior'
  | 'Tech-Savvy Digital First'
  | 'Working Parent'
  | 'Non-English Native'
  | 'Low Digital Literacy / Rural'
  | 'High-Acuity Acute Care';

export type SentimentCategory = 'Positive' | 'Neutral' | 'Negative';

export type RiskFlagType =
  | 'Hallucination Trap'
  | 'Bias-Related'
  | 'Human Review Required'
  | 'None';

export type ProblemCategory =
  | 'Communication Bottleneck'
  | 'Technology Issue'
  | 'Scheduling Friction'
  | 'Wait-Time Complaint'
  | 'Clinical Quality'
  | 'Facility & Billing';

export interface PatientComment {
  id: string;
  patientId: string;
  date: string;
  serviceLine: ServiceLine;
  visitType: VisitType;
  patientPersona: PatientPersona;
  satisfactionScore: number; // 1 to 5
  communicationRating: number; // 1 to 5
  waitTimeMinutes: number;
  followUpCompliant: boolean;
  comment: string;
  sentiment: SentimentCategory;
  sentimentScore: number; // -1.0 to 1.0
  primaryTheme: string;
  secondaryThemes: string[];
  keywords: string[];
  problemCategory?: ProblemCategory;
  riskFlag: RiskFlagType;
  riskSeverity?: 'Low' | 'Medium' | 'High' | 'Critical';
  riskExplanation?: string;
  equityIssue?: 'Language Barrier' | 'Digital Literacy' | 'Physical Accessibility' | 'Socioeconomic' | 'None';
  reviewStatus?: 'Pending' | 'Under Review' | 'Resolved' | 'Escalated';
  reviewerNotes?: string;
}

export interface FilterState {
  searchQuery: string;
  serviceLine: ServiceLine | 'All';
  visitType: VisitType | 'All';
  patientPersona: PatientPersona | 'All';
  sentiment: SentimentCategory | 'All';
  riskFlag: RiskFlagType | 'All';
  problemCategory: ProblemCategory | 'All';
  dateRange: 'All' | 'Last 30 Days' | 'Q3 2026' | 'Q4 2026';
}

export interface KPIOverview {
  totalComments: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followUpComplianceRate: number;
  serviceLinesCount: number;
  negativeRate: number;
  positiveRate: number;
  highRiskCount: number;
  avgWaitTime: number;
}

export interface ServiceLineStat {
  serviceLine: ServiceLine;
  totalComments: number;
  avgSatisfaction: number;
  avgCommunication: number;
  complaintRate: number;
  followUpRate: number;
  avgWaitTime: number;
  isAnomalyHighComplaints: boolean;
}

export interface ThemeStat {
  theme: string;
  count: number;
  percentage: number;
  avgSatisfaction: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  sentimentRatio: number;
}

export interface KeywordStat {
  keyword: string;
  count: number;
  sentiment: SentimentCategory;
  category: string;
  relevance: number;
}

export interface PersonaStat {
  persona: PatientPersona;
  totalComments: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followUpRate: number;
  accessibilityIssues: number;
  languageIssues: number;
  digitalLiteracyIssues: number;
}

export interface AIAgentOpportunity {
  id: string;
  name: string;
  purpose: string;
  expectedImpact: string;
  serviceLines: ServiceLine[];
  readinessScore: number; // 0-100
  timeToImplement: string;
  targetMetric: string;
  projectedROI: string;
  architectureHighlight: string;
  iconName: string;
}

export interface ExecutiveRecommendation {
  id: string;
  category: 'Top Priority' | 'Quick Win (3 Mo)' | 'Long-Term AI (6-12 Mo)';
  title: string;
  description: string;
  leadStakeholder: string;
  expectedOutcome: string;
  status: 'In Planning' | 'Ready to Deploy' | 'Under Evaluation';
  effort: 'Low' | 'Medium' | 'High';
}
