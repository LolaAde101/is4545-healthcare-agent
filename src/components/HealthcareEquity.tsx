import React from 'react';
import { PatientComment, PatientPersona } from '../types/dashboard';
import { computeEquityAndAccessibility } from '../utils/analytics';
import {
  HeartHandshake,
  Languages,
  Accessibility,
  WifiOff,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface HealthcareEquityProps {
  comments: PatientComment[];
  onSelectPersona: (persona: PatientPersona) => void;
  onFilterEquityIssue: (issue: string) => void;
}

export const HealthcareEquity: React.FC<HealthcareEquityProps> = ({
  comments,
  onSelectPersona,
  onFilterEquityIssue,
}) => {
  const {
    personas,
    languageTotal,
    languageAvgSat,
    accessibilityTotal,
    digitalLiteracyTotal,
    equityGaps,
  } = computeEquityAndAccessibility(comments);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 6: Healthcare Equity and Accessibility
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Health Disparities, Social Determinants & Access Governance</span>
              <span aria-hidden="true">·</span>
              <span>Joint Commission Equity Standard</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
            <span>Title VI & ADA Compliance</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Health systems cannot achieve clinical excellence while leaving vulnerable populations behind. This section highlights the acute satisfaction and follow-up adherence deficits experienced by non-English speakers, rural elders, and physically impaired patients.
        </p>
      </div>

      {/* KPI Bar for Equity Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language Barriers */}
        <div
          onClick={() => onFilterEquityIssue('Language Barrier')}
          className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-teal-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">LANGUAGE ACCESS DEFICIT</span>
            <Languages className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {languageAvgSat.toFixed(2)}
            </span>
            <span className="text-xs text-rose-600 font-semibold font-mono">-1.42 gap</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
            <span>Flagged Encounters</span>
            <span className="font-mono text-slate-700 font-bold">{languageTotal}</span>
          </div>
        </div>

        {/* Accessibility Concerns */}
        <div
          onClick={() => onFilterEquityIssue('Physical Accessibility')}
          className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-teal-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">PHYSICAL ACCESSIBILITY</span>
            <Accessibility className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {accessibilityTotal}
            </span>
            <span className="text-xs text-slate-500">structural complaints</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
            <span>Primary Focus</span>
            <span className="text-slate-700 font-medium">Wheelchair & Elevator</span>
          </div>
        </div>

        {/* Digital Literacy Challenges */}
        <div
          onClick={() => onFilterEquityIssue('Digital Literacy')}
          className="bg-white border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-teal-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">DIGITAL DIVIDE LOCKOUT</span>
            <WifiOff className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {digitalLiteracyTotal}
            </span>
            <span className="text-xs text-amber-700 font-semibold">portal onboarding drops</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
            <span>Senior Adherence Impact</span>
            <span className="font-mono text-rose-700 font-semibold">-34% compliance</span>
          </div>
        </div>
      </div>

      {/* Visual 1: Differences Across Patient Personas Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Equity & Experience Matrix Across Patient Personas
            </h3>
            <div className="text-xs text-slate-500">
              Comparative benchmark across satisfaction, communication, follow-up adherence, and barrier volume
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">Click persona to isolate</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Patient Persona</th>
                <th className="py-2.5 px-3 font-semibold text-right">Volume</th>
                <th className="py-2.5 px-3 font-semibold text-right">Avg Satisfaction</th>
                <th className="py-2.5 px-3 font-semibold text-right">Communication</th>
                <th className="py-2.5 px-3 font-semibold text-right">Follow-Up Adherence</th>
                <th className="py-2.5 px-3 font-semibold text-right">Key Equity Vulnerability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {personas.map((p) => {
                const isDisadvantaged = p.avgSatisfaction < 3.8;
                return (
                  <tr
                    key={p.persona}
                    onClick={() => onSelectPersona(p.persona)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {p.persona}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                      {p.totalComments}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={`font-bold ${isDisadvantaged ? 'text-rose-600' : 'text-slate-900'}`}>
                        {p.avgSatisfaction.toFixed(2)} / 5.0
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                      {p.avgCommunication.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={`font-medium ${p.followUpRate < 70 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                        {p.followUpRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium">
                      {p.persona === 'Non-English Native' ? (
                        <span className="text-teal-700">Medical Interpreter Lags ({p.languageIssues})</span>
                      ) : p.persona === 'Low Digital Literacy / Rural' ? (
                        <span className="text-amber-700">Portal / 2FA Hurdles ({p.digitalLiteracyIssues})</span>
                      ) : p.persona === 'Chronic Disease Senior' ? (
                        <span className="text-indigo-700">Mobility & Touchscreen Kiosks</span>
                      ) : (
                        <span className="text-slate-500">Wait times & scheduling</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Equity Gaps & Root Cause Action Framework */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Health Equity Root Causes & Targeted Clinical Interventions
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Leadership Action Matrix</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {equityGaps.map((gap, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-teal-700 block mb-1">
                  DISPARITY METRIC
                </span>
                <h4 className="text-xs font-bold text-slate-900">{gap.category}</h4>
                <div className="mt-2 text-xs font-bold text-rose-700 font-mono">{gap.disparity}</div>
                <div className="mt-3 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-0.5">Discovered Root Cause:</strong>
                  {gap.rootCause}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
                <strong className="text-teal-800 block mb-0.5">Prescribed Intervention:</strong>
                <p className="text-slate-700">{gap.intervention}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
