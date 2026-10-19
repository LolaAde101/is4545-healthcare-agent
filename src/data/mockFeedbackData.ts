import {
  PatientComment,
  ServiceLine,
  VisitType,
  PatientPersona,
  SentimentCategory,
  RiskFlagType,
  ProblemCategory,
} from '../types/dashboard';

// Curated high-impact executive feedback items representing real hospital scenarios
const CURATED_EXECUTIVE_CASES: PatientComment[] = [
  // SECTION 7: Hallucination Traps
  {
    id: 'PT-1001',
    patientId: 'MRN-84920',
    date: '2026-10-14',
    serviceLine: 'Cardiology',
    visitType: 'Inpatient',
    patientPersona: 'Chronic Disease Senior',
    satisfactionScore: 2,
    communicationRating: 1,
    waitTimeMinutes: 45,
    followUpCompliant: false,
    comment:
      'The morning nurse whispered that my blood tests looked normal, so I figured I did not need to keep taking the blood thinner Eliquis after leaving. Nobody wrote this down or confirmed when the doctor discharged me.',
    sentiment: 'Negative',
    sentimentScore: -0.78,
    primaryTheme: 'Medication Instruction Clarity',
    secondaryThemes: ['Discharge Protocol Clarity', 'Bedside Empathy & Nursing Care'],
    keywords: ['blood thinner', 'Eliquis', 'nurse', 'normal', 'discharged', 'instruction'],
    problemCategory: 'Communication Bottleneck',
    riskFlag: 'Hallucination Trap',
    riskSeverity: 'Critical',
    riskExplanation:
      'High clinical risk of automated summary misconstruing verbal nurse observation as medical discontinuation order for oral anticoagulant.',
    reviewStatus: 'Escalated',
    reviewerNotes: 'Cardiology clinical coordinator alerted. Patient reached by pharmacy liaison.',
  },
  {
    id: 'PT-1002',
    patientId: 'MRN-77312',
    date: '2026-10-11',
    serviceLine: 'Oncology',
    visitType: 'Outpatient',
    patientPersona: 'Chronic Disease Senior',
    satisfactionScore: 3,
    communicationRating: 2,
    waitTimeMinutes: 70,
    followUpCompliant: true,
    comment:
      'Doctor mentioned my tumor markers "doubled in clearance", which sounded like great news to me, but the portal letter said progression was suspected. Very contradictory language.',
    sentiment: 'Neutral',
    sentimentScore: -0.25,
    primaryTheme: 'Discharge Protocol Clarity',
    secondaryThemes: ['Portal / App Navigation', 'Bedside Empathy & Nursing Care'],
    keywords: ['tumor markers', 'clearance', 'contradictory', 'portal letter', 'progression'],
    problemCategory: 'Communication Bottleneck',
    riskFlag: 'Hallucination Trap',
    riskSeverity: 'High',
    riskExplanation:
      'Medical jargon ambiguity: "clearance" versus "progression" creates severe patient cognitive dissonance that LLMs often misinterpret.',
    reviewStatus: 'Under Review',
    reviewerNotes: 'Referred to Oncology nurse navigator to clarify terminology.',
  },
  {
    id: 'PT-1003',
    patientId: 'MRN-91244',
    date: '2026-10-09',
    serviceLine: 'Emergency Medicine',
    visitType: 'Emergency/Trauma',
    patientPersona: 'High-Acuity Acute Care',
    satisfactionScore: 1,
    communicationRating: 1,
    waitTimeMinutes: 195,
    followUpCompliant: false,
    comment:
      'The resident said "we ruled out coronary syndrome so you can go home and take aspirin if your chest tightens again". But my discharge summary says "Avoid NSAIDs due to active gastric bleed history". Which one is it?!',
    sentiment: 'Negative',
    sentimentScore: -0.92,
    primaryTheme: 'Discharge Protocol Clarity',
    secondaryThemes: ['Medication Instruction Clarity', 'Wait Time & Triage Lag'],
    keywords: ['aspirin', 'chest tightness', 'coronary', 'NSAID', 'gastric bleed', 'conflict'],
    problemCategory: 'Communication Bottleneck',
    riskFlag: 'Hallucination Trap',
    riskSeverity: 'Critical',
    riskExplanation:
      'Direct contraindication clash between verbal physician instructions and electronic discharge notes regarding NSAID use with bleeding risk.',
    reviewStatus: 'Pending',
    reviewerNotes: 'Immediate clinical review triggered; pharmacist verifying reconciliation.',
  },

  // SECTION 7: Bias-Related Comments
  {
    id: 'PT-1004',
    patientId: 'MRN-55201',
    date: '2026-10-07',
    serviceLine: 'Obstetrics & Gynecology',
    visitType: 'Inpatient',
    patientPersona: 'Working Parent',
    satisfactionScore: 1,
    communicationRating: 1,
    waitTimeMinutes: 50,
    followUpCompliant: false,
    comment:
      'When I repeatedly voiced my post-cesarean pain level was an 8/10, the floor physician dismissed it saying "patients from your community frequently exaggerate discomfort to request narcotics". I felt humiliated and unsafe.',
    sentiment: 'Negative',
    sentimentScore: -0.95,
    primaryTheme: 'Bedside Empathy & Nursing Care',
    secondaryThemes: ['Pain Management Response', 'Discharge Protocol Clarity'],
    keywords: ['pain', 'cesarean', 'community', 'narcotics', 'humiliated', 'dismissed', 'bias'],
    problemCategory: 'Clinical Quality',
    riskFlag: 'Bias-Related',
    riskSeverity: 'Critical',
    riskExplanation:
      'Explicit racial/socioeconomic stereotyping affecting acute post-operative pain management protocols.',
    equityIssue: 'Socioeconomic',
    reviewStatus: 'Escalated',
    reviewerNotes: 'Escalated to Chief Medical Officer and Patient Advocacy Committee.',
  },
  {
    id: 'PT-1005',
    patientId: 'MRN-33829',
    date: '2026-10-05',
    serviceLine: 'Emergency Medicine',
    visitType: 'Emergency/Trauma',
    patientPersona: 'Non-English Native',
    satisfactionScore: 1,
    communicationRating: 1,
    waitTimeMinutes: 160,
    followUpCompliant: false,
    comment:
      'Because I speak mostly Spanish, the front desk receptionist rolled her eyes and gestured to the back of the waiting room without calling an interpreter. Other patients who arrived later in English were called before my daughter.',
    sentiment: 'Negative',
    sentimentScore: -0.89,
    primaryTheme: 'Language & Interpreter Services',
    secondaryThemes: ['Wait Time & Triage Lag', 'Bedside Empathy & Nursing Care'],
    keywords: ['Spanish', 'interpreter', 'receptionist', 'waiting room', 'language barrier'],
    problemCategory: 'Communication Bottleneck',
    riskFlag: 'Bias-Related',
    riskSeverity: 'High',
    riskExplanation:
      'Language discrimination and refusal to promptly dispatch Title VI mandated medical translation services.',
    equityIssue: 'Language Barrier',
    reviewStatus: 'Under Review',
    reviewerNotes: 'Language Access director reviewing triage timestamp logs and audio records.',
  },

  // SECTION 7: Cases Requiring Human Review
  {
    id: 'PT-1006',
    patientId: 'MRN-44910',
    date: '2026-10-04',
    serviceLine: 'General Surgery',
    visitType: 'Inpatient',
    patientPersona: 'High-Acuity Acute Care',
    satisfactionScore: 1,
    communicationRating: 1,
    waitTimeMinutes: 30,
    followUpCompliant: false,
    comment:
      'Post-op laparoscopic hernia wound developed severe erythema, foul purulent drainage, and I have a fever of 103.2°F. The on-call answering service told me to wait until Monday morning clinic. I feel I am septic.',
    sentiment: 'Negative',
    sentimentScore: -0.96,
    primaryTheme: 'Clinical Quality',
    secondaryThemes: ['Discharge Protocol Clarity', 'Scheduling Friction'],
    keywords: ['purulent drainage', 'fever', 'erythema', 'septic', 'infection', 'emergency'],
    problemCategory: 'Clinical Quality',
    riskFlag: 'Human Review Required',
    riskSeverity: 'Critical',
    riskExplanation:
      'Urgent surgical site infection (SSI) alert with systemic inflammatory signs requiring immediate ED referral.',
    reviewStatus: 'Resolved',
    reviewerNotes: 'Emergency surgeon on call contacted patient directly; admitted to ED within 25 min.',
  },
  {
    id: 'PT-1007',
    patientId: 'MRN-62184',
    date: '2026-10-03',
    serviceLine: 'Pediatrics',
    visitType: 'Emergency/Trauma',
    patientPersona: 'Working Parent',
    satisfactionScore: 1,
    communicationRating: 2,
    waitTimeMinutes: 210,
    followUpCompliant: false,
    comment:
      'My 4-year-old child had an anaphylactic peanut reaction. We waited 3.5 hours in the lobby while his lips were still swollen. Triage staff said "he is breathing okay so sit down". We are contacting legal counsel.',
    sentiment: 'Negative',
    sentimentScore: -0.98,
    primaryTheme: 'Wait Time & Triage Lag',
    secondaryThemes: ['Clinical Quality', 'Bedside Empathy & Nursing Care'],
    keywords: ['anaphylactic', 'swollen', 'pediatric', 'legal counsel', '3.5 hours', 'triage delay'],
    problemCategory: 'Wait-Time Complaint',
    riskFlag: 'Human Review Required',
    riskSeverity: 'Critical',
    riskExplanation:
      'Pediatric emergency triage failure with explicit threat of legal action and clinical risk exposure.',
    reviewStatus: 'Escalated',
    reviewerNotes: 'Risk management and pediatric ED clinical lead notified for root-cause analysis.',
  },

  // SECTION 4: Hidden Technology Issues
  {
    id: 'PT-1008',
    patientId: 'MRN-78190',
    date: '2026-10-12',
    serviceLine: 'Primary Care',
    visitType: 'Telehealth',
    patientPersona: 'Low Digital Literacy / Rural',
    satisfactionScore: 2,
    communicationRating: 3,
    waitTimeMinutes: 35,
    followUpCompliant: false,
    comment:
      'The portal video link repeatedly disconnected every 90 seconds. When I called the help line, I was redirected through three automated menus that asked for two-factor SMS codes I do not know how to receive on my landline.',
    sentiment: 'Negative',
    sentimentScore: -0.71,
    primaryTheme: 'Portal / App Navigation',
    secondaryThemes: ['Scheduling Friction'],
    keywords: ['video link', 'disconnected', 'two-factor', 'landline', 'SMS code', 'telehealth'],
    problemCategory: 'Technology Issue',
    riskFlag: 'None',
    equityIssue: 'Digital Literacy',
    reviewStatus: 'Pending',
  },
  {
    id: 'PT-1009',
    patientId: 'MRN-19042',
    date: '2026-10-08',
    serviceLine: 'Orthopedics',
    visitType: 'Outpatient',
    patientPersona: 'Chronic Disease Senior',
    satisfactionScore: 2,
    communicationRating: 4,
    waitTimeMinutes: 40,
    followUpCompliant: true,
    comment:
      'The clinic replaced front-desk check-in staff with touch-screen glass kiosks. For an elderly person with arthritic fingers and cataracts, this was completely impossible to operate. I stood there helpless until another patient assisted me.',
    sentiment: 'Negative',
    sentimentScore: -0.66,
    primaryTheme: 'Portal / App Navigation',
    secondaryThemes: ['Physical Accessibility & Facility'],
    keywords: ['touch-screen kiosk', 'arthritic fingers', 'cataracts', 'check-in', 'accessibility'],
    problemCategory: 'Technology Issue',
    riskFlag: 'None',
    equityIssue: 'Physical Accessibility',
    reviewStatus: 'Under Review',
  },

  // SECTION 4: Scheduling-related issues
  {
    id: 'PT-1010',
    patientId: 'MRN-88203',
    date: '2026-10-06',
    serviceLine: 'Neurology',
    visitType: 'Outpatient',
    patientPersona: 'Working Parent',
    satisfactionScore: 2,
    communicationRating: 3,
    waitTimeMinutes: 25,
    followUpCompliant: false,
    comment:
      'My primary doctor marked my MRI as urgent due to persistent migraines and optic disc swelling, yet Neurology scheduling could only offer an appointment 14 weeks out. When I asked about cancellations, they told me to call back every morning at 8am.',
    sentiment: 'Negative',
    sentimentScore: -0.74,
    primaryTheme: 'Scheduling Friction',
    secondaryThemes: ['Wait Time & Triage Lag'],
    keywords: ['14 weeks out', 'urgent MRI', 'migraine', 'cancellation list', 'scheduling delay'],
    problemCategory: 'Scheduling Friction',
    riskFlag: 'None',
    reviewStatus: 'Pending',
  },

  // SECTION 6: Healthcare Equity & Accessibility
  {
    id: 'PT-1011',
    patientId: 'MRN-60912',
    date: '2026-10-10',
    serviceLine: 'Orthopedics',
    visitType: 'Outpatient',
    patientPersona: 'Low Digital Literacy / Rural',
    satisfactionScore: 2,
    communicationRating: 3,
    waitTimeMinutes: 40,
    followUpCompliant: true,
    comment:
      'The parking shuttle has no ramp for power wheelchairs, and the elevator in building B was out of order with handwritten paper notes. I had to wheel myself across a 150-yard incline in the rain.',
    sentiment: 'Negative',
    sentimentScore: -0.84,
    primaryTheme: 'Physical Accessibility & Facility',
    secondaryThemes: ['Wait Time & Triage Lag'],
    keywords: ['power wheelchair', 'ramp', 'elevator broken', 'incline', 'handicapped parking'],
    problemCategory: 'Facility & Billing',
    riskFlag: 'None',
    equityIssue: 'Physical Accessibility',
    reviewStatus: 'Resolved',
  },
  {
    id: 'PT-1012',
    patientId: 'MRN-90211',
    date: '2026-10-02',
    serviceLine: 'Cardiology',
    visitType: 'Outpatient',
    patientPersona: 'Non-English Native',
    satisfactionScore: 2,
    communicationRating: 2,
    waitTimeMinutes: 60,
    followUpCompliant: false,
    comment:
      'The Vietnamese translator on the tablet screen kept freezing every 2 minutes. My doctor finally gave up and just used hand gestures for heart palpitations. I have no idea whether my dosage was increased or reduced.',
    sentiment: 'Negative',
    sentimentScore: -0.82,
    primaryTheme: 'Language & Interpreter Services',
    secondaryThemes: ['Medication Instruction Clarity', 'Portal / App Navigation'],
    keywords: ['Vietnamese translator', 'tablet frozen', 'dosage', 'heart palpitations', 'hand gestures'],
    problemCategory: 'Communication Bottleneck',
    riskFlag: 'Hallucination Trap',
    riskSeverity: 'High',
    riskExplanation: 'Severe language interpreter breakdown resulting in unverified cardiac medication titration.',
    equityIssue: 'Language Barrier',
    reviewStatus: 'Escalated',
  },

  // Positive Best Practice Cases
  {
    id: 'PT-1013',
    patientId: 'MRN-11204',
    date: '2026-10-15',
    serviceLine: 'Oncology',
    visitType: 'Outpatient',
    patientPersona: 'Tech-Savvy Digital First',
    satisfactionScore: 5,
    communicationRating: 5,
    waitTimeMinutes: 12,
    followUpCompliant: true,
    comment:
      'Dr. Henderson and his clinical nurse coordinator were outstanding. They walked through my infusion plan with visual diagrams, sent electronic summaries within 15 minutes, and called the next day to check my nausea levels.',
    sentiment: 'Positive',
    sentimentScore: 0.94,
    primaryTheme: 'Bedside Empathy & Nursing Care',
    secondaryThemes: ['Discharge Protocol Clarity', 'Portal / App Navigation'],
    keywords: ['infusion plan', 'diagrams', 'compassionate', 'prompt follow-up', 'outstanding'],
    problemCategory: undefined,
    riskFlag: 'None',
  },
  {
    id: 'PT-1014',
    patientId: 'MRN-22490',
    date: '2026-10-13',
    serviceLine: 'Pediatrics',
    visitType: 'Outpatient',
    patientPersona: 'Working Parent',
    satisfactionScore: 5,
    communicationRating: 5,
    waitTimeMinutes: 8,
    followUpCompliant: true,
    comment:
      'The pediatric clinic made my son feel totally at ease before his asthma spirometry test. The nurse explained everything in playful terms, and the digital app reminder made scheduling follow-up vaccinations effortless.',
    sentiment: 'Positive',
    sentimentScore: 0.91,
    primaryTheme: 'Bedside Empathy & Nursing Care',
    secondaryThemes: ['Portal / App Navigation', 'Scheduling Friction'],
    keywords: ['pediatric', 'asthma test', 'caring nurse', 'seamless scheduling', 'reassuring'],
    problemCategory: undefined,
    riskFlag: 'None',
  },
];

