import { DEFAULT_PATIENT_FEEDBACK, generateFeedbackDataset } from './mockFeedbackData';
import {
  PatientComment,
  ServiceLine,
  VisitType,
  PatientPersona,
  SentimentCategory,
  RiskFlagType,
  ProblemCategory,
} from '../types/dashboard';

export interface DatasetPreset {
  id: string;
  name: string;
  facility: string;
  description: string;
  count: number;
  data: PatientComment[];
}

export const PRESET_DATASETS: DatasetPreset[] = [
  {
    id: 'metro-enterprise',
    name: 'Enterprise System-Wide (1,248 Comments)',
    facility: 'Metropolitan Academic Medical Center',
    description: 'Comprehensive cross-service line dataset covering ED, Oncology, Cardiology, Ortho, Surgery, and Primary Care.',
    count: 1248,
    data: DEFAULT_PATIENT_FEEDBACK,
  },
  {
    id: 'surge-acute',
    name: 'Emergency & Inpatient Surge Cohort (820 Comments)',
    facility: 'St. Jude Regional Trauma Center',
    description: 'High-acuity, triage wait-time bottlenecks, critical communication handoffs, and urgent surgical review cases.',
    count: 820,
    data: generateFeedbackDataset(820),
  },
  {
    id: 'ambulatory-specialty',
    name: 'Ambulatory & Chronic Care Cohort (960 Comments)',
    facility: 'Crestview Outpatient & Cancer Pavilion',
    description: 'Outpatient oncology, telehealth navigation, pharmacy discharge lag, and digital literacy focus cohort.',
    count: 960,
    data: generateFeedbackDataset(960),
  },
];

