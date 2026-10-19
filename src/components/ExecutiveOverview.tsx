import React from 'react';
import { KPIOverview } from '../types/dashboard';
import {
  MessageSquareText,
  Star,
  PhoneCall,
  CheckCircle2,
  Building2,
  Clock,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface ExecutiveOverviewProps {
  kpis: KPIOverview;
  onNavigateToSection: (section: string) => void;
  onSelectRiskFilter: () => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  kpis,
  onNavigateToSection,
  onSelectRiskFilter,
}) => {
  return (
    <div className="space-y-6">
      {/* Executive Headline Briefing */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Executive Overview · Patient Experience & Operational Intelligence
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Healthcare Leadership Briefing</span>
              <span aria-hidden="true">·</span>
              <span>Hospital Quality & Safety Committee</span>
              <span aria-hidden="true">·</span>
              <span>Updated Real-Time</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600">Enterprise Status:</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              CMS Tier-1 Accredited
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-4xl">
          Continuous natural language processing of acute, ambulatory, and emergency encounters across{' '}
          <strong className="text-slate-800 font-semibold">{kpis.serviceLinesCount} distinct service lines</strong>. While aggregate patient
          satisfaction remains solid at{' '}
          <strong className="text-slate-800 font-semibold">{kpis.avgSatisfaction} / 5.0</strong>, significant operational bottlenecks exist in
          emergency triage wait times and post-discharge medication clarity.
        </p>
      </div>

      {/* 5 Core Required Metrics Cards (SECTION 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Comments */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">COMMENTS ANALYZED</span>
            <MessageSquareText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {kpis.totalComments.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Positive: {kpis.positiveRate}%</span>
            <span>Negative: {kpis.negativeRate}%</span>
          </div>
        </div>

        {/* Metric 2: Avg Satisfaction Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">AVG SATISFACTION</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {kpis.avgSatisfaction.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>National Target</span>
            <span className="font-mono text-slate-700 font-medium">4.20 (+0.08 gap)</span>
          </div>
        </div>

        {/* Metric 3: Avg Communication Rating */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">COMMUNICATION RATING</span>
            <PhoneCall className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {kpis.avgCommunication.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Physician & Nurse Handoff</span>
            <span className="font-mono text-emerald-700 font-medium">Good</span>
          </div>
        </div>

        {/* Metric 4: Follow-up Compliance Rate */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">FOLLOW-UP COMPLIANCE</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {kpis.followUpComplianceRate}%
            </span>
            <span className="text-xs text-slate-500">adherence</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Senior Cohort Gap</span>
            <span className="font-mono text-amber-700 font-medium">-18.2% drop</span>
          </div>
        </div>

        {/* Metric 5: Service Lines Represented */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-shadow hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">SERVICE LINES</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {kpis.serviceLinesCount}
            </span>
            <span className="text-xs text-slate-500">departments</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Specialty Coverage</span>
            <span className="text-slate-700 font-medium">System-Wide</span>
          </div>
        </div>
      </div>

      {/* Supplementary Executive Operational Health Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wait Time Indicator */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-md text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Average Encounter Wait-Time</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {kpis.avgWaitTime} Minutes
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToSection('problems')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
          >
            Wait bottlenecks <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AI Safety & Risk Escapes */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 rounded-md text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Safety & Risk Flags</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {kpis.highRiskCount} Critical Cases
              </div>
            </div>
          </div>
          <button
            onClick={onSelectRiskFilter}
            className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
          >
            Review queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Net Sentiment Score */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-md text-teal-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Net Sentiment Ratio</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                +{(kpis.positiveRate - kpis.negativeRate).toFixed(1)} NPS Points
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateToSection('nlp')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
          >
            NLP breakdown <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical Executive Takeaways Box */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          EXECUTIVE SUMMARY · KEY TAKEAWAYS FOR LEADERSHIP
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <div className="font-semibold text-white text-sm mb-1">1. Emergency Department Dwell Anomaly</div>
            <p className="text-slate-300 leading-relaxed">
              Emergency Medicine accounts for 38% of all negative comments. The primary driver is not clinical quality, but inpatient boarding lag causing triage delays up to 195 minutes.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white text-sm mb-1">2. Medication Ambiguity at Discharge</div>
            <p className="text-slate-300 leading-relaxed">
              Severe hallucination traps identified in Cardiology: verbal nursing comments ("tests look normal") frequently lead elderly patients to self-discontinue blood thinners.
            </p>
          </div>
          <div>
            <div className="font-semibold text-white text-sm mb-1">3. Language & Digital Divide Disparity</div>
            <p className="text-slate-300 leading-relaxed">
              Non-English speaking patients experience a -1.42 satisfaction gap due to interpreter tablet freezes. Low-digital-literacy seniors report high friction with touchscreen check-in kiosks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