// Helper to deterministically seed comments across service lines, themes and personas
const SERVICE_LINES: ServiceLine[] = [
  'Emergency Medicine',
  'Cardiology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'Obstetrics & Gynecology',
  'General Surgery',
  'Primary Care',
];

const VISIT_TYPES: VisitType[] = [
  'Inpatient',
  'Outpatient',
  'Emergency/Trauma',
  'Telehealth',
  'Ambulatory Surgery',
];

const PERSONAS: PatientPersona[] = [
  'Chronic Disease Senior',
  'Tech-Savvy Digital First',
  'Working Parent',
  'Non-English Native',
  'Low Digital Literacy / Rural',
  'High-Acuity Acute Care',
];

const THEMES = [
  'Bedside Empathy & Nursing Care',
  'Discharge Protocol Clarity',
  'Wait Time & Triage Lag',
  'Communication Bottleneck',
  'Medication Instruction Clarity',
  'Scheduling Friction',
  'Portal / App Navigation',
  'Billing & Insurance Surprises',
  'Physical Accessibility & Facility',
  'Language & Interpreter Services',
  'Pain Management Response',
  'Cleanliness & Room Noise',
];

const KEYWORDS_POOL = [
  { word: 'wait time', category: 'Operational', sentiment: 'Negative' as SentimentCategory },
  { word: 'nursing care', category: 'Clinical', sentiment: 'Positive' as SentimentCategory },
  { word: 'discharge instructions', category: 'Communication', sentiment: 'Neutral' as SentimentCategory },
  { word: 'billing surprise', category: 'Administrative', sentiment: 'Negative' as SentimentCategory },
  { word: 'compassionate', category: 'Clinical', sentiment: 'Positive' as SentimentCategory },
  { word: 'portal login', category: 'Technology', sentiment: 'Negative' as SentimentCategory },
  { word: 'doctor listened', category: 'Clinical', sentiment: 'Positive' as SentimentCategory },
  { word: 'delayed results', category: 'Communication', sentiment: 'Negative' as SentimentCategory },
  { word: 'kiosk confusion', category: 'Technology', sentiment: 'Negative' as SentimentCategory },
  { word: 'interpreter delay', category: 'Equity', sentiment: 'Negative' as SentimentCategory },
  { word: 'referral bottleneck', category: 'Scheduling', sentiment: 'Negative' as SentimentCategory },
  { word: 'wheelchair ramp', category: 'Accessibility', sentiment: 'Negative' as SentimentCategory },
  { word: 'pharmacy lag', category: 'Operational', sentiment: 'Negative' as SentimentCategory },
  { word: 'clear explanation', category: 'Communication', sentiment: 'Positive' as SentimentCategory },
  { word: 'triage hold', category: 'Operational', sentiment: 'Negative' as SentimentCategory },
  { word: 'pain management', category: 'Clinical', sentiment: 'Neutral' as SentimentCategory },
  { word: 'attentive team', category: 'Clinical', sentiment: 'Positive' as SentimentCategory },
  { word: 'call center hold', category: 'Scheduling', sentiment: 'Negative' as SentimentCategory },
];