// CSV Parser for user-uploaded custom patient feedback datasets
export function parseFeedbackCSV(csvText: string): PatientComment[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header row
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));

  const findCol = (aliases: string[]) => {
    return headers.findIndex((h) => aliases.some((a) => h.includes(a)));
  };

  const commentIdx = findCol(['comment', 'feedback', 'text', 'verbatim', 'review']);
  const serviceLineIdx = findCol(['service', 'department', 'unit', 'clinic']);
  const visitTypeIdx = findCol(['visit', 'type', 'encounter', 'setting']);
  const personaIdx = findCol(['persona', 'demographic', 'patient_type', 'group']);
  const satisfactionIdx = findCol(['satisfaction', 'score', 'rating', 'csat', 'stars']);
  const commRatingIdx = findCol(['communication', 'provider_rating', 'doctor_comm']);
  const waitTimeIdx = findCol(['wait', 'delay', 'minutes', 'duration']);
  const followUpIdx = findCol(['follow_up', 'followup', 'compliant', 'adherence']);

  const parsedComments: PatientComment[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (!rawLine.trim()) continue;
    const values = parseCSVLine(rawLine);

    const comment = commentIdx >= 0 && values[commentIdx] ? values[commentIdx].trim() : `Patient feedback record #${i}`;
    const rawServiceLine = serviceLineIdx >= 0 && values[serviceLineIdx] ? values[serviceLineIdx].trim() : 'General Medicine';
    const rawVisitType = visitTypeIdx >= 0 && values[visitTypeIdx] ? values[visitTypeIdx].trim() : 'Outpatient';
    const rawPersona = personaIdx >= 0 && values[personaIdx] ? values[personaIdx].trim() : 'General Patient';

    const rawSat = satisfactionIdx >= 0 ? parseFloat(values[satisfactionIdx]) : 4;
    const satisfactionScore = Math.max(1, Math.min(5, Math.round(isNaN(rawSat) ? 4 : rawSat)));

    const rawComm = commRatingIdx >= 0 ? parseFloat(values[commRatingIdx]) : satisfactionScore;
    const communicationRating = Math.max(1, Math.min(5, Math.round(isNaN(rawComm) ? 4 : rawComm)));

    const rawWait = waitTimeIdx >= 0 ? parseInt(values[waitTimeIdx], 10) : 25;
    const waitTimeMinutes = isNaN(rawWait) ? 25 : rawWait;

    const rawFollow = followUpIdx >= 0 ? values[followUpIdx].toLowerCase() : 'true';
    const followUpCompliant = rawFollow === 'true' || rawFollow === '1' || rawFollow === 'yes';

    // Simple NLP classification
    const lower = comment.toLowerCase();
    let sentiment: SentimentCategory = 'Positive';
    let sentimentScore = 0.8;
    if (satisfactionScore <= 2 || lower.includes('worst') || lower.includes('horrible') || lower.includes('waited') || lower.includes('dismissed') || lower.includes('error')) {
      sentiment = 'Negative';
      sentimentScore = -0.7;
    } else if (satisfactionScore === 3 || lower.includes('okay') || lower.includes('average')) {
      sentiment = 'Neutral';
      sentimentScore = 0.0;
    }

    // Classify Theme
    let primaryTheme = 'Bedside Empathy & Nursing Care';
    if (lower.includes('wait') || lower.includes('delay') || lower.includes('hours')) {
      primaryTheme = 'Wait Time & Triage Lag';
    } else if (lower.includes('portal') || lower.includes('app') || lower.includes('kiosk') || lower.includes('video') || lower.includes('login')) {
      primaryTheme = 'Portal / App Navigation';
    } else if (lower.includes('bill') || lower.includes('charge') || lower.includes('insurance')) {
      primaryTheme = 'Billing & Insurance Surprises';
    } else if (lower.includes('medication') || lower.includes('dose') || lower.includes('pill') || lower.includes('prescription')) {
      primaryTheme = 'Medication Instruction Clarity';
    } else if (lower.includes('schedule') || lower.includes('appointment') || lower.includes('cancel')) {
      primaryTheme = 'Scheduling Friction';
    } else if (lower.includes('discharge') || lower.includes('instructions')) {
      primaryTheme = 'Discharge Protocol Clarity';
    } else if (lower.includes('interpreter') || lower.includes('spanish') || lower.includes('translate')) {
      primaryTheme = 'Language & Interpreter Services';
    }

    // Problem category
    let problemCategory: ProblemCategory | undefined = undefined;
    if (sentiment === 'Negative') {
      if (primaryTheme === 'Wait Time & Triage Lag') problemCategory = 'Wait-Time Complaint';
      else if (primaryTheme === 'Portal / App Navigation') problemCategory = 'Technology Issue';
      else if (primaryTheme === 'Scheduling Friction') problemCategory = 'Scheduling Friction';
      else if (lower.includes('nurse') || lower.includes('doctor') || lower.includes('tell') || lower.includes('communication')) problemCategory = 'Communication Bottleneck';
      else problemCategory = 'Clinical Quality';
    }

    // Risk classification
    let riskFlag: RiskFlagType = 'None';
    let riskSeverity: 'Low' | 'Medium' | 'High' | 'Critical' | undefined = undefined;
    let riskExplanation: string | undefined = undefined;

    if (lower.includes('normal') && lower.includes('stop') || lower.includes('said one thing') || lower.includes('contradict') || lower.includes('nsaid') || lower.includes('eliquis')) {
      riskFlag = 'Hallucination Trap';
      riskSeverity = 'Critical';
      riskExplanation = 'Detected clinical contradiction or ambiguous verbal instruction prone to automated NLP hallucination.';
    } else if (lower.includes('bias') || lower.includes('race') || lower.includes('community') || lower.includes('stereotyp') || lower.includes('dismissed my pain')) {
      riskFlag = 'Bias-Related';
      riskSeverity = 'High';
      riskExplanation = 'Perceived demographic or language equity discrepancy reported.';
    } else if (lower.includes('septic') || lower.includes('fever') || lower.includes('malpractice') || lower.includes('legal') || lower.includes('lawsuit') || lower.includes('anaphylactic')) {
      riskFlag = 'Human Review Required';
      riskSeverity = 'Critical';
      riskExplanation = 'Severe clinical escalation or potential liability requiring manual clinical triage.';
    }

    parsedComments.push({
      id: `UPLOAD-${i}`,
      patientId: `MRN-${10000 + i}`,
      date: new Date().toISOString().split('T')[0],
      serviceLine: normalizeServiceLine(rawServiceLine),
      visitType: normalizeVisitType(rawVisitType),
      patientPersona: normalizePersona(rawPersona),
      satisfactionScore,
      communicationRating,
      waitTimeMinutes,
      followUpCompliant,
      comment,
      sentiment,
      sentimentScore,
      primaryTheme,
      secondaryThemes: ['Clinical Care Experience'],
      keywords: extractKeywords(comment),
      problemCategory,
      riskFlag,
      riskSeverity,
      riskExplanation,
      reviewStatus: riskFlag !== 'None' ? 'Pending' : undefined,
    });
  }

  return parsedComments;
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeServiceLine(raw: string): ServiceLine {
  const l = raw.toLowerCase();
  if (l.includes('emer') || l.includes('ed') || l.includes('er')) return 'Emergency Medicine';
  if (l.includes('cardio') || l.includes('heart')) return 'Cardiology';
  if (l.includes('onco') || l.includes('cancer')) return 'Oncology';
  if (l.includes('ortho') || l.includes('bone') || l.includes('joint')) return 'Orthopedics';
  if (l.includes('pedia') || l.includes('child')) return 'Pediatrics';
  if (l.includes('neuro') || l.includes('brain')) return 'Neurology';
  if (l.includes('ob') || l.includes('gyn') || l.includes('matern')) return 'Obstetrics & Gynecology';
  if (l.includes('surg') || l.includes('or')) return 'General Surgery';
  return 'Primary Care';
}

