import React, { useState } from 'react';
import { PatientComment, RiskFlagType } from '../types/dashboard';
import { computeAIRiskMonitoring } from '../utils/analytics';
import {
  ShieldAlert,
  AlertTriangle,
  BrainCircuit,
  Scale,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';

interface AIRiskMonitoringProps {
  comments: PatientComment[];
  onUpdateCommentStatus?: (id: string, status: 'Under Review' | 'Resolved' | 'Escalated', note?: string) => void;
}

export const AIRiskMonitoring: React.FC<AIRiskMonitoringProps> = ({
  comments,
  onUpdateCommentStatus,
}) => {
  const { totalRiskFlagged, hallucinationTraps, biasRelated, humanReviewCases } =
    computeAIRiskMonitoring(comments);

  const [activeTab, setActiveTab] = useState<RiskFlagType>('Hallucination Trap');
  const [selectedCase, setSelectedCase] = useState<PatientComment | null>(
    hallucinationTraps[0] || humanReviewCases[0] || null
  );
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  const displayList =
    activeTab === 'Hallucination Trap'
      ? hallucinationTraps
      : activeTab === 'Bias-Related'
      ? biasRelated
      : humanReviewCases;

  const handleStatusChange = (status: 'Under Review' | 'Resolved' | 'Escalated') => {
    if (!selectedCase) return;
    if (onUpdateCommentStatus) {
      onUpdateCommentStatus(selectedCase.id, status, statusUpdateNote);
    }
    selectedCase.reviewStatus = status;
    if (statusUpdateNote) {
      selectedCase.reviewerNotes = statusUpdateNote;
    }
    setStatusUpdateNote('');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 7: AI Risk Monitoring & Clinical Safety Governance
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Hallucination Traps, Algorithmic Bias & Human-in-the-Loop Triage</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{totalRiskFlagged} High-Risk Flags Isolated</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Clinical Safety Guardrail Active</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Autonomous healthcare models fail catastrophically when presented with conflicting verbal clinical cues, demographic biases, or life-threatening surgical emergencies. This console monitors and enforces human-in-the-loop review on dangerous linguistic edge-cases.
        </p>
      </div>

      {/* 3 Risk Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Hallucination Traps */}
        <button
          onClick={() => {
            setActiveTab('Hallucination Trap');
            setSelectedCase(hallucinationTraps[0] || null);
          }}
          className={`text-left p-4 rounded-lg border transition-all ${
            activeTab === 'Hallucination Trap'
              ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">HALLUCINATION TRAPS</span>
            <BrainCircuit className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {hallucinationTraps.length}
            </span>
            <span className="text-xs text-amber-700 font-medium">ambiguous cases</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Verbal contradictions, jargon mixups, or medicine titrations prone to LLM misinterpretation.
          </p>
        </button>

        {/* Pillar 2: Bias-Related Comments */}
        <button
          onClick={() => {
            setActiveTab('Bias-Related');
            setSelectedCase(biasRelated[0] || null);
          }}
          className={`text-left p-4 rounded-lg border transition-all ${
            activeTab === 'Bias-Related'
              ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">BIAS-RELATED COMMENTS</span>
            <Scale className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {biasRelated.length}
            </span>
            <span className="text-xs text-rose-700 font-medium">equity violations</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Racial, demographic, language dismissiveness, or socioeconomic care disparities reported.
          </p>
        </button>

        {/* Pillar 3: Cases Requiring Human Review */}
        <button
          onClick={() => {
            setActiveTab('Human Review Required');
            setSelectedCase(humanReviewCases[0] || null);
          }}
          className={`text-left p-4 rounded-lg border transition-all ${
            activeTab === 'Human Review Required'
              ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">MANDATORY HUMAN REVIEW</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {humanReviewCases.length}
            </span>
            <span className="text-xs text-indigo-700 font-medium">critical incidents</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Severe surgical infections, pediatric anaphylaxis, sepsis warnings, or legal malpractice threats.
          </p>
        </button>
      </div>

      {/* Interactive Human-in-the-Loop Triage Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flagged Cases List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="text-xs font-bold text-slate-800">
              {activeTab} Queue ({displayList.length})
            </div>
            <span className="text-[11px] font-mono text-slate-500">Sorted by Severity</span>
          </div>

          <div className="mt-3 divide-y divide-slate-100 overflow-y-auto max-h-[460px] pr-1">
            {displayList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active flags in this category for the current filter.
              </div>
            ) : (
              displayList.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCase(item)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-100/80 border border-slate-300'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900">{item.patientId}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                          item.riskSeverity === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.riskSeverity || 'High'} Severity
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1.5 line-clamp-2 leading-relaxed">
                      "{item.comment}"
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.serviceLine}</span>
                      <span className="font-mono text-slate-600">
                        Status: {item.reviewStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Deep-Dive & Clinical Human Triage Actions */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          {selectedCase ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      Case {selectedCase.id} · {selectedCase.patientId}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        selectedCase.riskSeverity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedCase.riskFlag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {selectedCase.serviceLine} · {selectedCase.visitType} · {selectedCase.patientPersona}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono block">Encounter Date</span>
                  <span className="text-xs font-semibold text-slate-800 font-mono">{selectedCase.date}</span>
                </div>
              </div>

              {/* Full Verbatim Box */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 leading-relaxed italic">
                "{selectedCase.comment}"
              </div>

              {/* AI Risk Reason Breakdown */}
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Algorithmic & Clinical Failure Explanation:
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {selectedCase.riskExplanation ||
                      'Unstructured patient feedback contains clinical assertions that conflict with medical standards or indicate adverse health risks.'}
                  </p>
                </div>

                {/* Audit & Review Status */}
                <div className="border border-slate-200 rounded-md p-3 text-xs space-y-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Current Review Status:</span>
                    <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedCase.reviewStatus || 'Pending'}
                    </span>
                  </div>
                  {selectedCase.reviewerNotes && (
                    <div className="text-slate-600 border-t border-slate-100 pt-1.5">
                      <strong className="text-slate-800">Reviewer Note:</strong> {selectedCase.reviewerNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons to Update Status */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={statusUpdateNote}
                    onChange={(e) => setStatusUpdateNote(e.target.value)}
                    placeholder="Enter clinical resolution note or escalation ticket ID..."
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange('Under Review')}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium transition-colors"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('Escalated')}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 font-medium transition-colors shadow-xs"
                  >
                    Escalate to Risk Management
                  </button>
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    className="px-3 py-1.5 bg-teal-700 text-white rounded-md hover:bg-teal-800 font-medium transition-colors shadow-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a case on the left to inspect risk forensics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
