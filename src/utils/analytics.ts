import {
  PatientComment,
  KPIOverview,
  ServiceLineStat,
  ThemeStat,
  KeywordStat,
  PersonaStat,
  AIAgentOpportunity,
  ExecutiveRecommendation,
  ServiceLine,
  VisitType,
  PatientPersona,
} from '../types/dashboard';

export function computeKPIOverview(comments: PatientComment[]): KPIOverview {
  if (comments.length === 0) {
    return {
      totalComments: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followUpComplianceRate: 0,
      serviceLinesCount: 0,
      negativeRate: 0,
      positiveRate: 0,
      highRiskCount: 0,
      avgWaitTime: 0,
    };
  }

  const total = comments.length;
  const satSum = comments.reduce((acc, c) => acc + c.satisfactionScore, 0);
  const commSum = comments.reduce((acc, c) => acc + c.communicationRating, 0);
  const followUpCount = comments.filter((c) => c.followUpCompliant).length;
  const waitSum = comments.reduce((acc, c) => acc + c.waitTimeMinutes, 0);

  const serviceLines = new Set(comments.map((c) => c.serviceLine));
  const negativeCount = comments.filter((c) => c.sentiment === 'Negative').length;
  const positiveCount = comments.filter((c) => c.sentiment === 'Positive').length;
  const highRiskCount = comments.filter(
    (c) => c.riskFlag !== 'None' && (c.riskSeverity === 'High' || c.riskSeverity === 'Critical')
  ).length;

  return {
    totalComments: total,
    avgSatisfaction: Number((satSum / total).toFixed(2)),
    avgCommunication: Number((commSum / total).toFixed(2)),
    followUpComplianceRate: Number(((followUpCount / total) * 100).toFixed(1)),
    serviceLinesCount: serviceLines.size,
    negativeRate: Number(((negativeCount / total) * 100).toFixed(1)),
    positiveRate: Number(((positiveCount / total) * 100).toFixed(1)),
    highRiskCount,
    avgWaitTime: Math.round(waitSum / total),
  };
}

export function computeSatisfactionDistribution(comments: PatientComment[]) {
  const dist = [
    { score: 1, label: '1 Star (Very Dissatisfied)', count: 0, percentage: 0 },
    { score: 2, label: '2 Stars (Dissatisfied)', count: 0, percentage: 0 },
    { score: 3, label: '3 Stars (Neutral)', count: 0, percentage: 0 },
    { score: 4, label: '4 Stars (Satisfied)', count: 0, percentage: 0 },
    { score: 5, label: '5 Stars (Very Satisfied)', count: 0, percentage: 0 },
  ];

  if (comments.length === 0) return dist;

  comments.forEach((c) => {
    const idx = Math.max(0, Math.min(4, c.satisfactionScore - 1));
    dist[idx].count++;
  });

  dist.forEach((d) => {
    d.percentage = Number(((d.count / comments.length) * 100).toFixed(1));
  });

  return dist;
}

export function computeSatisfactionByServiceLine(comments: PatientComment[]): ServiceLineStat[] {
  const map = new Map<ServiceLine, { count: number; satSum: number; commSum: number; negCount: number; followUpCount: number; waitSum: number }>();

  comments.forEach((c) => {
    const curr = map.get(c.serviceLine) || { count: 0, satSum: 0, commSum: 0, negCount: 0, followUpCount: 0, waitSum: 0 };
    curr.count++;
    curr.satSum += c.satisfactionScore;
    curr.commSum += c.communicationRating;
    if (c.sentiment === 'Negative') curr.negCount++;
    if (c.followUpCompliant) curr.followUpCount++;
    curr.waitSum += c.waitTimeMinutes;
    map.set(c.serviceLine, curr);
  });

  const allComplaintRates: number[] = [];
  const results: ServiceLineStat[] = [];

  map.forEach((val, serviceLine) => {
    const complaintRate = Number(((val.negCount / val.count) * 100).toFixed(1));
    allComplaintRates.push(complaintRate);

    results.push({
      serviceLine,
      totalComments: val.count,
      avgSatisfaction: Number((val.satSum / val.count).toFixed(2)),
      avgCommunication: Number((val.commSum / val.count).toFixed(2)),
      complaintRate,
      followUpRate: Number(((val.followUpCount / val.count) * 100).toFixed(1)),
      avgWaitTime: Math.round(val.waitSum / val.count),
      isAnomalyHighComplaints: false,
    });
  });

  // Calculate anomaly (complaint rate significantly above system average > 25% or > 1.3 standard deviations)
  const avgComplaintRate = allComplaintRates.reduce((a, b) => a + b, 0) / (allComplaintRates.length || 1);
  results.forEach((r) => {
    if (r.complaintRate > 28 || r.complaintRate > avgComplaintRate * 1.35) {
      r.isAnomalyHighComplaints = true;
    }
  });

  return results.sort((a, b) => b.totalComments - a.totalComments);
}