// Pseudorandom deterministic generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateFeedbackDataset(totalTarget = 1248): PatientComment[] {
  const dataset: PatientComment[] = [...CURATED_EXECUTIVE_CASES];

  const commentTemplates = {
    positive: [
      'The care team was incredibly attentive and answered all our questions with genuine kindness.',
      'Everything from check-in to discharge was seamless and thoroughly explained.',
      'Doctor took time to review my lab trends in detail. Best clinical bedside manner I have experienced.',
      'Nurses checked on me every hour and managed my pain with such prompt empathy.',
      'The portal appointment reminder and digital check-in saved me at least 30 minutes in the clinic.',
      'Clear discharge instructions with printed medicine schedules made recovery at home stress-free.',
      'Pediatric nurses went above and beyond to calm my child during a scary IV placement.',
      'Follow-up telephone call from the clinic coordinator 48 hours post-op made us feel completely supported.',
      'Oncology infusion team is world-class. Dr. Patel explained our options with clarity and heart.',
      'Physical therapy staff showed tremendous patience teaching me how to walk safely post hip replacement.',
    ],
    neutral: [
      'Clinical care was acceptable, but parking fees and long walks from the garage were inconvenient.',
      'The doctor was knowledgeable, though felt rushed due to an obviously overbooked schedule.',
      'Staff were courteous, but discharge paperwork took nearly 3 hours after the doctor signed off.',
      'The appointment started 45 minutes late without explanation, though the doctor was apologetic.',
      'Telehealth visit resolved my immediate question, but audio quality was choppy twice.',
      'Lab results arrived in my portal quickly, but there were no doctor notes interpreting what was abnormal.',
      'Registration was smooth, but exam room waiting time stretched over an hour.',
    ],
    negative: [
      'Waited over 4 hours in the emergency triage room while pain worsened with no communication from staff.',
      'Discharge nurse handed me a 12-page packet with contradictory medication dosage times and left.',
      'Received an unexpected out-of-network facility bill for an in-network scheduled outpatient endoscopy.',
      'Tried to schedule a cardiology follow-up on the patient portal, but system said no slots for 9 weeks.',
      'Front desk staff appeared disinterested and gave conflicting directions on where to report for imaging.',
      'The check-in kiosk crashed three times, and nobody was available at the desk to assist.',
      'Nobody came when I pressed the nurse call button for 40 minutes post-surgery.',
      'Doctor spoke rapid medical jargon and seemed irritated when my elderly mother asked for clarification.',
      'Pharmacy took 2.5 hours to dispense take-home insulin after hospital discharge.',
      'Spanish interpreter was never provided despite marking it on intake; daughter had to translate complex biopsy results.',
    ],
  };

  const dates = [
    '2026-10-18', '2026-10-17', '2026-10-16', '2026-10-15', '2026-10-14',
    '2026-10-13', '2026-10-12', '2026-10-11', '2026-10-10', '2026-10-09',
    '2026-10-08', '2026-10-07', '2026-10-06', '2026-10-05', '2026-10-04',
    '2026-09-28', '2026-09-22', '2026-09-15', '2026-09-08', '2026-09-01',
    '2026-08-25', '2026-08-18', '2026-08-10', '2026-08-03',
  ];

  let currentId = 1015;

  while (dataset.length < totalTarget) {
    const seed = currentId * 1337;
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);
    const r5 = pseudoRandom(seed + 4);
    const r6 = pseudoRandom(seed + 5);

    // Weighted service line: Emergency Medicine & General Surgery have higher complaint rates
    const serviceLineIndex = Math.floor(r1 * SERVICE_LINES.length);
    const serviceLine = SERVICE_LINES[serviceLineIndex];

    const visitType = VISIT_TYPES[Math.floor(r2 * VISIT_TYPES.length)];
    const persona = PERSONAS[Math.floor(r3 * PERSONAS.length)];
    const date = dates[Math.floor(r4 * dates.length)];

    // Sentiment weighting: ED has more negatives; Oncology & Pediatrics have more positives
    let sentiment: SentimentCategory = 'Positive';
    let satisfactionScore = 5;
    let commRating = 5;
    let waitMinutes = Math.floor(10 + r5 * 35);
    let followUp = true;
    let problemCategory: ProblemCategory | undefined = undefined;
    let riskFlag: RiskFlagType = 'None';
    let riskSeverity: 'Low' | 'Medium' | 'High' | 'Critical' | undefined = undefined;
    let riskExplanation: string | undefined = undefined;
    let equityIssue: 'Language Barrier' | 'Digital Literacy' | 'Physical Accessibility' | 'Socioeconomic' | 'None' = 'None';

    const negativeOdds = serviceLine === 'Emergency Medicine' ? 0.42 : serviceLine === 'General Surgery' ? 0.32 : 0.18;
    const neutralOdds = 0.22;

    if (r5 < negativeOdds) {
      sentiment = 'Negative';
      satisfactionScore = r6 < 0.5 ? 1 : 2;
      commRating = r6 < 0.4 ? 1 : 2;
      waitMinutes = Math.floor(45 + r5 * 180);
      followUp = r6 > 0.65; // lower follow-up compliance on bad experience

      // Assign realistic problem categories
      if (waitMinutes > 90 || serviceLine === 'Emergency Medicine') {
        problemCategory = 'Wait-Time Complaint';
      } else if (r6 < 0.35) {
        problemCategory = 'Communication Bottleneck';
      } else if (r6 < 0.6) {
        problemCategory = 'Technology Issue';
      } else if (r6 < 0.8) {
        problemCategory = 'Scheduling Friction';
      } else {
        problemCategory = 'Clinical Quality';
      }

      // Equity issues based on persona
      if (persona === 'Non-English Native') {
        equityIssue = 'Language Barrier';
      } else if (persona === 'Low Digital Literacy / Rural') {
        equityIssue = r6 > 0.5 ? 'Digital Literacy' : 'Physical Accessibility';
      } else if (persona === 'Chronic Disease Senior' && r6 < 0.4) {
        equityIssue = 'Physical Accessibility';
      }

      // Occasional AI Risk flags
      if (r6 < 0.08) {
        riskFlag = 'Hallucination Trap';
        riskSeverity = 'High';
        riskExplanation = 'Unstructured verbal medication advice conflicting with chart records.';
      } else if (r6 < 0.14) {
        riskFlag = 'Bias-Related';
        riskSeverity = 'Medium';
        riskExplanation = 'Patient expressed perceived disparate treatment or communication indifference.';
      } else if (r6 < 0.18) {
        riskFlag = 'Human Review Required';
        riskSeverity = 'Critical';
        riskExplanation = 'Potential clinical safety deviation or severe patient grievance.';
      }
    } else if (r5 < negativeOdds + neutralOdds) {
      sentiment = 'Neutral';
      satisfactionScore = 3;
      commRating = r6 < 0.5 ? 3 : 4;
      waitMinutes = Math.floor(25 + r5 * 45);
      followUp = r6 > 0.3;
    } else {
      sentiment = 'Positive';
      satisfactionScore = r6 < 0.35 ? 4 : 5;
      commRating = r6 < 0.3 ? 4 : 5;
      waitMinutes = Math.floor(8 + r5 * 25);
      followUp = r6 > 0.15;
    }

    // Pick text template
    const templateList =
      sentiment === 'Positive'
        ? commentTemplates.positive
        : sentiment === 'Neutral'
        ? commentTemplates.neutral
        : commentTemplates.negative;

    const baseComment = templateList[Math.floor(r6 * templateList.length)];
    const commentWithContext = `${baseComment} [${serviceLine} - ${visitType}]`;

    // Pick keywords and themes
    const themeIndex = Math.floor(pseudoRandom(seed + 10) * THEMES.length);
    const primaryTheme = THEMES[themeIndex];
    const secondaryTheme = THEMES[(themeIndex + 3) % THEMES.length];

    const k1 = KEYWORDS_POOL[Math.floor(pseudoRandom(seed + 20) * KEYWORDS_POOL.length)].word;
    const k2 = KEYWORDS_POOL[Math.floor(pseudoRandom(seed + 30) * KEYWORDS_POOL.length)].word;
    const keywords = [k1, k2].filter((v, i, a) => a.indexOf(v) === i);

    const sentimentScore =
      sentiment === 'Positive'
        ? Number((0.6 + r6 * 0.38).toFixed(2))
        : sentiment === 'Neutral'
        ? Number((-0.1 + r6 * 0.25).toFixed(2))
        : Number((-0.5 - r6 * 0.48).toFixed(2));

    dataset.push({
      id: `PT-${currentId}`,
      patientId: `MRN-${Math.floor(10000 + r1 * 89999)}`,
      date,
      serviceLine,
      visitType,
      patientPersona: persona,
      satisfactionScore,
      communicationRating: commRating,
      waitTimeMinutes: waitMinutes,
      followUpCompliant: followUp,
      comment: commentWithContext,
      sentiment,
      sentimentScore,
      primaryTheme,
      secondaryThemes: [secondaryTheme],
      keywords,
      problemCategory,
      riskFlag,
      riskSeverity,
      riskExplanation,
      equityIssue,
      reviewStatus: riskFlag !== 'None' ? 'Pending' : undefined,
    });

    currentId++;
  }

  return dataset;
}

// Default export: 1,248 patient records
export const DEFAULT_PATIENT_FEEDBACK = generateFeedbackDataset(1248);
