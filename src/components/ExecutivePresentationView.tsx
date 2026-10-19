import React, { useState, useEffect } from 'react';
import { KPIOverview, PatientComment } from '../types/dashboard';
import {
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Bot,
  Target,
  Clock,
  HeartHandshake,
  Maximize2,
} from 'lucide-react';

interface ExecutivePresentationViewProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: KPIOverview;
  comments: PatientComment[];
}

export const ExecutivePresentationView: React.FC<ExecutivePresentationViewProps> = ({
  isOpen,
  onClose,
  kpis,
  comments,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Healthcare Analytics Agent · Executive Briefing',
      subtitle: 'Patient Experience, Operational Diagnostics & AI Modernization Roadmap',
      content: (
        <div className="space-y-8 max-w-4xl mx-auto py-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-teal-600 uppercase">
              CONFIDENTIAL · HOSPITAL LEADERSHIP BRIEFING
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Executive Patient Experience & AI Strategy Review
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Real-time unstructured feedback synthesis across {kpis.totalComments.toLocaleString()} patient encounters, uncovering hidden clinical bottlenecks and strategic autonomous agent deployments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Evaluated Cohort</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {kpis.totalComments.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-700 mt-1 block font-medium">+12.4% survey capture</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Avg Satisfaction</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {kpis.avgSatisfaction.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Out of 5.0 (National: 4.20)</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Communication</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {kpis.avgCommunication.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-700 mt-1 block font-medium">Physician & Nursing</span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Follow-Up Rate</span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                {kpis.followUpComplianceRate}%
              </span>
              <span className="text-xs text-amber-700 mt-1 block font-medium">Senior Adherence Gap</span>
            </div>
          </div>
        </div>
      ),
      speakerNote: 'Welcome leadership. This dashboard synthesizes both quantitative CSAT ratings and NLP semantics from our full patient population.',
    },
    {
      title: 'Slide 2: Clinical Satisfaction & Department Disparities',
      subtitle: 'High acute variance across service lines and care settings',
      content: (
        <div className="space-y-6 max-w-4xl mx-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Top Performing Service</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Oncology & Pediatrics</h3>
              <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-2">4.48 / 5.0</div>
              <p className="text-xs text-slate-600 mt-2">
                Characterized by exceptional nursing empathy, visual treatment roadmaps, and proactive telephone check-ins.
              </p>
            </div>

            <div className="p-5 bg-rose-50/60 border border-rose-200 rounded-xl">
              <span className="text-xs font-bold text-rose-800 uppercase block">Critical Vulnerability</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Emergency Medicine</h3>
              <div className="text-2xl font-mono font-extrabold text-rose-700 mt-2">3.24 / 5.0</div>
              <p className="text-xs text-slate-600 mt-2">
                38% negative sentiment driven almost entirely by triage dwell times exceeding 172 minutes during inpatient bed boarding surges.
              </p>
            </div>

            <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
              <span className="text-xs font-bold text-indigo-800 uppercase block">Specialty Access Delay</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Neurology & Cardiology</h3>
              <div className="text-2xl font-mono font-extrabold text-indigo-700 mt-2">12.4 Wks Delay</div>
              <p className="text-xs text-slate-600 mt-2">
                Outpatient referral backlogs cause substantial patient frustration and $1.4M lost downstream surgical referrals.
              </p>
            </div>
          </div>
        </div>
      ),
      speakerNote: 'Point out the strong dichotomy: Clinical nursing empathy is celebrated, but operational flow in the ED drags down the hospital average.',
    },
    {
      title: 'Slide 3: Hidden Organizational Process Bottlenecks',
      subtitle: 'Where patient handoffs and technical touchpoints break down',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto py-2">
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>1. Inpatient Bed Boarding in Emergency</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Triage-to-bed time averages 172 minutes vs 60 minute benchmark (+186% over standard). Patients describe waiting in hallways without updates while pain intensifies.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>2. Discharge Medication Miscommunication</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verbal nurse remarks ("your labs look normal") lead patients to prematurely stop vital anticoagulants (Eliquis/Plavix) because written instructions were conflicting.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>3. Digital & Language Access Inequity</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tablet interpreter freezes and lack of translated discharge instructions in Spanish & Vietnamese create a -1.42 satisfaction deficit among non-English native patients.
            </p>
          </div>
        </div>
      ),
      speakerNote: 'Leadership must realize these are operational coordination failures, not provider negligence.',
    },
    {
      title: 'Slide 4: Recommended Healthcare AI Agent Deployments',
      subtitle: 'High-ROI autonomous and assistive clinical agents',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto py-2">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">DischargeCompass AI</span>
              <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                ROI: $2.8M Annual
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Closed-loop medication reconciliation agent creating customized 1-page plain language visual summaries and conducting 48-hour conversational recovery checks.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Impact: -38% 30-Day Readmission for Cardiac Patients
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">TriageQueue Flow Agent</span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                ROI: $1.9M Annual
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Predictive bed boarding orchestrator providing real-time transparency to patients while dynamically routing lower-acuity triage cases.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Impact: -45 Min ED Dwell Time & -66% LWBS Rate
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">EchoLingua Multilingual Bridge</span>
              <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                ROI: $950K Annual
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clinical-grade bilingual interpreter assistant mediating nursing handoffs and generating instant certified Spanish/Vietnamese discharge roadmaps.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Impact: Closes 1.4-Point Language Satisfaction Deficit
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">PriorAuth & Scheduling Navigator</span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                ROI: $3.4M Annual
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Proactive cancellation filling and instant prior-authorization filing reducing specialty referral wait times from 14 weeks down to 18 days.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">
              Impact: Recovers $3.4M in Outpatient Surgical Capture
            </div>
          </div>
        </div>
      ),
      speakerNote: 'Highlight the cumulative $9.0M+ annual ROI across the 4 primary agent deployments.',
    },
    {
      title: 'Slide 5: Executive Recommendations & 90-Day Action Roadmap',
      subtitle: 'Immediate leadership mandates and accountable stakeholder owners',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Top Priority 1 · Clinical Governance
              </span>
              <h4 className="text-sm font-bold text-slate-900">Standardize Closed-Loop Medication Discharge</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandate digital signoff on all anticoagulants and insulin. Lead: Chief Medical Officer & Chief Pharmacy Officer.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Top Priority 2 · Emergency Operations
              </span>
              <h4 className="text-sm font-bold text-slate-900">Decant Inpatient Floors & Fast-Track Pediatric ED</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Re-allocate 14 transitional beds and fast-track pediatric triage to eliminate 3-hour lobby holds. Lead: COO.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Quick Win (&lt; 90 Days)
              </span>
              <h4 className="text-sm font-bold text-slate-900">Station Curbside Physical Kiosk Ambassadors</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assist elderly & arthritic patients with touchscreen check-in kiosks at Orthopedics and Cancer pavilions.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                Quick Win (&lt; 90 Days)
              </span>
              <h4 className="text-sm font-bold text-slate-900">Zero-Auth Direct Telehealth Video SMS</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy single-use secure SMS video links, dropping telehealth technical failure rates from 18% to under 3%.
              </p>
            </div>
          </div>
        </div>
      ),
      speakerNote: 'Conclude with call to action: Formalize CMO/COO working group to approve 90-day quick wins.',
    },
  ];

  // Handle keyboard arrow keys
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slides.length, onClose]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Top Slide Header */}
      <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 border border-teal-800 px-2 py-0.5 rounded">
            SLIDE {currentSlide + 1} OF {slides.length}
          </span>
          <span className="text-sm font-bold text-white">{slide.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline">Use [←] and [→] keys to navigate</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Body */}
      <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{slide.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{slide.subtitle}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {slide.content}
          </div>

          {/* Speaker Notes */}
          <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg text-xs text-slate-400 flex items-center gap-2">
            <span className="text-teal-400 font-mono font-bold uppercase text-[10px]">Speaker Note:</span>
            <span>{slide.speakerNote}</span>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="px-8 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-8 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