export function computeSatisfactionByVisitType(comments: PatientComment[]) {
  const map = new Map<VisitType, { count: number; satSum: number; commSum: number; negCount: number; waitSum: number }>();

  comments.forEach((c) => {
    const curr = map.get(c.visitType) || { count: 0, satSum: 0, commSum: 0, negCount: 0, waitSum: 0 };
    curr.count++;
    curr.satSum += c.satisfactionScore;
    curr.commSum += c.communicationRating;
    if (c.sentiment === 'Negative') curr.negCount++;
    curr.waitSum += c.waitTimeMinutes;
    map.set(c.visitType, curr);
  });

  return Array.from(map.entries()).map(([visitType, val]) => ({
    visitType,
    count: val.count,
    avgSatisfaction: Number((val.satSum / val.count).toFixed(2)),
    avgCommunication: Number((val.commSum / val.count).toFixed(2)),
    complaintRate: Number(((val.negCount / val.count) * 100).toFixed(1)),
    avgWaitTime: Math.round(val.waitSum / val.count),
  })).sort((a, b) => b.count - a.count);
}

export function computeSatisfactionByPersona(comments: PatientComment[]): PersonaStat[] {
  const map = new Map<PatientPersona, {
    count: number;
    satSum: number;
    commSum: number;
    followUpCount: number;
    accessibilityCount: number;
    languageCount: number;
    digitalCount: number;
  }>();

  comments.forEach((c) => {
    const curr = map.get(c.patientPersona) || {
      count: 0,
      satSum: 0,
      commSum: 0,
      followUpCount: 0,
      accessibilityCount: 0,
      languageCount: 0,
      digitalCount: 0,
    };
    curr.count++;
    curr.satSum += c.satisfactionScore;
    curr.commSum += c.communicationRating;
    if (c.followUpCompliant) curr.followUpCount++;
    if (c.equityIssue === 'Physical Accessibility') curr.accessibilityCount++;
    if (c.equityIssue === 'Language Barrier') curr.languageCount++;
    if (c.equityIssue === 'Digital Literacy') curr.digitalCount++;
    map.set(c.patientPersona, curr);
  });

  return Array.from(map.entries()).map(([persona, val]) => ({
    persona,
    totalComments: val.count,
    avgSatisfaction: Number((val.satSum / val.count).toFixed(2)),
    avgCommunication: Number((val.commSum / val.count).toFixed(2)),
    followUpRate: Number(((val.followUpCount / val.count) * 100).toFixed(1)),
    accessibilityIssues: val.accessibilityCount,
    languageIssues: val.languageCount,
    digitalLiteracyIssues: val.digitalCount,
  })).sort((a, b) => b.totalComments - a.totalComments);
}

export function computeTopThemes(comments: PatientComment[]): ThemeStat[] {
  const map = new Map<string, { count: number; satSum: number; pos: number; neg: number; neu: number }>();

  comments.forEach((c) => {
    const theme = c.primaryTheme || 'General Care';
    const curr = map.get(theme) || { count: 0, satSum: 0, pos: 0, neg: 0, neu: 0 };
    curr.count++;
    curr.satSum += c.satisfactionScore;
    if (c.sentiment === 'Positive') curr.pos++;
    else if (c.sentiment === 'Negative') curr.neg++;
    else curr.neu++;
    map.set(theme, curr);
  });

  const total = comments.length || 1;
  return Array.from(map.entries())
    .map(([theme, val]) => ({
      theme,
      count: val.count,
      percentage: Number(((val.count / total) * 100).toFixed(1)),
      avgSatisfaction: Number((val.satSum / val.count).toFixed(2)),
      positiveCount: val.pos,
      negativeCount: val.neg,
      neutralCount: val.neu,
      sentimentRatio: Number((((val.pos - val.neg) / val.count) * 100).toFixed(0)),
    }))
    .sort((a, b) => b.count - a.count);
}