function normalizeVisitType(raw: string): VisitType {
  const l = raw.toLowerCase();
  if (l.includes('inpat') || l.includes('admit')) return 'Inpatient';
  if (l.includes('emer') || l.includes('trauma')) return 'Emergency/Trauma';
  if (l.includes('tele') || l.includes('virtual') || l.includes('video')) return 'Telehealth';
  if (l.includes('ambulat') || l.includes('day surg')) return 'Ambulatory Surgery';
  return 'Outpatient';
}

function normalizePersona(raw: string): PatientPersona {
  const l = raw.toLowerCase();
  if (l.includes('senior') || l.includes('elder') || l.includes('chronic')) return 'Chronic Disease Senior';
  if (l.includes('tech') || l.includes('digital') || l.includes('young')) return 'Tech-Savvy Digital First';
  if (l.includes('parent') || l.includes('family') || l.includes('child')) return 'Working Parent';
  if (l.includes('spanish') || l.includes('language') || l.includes('interpreter') || l.includes('esl')) return 'Non-English Native';
  if (l.includes('rural') || l.includes('literacy') || l.includes('kiosk')) return 'Low Digital Literacy / Rural';
  return 'High-Acuity Acute Care';
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'been', 'there', 'what', 'when', 'they', 'your']);
  const filtered = words.filter((w) => !stopWords.has(w));
  return Array.from(new Set(filtered)).slice(0, 3);
}

export const SAMPLE_CSV_TEMPLATE = `service_line,visit_type,patient_persona,satisfaction_score,communication_rating,wait_time_minutes,follow_up_compliant,comment
Emergency Medicine,Emergency/Trauma,High-Acuity Acute Care,1,1,180,false,"Waited over 3 hours with severe abdominal pain before seeing physician."
Cardiology,Inpatient,Chronic Disease Senior,5,5,15,true,"Dr. Williams was exceptional and walked me through my echocardiogram in clear words."
Oncology,Outpatient,Tech-Savvy Digital First,4,4,20,true,"Infusion team was kind and compassionate. App check-in worked smoothly."
Orthopedics,Outpatient,Low Digital Literacy / Rural,2,3,45,false,"The touch screen check-in kiosks were impossible for an elderly person without assistance."
Pediatrics,Outpatient,Working Parent,5,5,10,true,"Nurse explained the vaccine schedule with gentle reassurance for my daughter."`;