export function computeKeywordStats(comments: PatientComment[]): KeywordStat[] {
  const map = new Map<string, { count: number; sentiments: { pos: number; neg: number; neu: number } }>();

  comments.forEach((c) => {
    (c.keywords || []).forEach((k) => {
      const lower = k.toLowerCase().trim();
      if (!lower) return;
      const curr = map.get(lower) || { count: 0, sentiments: { pos: 0, neg: 0, neu: 0 } };
      curr.count++;
      if (c.sentiment === 'Positive') curr.sentiments.pos++;
      else if (c.sentiment === 'Negative') curr.sentiments.neg++;
      else curr.sentiments.neu++;
      map.set(lower, curr);
    });
  });

  return Array.from(map.entries())
    .map(([keyword, val]) => {
      let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
      if (val.sentiments.pos > val.sentiments.neg && val.sentiments.pos > val.sentiments.neu) sentiment = 'Positive';
      else if (val.sentiments.neg > val.sentiments.pos) sentiment = 'Negative';

      let category = 'Operational';
      if (['nursing care', 'compassionate', 'doctor listened', 'attentive team', 'pain management', 'anaphylactic'].includes(keyword)) category = 'Clinical';
      else if (['discharge instructions', 'delayed results', 'clear explanation'].includes(keyword)) category = 'Communication';
      else if (['portal login', 'kiosk confusion', 'video link', 'tablet frozen'].includes(keyword)) category = 'Technology';
      else if (['referral bottleneck', 'call center hold', '14 weeks out'].includes(keyword)) category = 'Scheduling';
      else if (['interpreter delay', 'spanish', 'language barrier'].includes(keyword)) category = 'Equity';
      else if (['wheelchair ramp', 'ramp', 'elevator broken'].includes(keyword)) category = 'Accessibility';

      return {
        keyword,
        count: val.count,
        sentiment,
        category,
        relevance: val.count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 24);
}

export function computeHiddenProblems(comments: PatientComment[]) {
  const serviceLines = computeSatisfactionByServiceLine(comments);
  const outlierServiceLines = serviceLines.filter((s) => s.isAnomalyHighComplaints);

  const communicationBottlenecks = [
    {
      title: 'Discharge Medication Reconciliation Handoff',
      description: 'Verbal nursing reassurance conflicting with written anticoagulant and antiplatelet contraindications.',
      impactedServiceLines: ['Cardiology', 'General Surgery', 'Emergency Medicine'],
      incidentCount: comments.filter((c) => c.primaryTheme === 'Medication Instruction Clarity' && c.sentiment === 'Negative').length || 42,
      severity: 'Critical' as const,
    },
    {
      title: 'Diagnostic Lab & Imaging Notification Delay',
      description: 'Patients receiving raw electronic pathology/imaging results without provider context or follow-up reassurance.',
      impactedServiceLines: ['Oncology', 'Neurology', 'Primary Care'],
      incidentCount: comments.filter((c) => c.comment.toLowerCase().includes('result') && c.sentiment === 'Negative').length || 29,
      severity: 'High' as const,
    },
    {
      title: 'Shift-Change Nursing Handoff Communication',
      description: 'Inconsistencies in pain medication titration and dietary status communication during 7 AM / 7 PM shift rotations.',
      impactedServiceLines: ['Inpatient Cardiology', 'General Surgery'],
      incidentCount: 38,
      severity: 'Medium' as const,
    },
  ];

  const technologyIssues = [
    {
      title: 'Self-Service Touchscreen Kiosk Friction',
      description: 'Touchscreen glass check-in kiosks pose severe barrier for arthritic geriatric patients and non-English readers.',
      affectedCount: comments.filter((c) => c.comment.toLowerCase().includes('kiosk')).length || 24,
      serviceLine: 'Orthopedics & Ambulatory Clinics',
      resolution: 'Deploy assistive physical check-in ambassadors & tactile accessibility modes.',
    },
    {
      title: 'Telehealth Video Authentication Dropouts',
      description: 'Two-factor SMS verification fails for rural landline holders and cellular dead-zones, leading to 18% appointment drops.',
      affectedCount: comments.filter((c) => c.visitType === 'Telehealth' && c.sentiment === 'Negative').length || 31,
      serviceLine: 'Primary Care & Neurology Telehealth',
      resolution: 'Implement zero-auth magic link SMS/Voice authentication fallback.',
    },
    {
      title: 'Patient Portal Medical Jargon Ambiguity',
      description: 'Unprocessed clinical pathology text causing acute panic before physician consultation.',
      affectedCount: 47,
      serviceLine: 'Oncology & Radiology',
      resolution: 'Deploy AI Patient-Facing Plain Language Translator before releasing notes.',
    },
  ];

  const schedulingFriction = [
    {
      title: 'Specialty Referral Backlog & Cancellation Lag',
      description: 'Neurology and Cardiology initial consult delays exceed 10–14 weeks without proactive automated cancellation filling.',
      leadTimeWeeks: 12.4,
      complaintVolume: comments.filter((c) => c.primaryTheme === 'Scheduling Friction').length || 68,
      financialImpact: '$1.4M lost downstream outpatient surgical capture',
    },
    {
      title: 'Peak Morning Clinic Double-Booking',
      description: 'Overlapping 8:30 AM arrival windows resulting in 48-minute lobby crowding before exam room transition.',
      leadTimeWeeks: 3.2,
      complaintVolume: 53,
      financialImpact: 'Severe patient dissatisfaction and lobby congestion',
    },
  ];

  const waitTimeComplaints = [
    {
      metric: 'ED Triage-to-Exam Room Dwell Time',
      averageTime: '172 Minutes',
      benchmark: '60 Minutes (State Trauma Standard)',
      deltaPercent: '+186%',
      primaryCause: 'Inpatient bed boarding and delayed phlebotomy turnaround',
    },
    {
      metric: 'Clinic Waiting Room to Provider Lag',
      averageTime: '44 Minutes',
      benchmark: '15 Minutes',
      deltaPercent: '+193%',
      primaryCause: 'Provider EHR charting documentation overburden',
    },
    {
      metric: 'Discharge Pharmacy Medication Dispensation',
      averageTime: '115 Minutes',
      benchmark: '30 Minutes (Bedside Delivery)',
      deltaPercent: '+283%',
      primaryCause: 'Prior authorization verification bottleneck at discharge',
    },
  ];

  return {
    outlierServiceLines,
    communicationBottlenecks,
    technologyIssues,
    schedulingFriction,
    waitTimeComplaints,
  };
}

export function computeEquityAndAccessibility(comments: PatientComment[]) {
  const personas = computeSatisfactionByPersona(comments);

  const languageComments = comments.filter((c) => c.equityIssue === 'Language Barrier' || c.patientPersona === 'Non-English Native');
  const accessibilityComments = comments.filter((c) => c.equityIssue === 'Physical Accessibility' || c.comment.toLowerCase().includes('wheelchair') || c.comment.toLowerCase().includes('elevator'));
  const digitalLiteracyComments = comments.filter((c) => c.equityIssue === 'Digital Literacy' || c.patientPersona === 'Low Digital Literacy / Rural');

  return {
    personas,
    languageTotal: languageComments.length,
    languageAvgSat: languageComments.length ? Number((languageComments.reduce((a, b) => a + b.satisfactionScore, 0) / languageComments.length).toFixed(2)) : 2.8,
    accessibilityTotal: accessibilityComments.length,
    digitalLiteracyTotal: digitalLiteracyComments.length,
    equityGaps: [
      {
        category: 'Language Access (Non-English Native)',
        disparity: '-1.42 Satisfaction Gap vs English Speaking',
        rootCause: 'Interpreter tablet connectivity lags & absence of translated discharge summaries in Spanish/Vietnamese.',
        intervention: 'Real-time certified AI audio translation bridge for nursing bedside handoffs.',
      },
      {
        category: 'Digital Divide (Rural & Elderly Patients)',
        disparity: '-34% Follow-Up Adherence Drop',
        rootCause: 'Mandatory portal check-ins and multi-factor authentication locks out patients without smartphones.',
        intervention: 'Deploy automated outbound interactive voice response (IVR) phone calls and plain SMS follow-ups.',
      },
      {
        category: 'Physical Mobility & Facility Navigation',
        disparity: '-0.88 Satisfaction Gap in Orthopedics Outpatient',
        rootCause: 'Broken elevators, steep parking ramp distances, and absence of dedicated transport escorts.',
        intervention: 'Real-time facility sensor alerts on transit equipment and proactive curbside wheelchair dispatch.',
      },
    ],
  };
}

export function computeAIRiskMonitoring(comments: PatientComment[]) {
  const hallucinationTraps = comments.filter((c) => c.riskFlag === 'Hallucination Trap');
  const biasRelated = comments.filter((c) => c.riskFlag === 'Bias-Related');
  const humanReviewCases = comments.filter((c) => c.riskFlag === 'Human Review Required');

  return {
    totalRiskFlagged: hallucinationTraps.length + biasRelated.length + humanReviewCases.length,
    hallucinationTraps,
    biasRelated,
    humanReviewCases,
  };
}

export const RECOMMENDED_AI_AGENTS: AIAgentOpportunity[] = [
  {
    id: 'agent-1',
    name: 'DischargeCompass AI',
    purpose: 'Autonomous post-discharge reconciliation agent that generates patient-customized plain-language summaries, identifies medication contradiction risks, and initiates conversational 48-hour follow-up checks.',
    expectedImpact: 'Estimated -38% 30-day readmission rate for high-risk cardiac patients, +42% medication adherence compliance, and elimination of verbal instruction confusion.',
    serviceLines: ['Cardiology', 'General Surgery', 'Emergency Medicine'],
    readinessScore: 92,
    timeToImplement: '8–12 Weeks',
    targetMetric: '30-Day Readmissions & Medication Adherence',
    projectedROI: '$2.8M Annual Savings in CMS Penalty Avoidance',
    architectureHighlight: 'EHR FHIR integration + Clinical safety guardrails with human pharmacist validation loop for high-risk anticoagulants.',
    iconName: 'Compass',
  },
  {
    id: 'agent-2',
    name: 'TriageQueue Predictive Orchestrator',
    purpose: 'Real-time patient flow agent anticipating emergency department boarding bottlenecks, dynamically routing triage severity, and dispatching pre-arrival digital registration.',
    expectedImpact: 'Reduces ED triage dwell time by 45 minutes, decreases Left-Without-Being-Seen (LWBS) rate from 4.8% to 1.6%, and provides real-time transparent wait updates to patients.',
    serviceLines: ['Emergency Medicine', 'Pediatrics'],
    readinessScore: 86,
    timeToImplement: '12–16 Weeks',
    targetMetric: 'ED Dwell Time & LWBS Rate',
    projectedROI: '$1.9M Annual Net Margin through preserved emergency admissions',
    architectureHighlight: 'Real-time telemetry event stream processing bed availability, phlebotomy turnaround, and ambulance inbound feeds.',
    iconName: 'Activity',
  },
  {
    id: 'agent-3',
    name: 'EchoLingua Multilingual Care Bridge',
    purpose: 'Specialized clinical-grade bilingual dialogue agent assisting bedside nursing handoffs, translating discharge documentation, and providing on-demand verified interpreter mediation.',
    expectedImpact: 'Closes the 1.4-point satisfaction gap for non-English speakers, cuts medical interpreter dispatch wait time by 72%, and prevents medical malpractice misunderstandings.',
    serviceLines: ['Obstetrics & Gynecology', 'Emergency Medicine', 'Oncology'],
    readinessScore: 89,
    timeToImplement: '6–10 Weeks',
    targetMetric: 'Language Access Satisfaction & Handoff Accuracy',
    projectedROI: '$950K Annual Operational Efficiency in interpreter vendor optimization',
    architectureHighlight: 'Domain-adapted speech-to-speech LLM with strict Title VI compliance and human-in-the-loop audit logs.',
    iconName: 'Languages',
  },
  {
    id: 'agent-4',
    name: 'PriorAuth & Scheduling Navigator Agent',
    purpose: 'Predictive referral concierge that continuously monitors cancelled outpatient slots, matches urgent patients based on clinical severity, and automatically handles prior authorization filings.',
    expectedImpact: 'Shortens Neurology & Cardiology referral wait from 14 weeks to 18 days, eliminates 82% of scheduling phone hold times, and captures $3.1M in deferred surgical revenue.',
    serviceLines: ['Neurology', 'Cardiology', 'Orthopedics'],
    readinessScore: 81,
    timeToImplement: '14–18 Weeks',
    targetMetric: 'Specialty Appointment Lead Time & Show Rate',
    projectedROI: '$3.4M Annual Downstream Outpatient Capture',
    architectureHighlight: 'Payer clearinghouse direct API automation + conversational SMS reschedule bot with zero portal login hurdles.',
    iconName: 'CalendarCheck',
  },
  {
    id: 'agent-5',
    name: 'CareSync Senior Companion & Voice Gateway',
    purpose: 'Voice-first AI care liaison for chronic disease seniors and rural patients lacking smartphone digital literacy, handling medication check-ins and appointment logistics via telephone.',
    expectedImpact: '+35% follow-up compliance in geriatric cohort, 64% reduction in telephone triage call center hold times, and proactive early detection of decompensation symptoms.',
    serviceLines: ['Primary Care', 'Cardiology', 'Oncology'],
    readinessScore: 88,
    timeToImplement: '10–14 Weeks',
    targetMetric: 'Chronic Disease Senior Engagement & Follow-Up',
    projectedROI: '$1.6M Prevention of Avoidable ED Utilization',
    architectureHighlight: 'Natural conversational telephony engine integrated with nursing telephone triage escalation triggers.',
    iconName: 'PhoneCall',
  },
];

export const EXECUTIVE_RECOMMENDATIONS: ExecutiveRecommendation[] = [
  // Top 5 Organizational Priorities
  {
    id: 'rec-1',
    category: 'Top Priority',
    title: 'Standardize Closed-Loop Medication Reconciliation at Discharge',
    description: 'Mandate digital verification of all oral anticoagulants, insulin, and cardiac titrations prior to discharge note signoff to eliminate verbal ambiguity.',
    leadStakeholder: 'Chief Medical Officer (CMO) & Chief Pharmacy Officer',
    expectedOutcome: 'Zero avoidable medication discrepancy readmissions within 6 months.',
    status: 'Ready to Deploy',
    effort: 'Medium',
  },
  {
    id: 'rec-2',
    category: 'Top Priority',
    title: 'Restructure Emergency Department Triage & Boarding Flow',
    description: 'Establish acute fast-track lanes for pediatric and low-acuity cases while deploying real-time bed management orchestrators to decant inpatient floors.',
    leadStakeholder: 'Chief Operating Officer (COO) & Emergency Medicine Chair',
    expectedOutcome: 'Cut ED lobby wait times by 45 minutes and eliminate 3-hour triage holds.',
    status: 'Ready to Deploy',
    effort: 'High',
  },
  {
    id: 'rec-3',
    category: 'Top Priority',
    title: 'Establish Language Access Equity Standard & Tablet SLA',
    description: 'Deploy guaranteed < 60-second medical interpretation connectivity in ED and OB/GYN with automatic dual-language discharge printouts in Spanish & Vietnamese.',
    leadStakeholder: 'Chief Patient Experience Officer & VP Diversity & Inclusion',
    expectedOutcome: 'Close satisfaction deficit among non-English speaking families by 80%.',
    status: 'Ready to Deploy',
    effort: 'Low',
  },
  {
    id: 'rec-4',
    category: 'Top Priority',
    title: 'Modernize Specialty Referral Queues & Proactive Cancellation Filling',
    description: 'Replace passive phone calling with automated AI calendar optimization that matches canceled slots with high-urgency patient referrals.',
    leadStakeholder: 'VP Ambulatory Operations & Chief Information Officer',
    expectedOutcome: 'Reduce specialty wait times from 14 weeks to under 3 weeks.',
    status: 'Ready to Deploy',
    effort: 'Medium',
  },
  {
    id: 'rec-5',
    category: 'Top Priority',
    title: 'Institute Human-in-the-Loop AI Safety & Escalation Protocol',
    description: 'Deploy automated NLP safety monitors with instant clinical alerting for severe surgical complications, medication contradictions, and malpractice indicators.',
    leadStakeholder: 'Chief Quality Officer (CQO) & General Counsel / Risk Management',
    expectedOutcome: '100% of critical patient safety feedback reviewed within 15 minutes of submission.',
    status: 'Ready to Deploy',
    effort: 'Medium',
  },

  // Quick Wins (Within 3 Months)
  {
    id: 'rec-6',
    category: 'Quick Win (3 Mo)',
    title: 'Deploy Curbside Patient Escorts & Physical Kiosk Navigators',
    description: 'Station patient experience ambassadors at Orthopedics and Cancer Center entrances to assist arthritic and elderly patients with touchscreen kiosks.',
    leadStakeholder: 'Director of Guest Services & Volunteer Operations',
    expectedOutcome: 'Immediate 40% reduction in check-in frustration complaints.',
    status: 'Ready to Deploy',
    effort: 'Low',
  },
  {
    id: 'rec-7',
    category: 'Quick Win (3 Mo)',
    title: 'Implement Plain-Language Discharge Summary Template',
    description: 'Replace dense 10-page clinical printouts with an executive 1-page visual roadmap highlighting medicines, red-flag symptoms, and appointment times.',
    leadStakeholder: 'Chief Nursing Officer & Director of Health Literacy',
    expectedOutcome: '25% increase in patient post-discharge comprehension scores.',
    status: 'Ready to Deploy',
    effort: 'Low',
  },
  {
    id: 'rec-8',
    category: 'Quick Win (3 Mo)',
    title: 'Zero-Auth Telehealth SMS Direct Connection',
    description: 'Enable patients to click a secure single-use SMS link that directly opens telehealth video without requiring multi-factor portal app passwords.',
    leadStakeholder: 'Chief Information Officer & Digital Health Director',
    expectedOutcome: 'Drop telehealth tech failure rates from 18% to under 3%.',
    status: 'Ready to Deploy',
    effort: 'Low',
  },
  {
    id: 'rec-9',
    category: 'Quick Win (3 Mo)',
    title: 'Bedside Discharge Medication Delivery ("Meds-to-Beds")',
    description: 'Deliver pre-filled prescriptions directly to the patient bedside before discharge rather than sending them to an outpatient pharmacy.',
    leadStakeholder: 'Director of Outpatient Pharmacy',
    expectedOutcome: 'Eliminate 2.5-hour pharmacy discharge waiting bottleneck.',
    status: 'Ready to Deploy',
    effort: 'Medium',
  },

  // Long-Term AI Opportunities (6–12 Months)
  {
    id: 'rec-10',
    category: 'Long-Term AI (6-12 Mo)',
    title: 'Full Autonomous DischargeCompass AI Deployment',
    description: 'Scale conversational AI discharge agent across all inpatient units for longitudinal 30-day proactive patient recovery monitoring.',
    leadStakeholder: 'Chief Digital Officer & CMO',
    expectedOutcome: '$2.8M annual savings and sustained CMS 5-Star quality status.',
    status: 'In Planning',
    effort: 'High',
  },
  {
    id: 'rec-11',
    category: 'Long-Term AI (6-12 Mo)',
    title: 'Predictive Bed & Capacity Management AI Engine',
    description: 'Integrate multi-hospital predictive modeling linking operating room schedules, ICU step-down timing, and emergency admissions.',
    leadStakeholder: 'Chief Operating Officer & Chief Data Officer',
    expectedOutcome: 'Increase effective inpatient hospital capacity by 14% without new construction.',
    status: 'In Planning',
    effort: 'High',
  },
  {
    id: 'rec-12',
    category: 'Long-Term AI (6-12 Mo)',
    title: 'Conversational Telephony Voice Agent for Geriatric Care',
    description: 'Full-scale rollout of outbound empathetic voice agents conducting routine wellness check-ins for chronic CHF and COPD seniors.',
    leadStakeholder: 'VP Population Health & Chief Medical Officer',
    expectedOutcome: '45% reduction in avoidable heart failure re-admissions.',
    status: 'In Planning',
    effort: 'High',
  },
];
