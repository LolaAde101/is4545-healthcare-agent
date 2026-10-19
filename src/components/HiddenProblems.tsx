import React from 'react';
import { PatientComment, ServiceLine } from '../types/dashboard';
import { computeHiddenProblems } from '../utils/analytics';
import {
  AlertTriangle,
  Clock,
  Laptop,
  Calendar,
  MessageCircleOff,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface HiddenProblemsProps {
  comments: PatientComment[];
  onSelectServiceLine: (sl: ServiceLine) => void;
  onFilterProblemCategory: (category: any) => void;
}

export const HiddenProblems: React.FC<HiddenProblemsProps> = ({
  comments,
  onSelectServiceLine,
  onFilterProblemCategory,
}) => {
  const {
    outlierServiceLines,
    communicationBottlenecks,
    technologyIssues,
    schedulingFriction,
    waitTimeComplaints,
  } = computeHiddenProblems(comments);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 4: Hidden Organizational Problems
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Operational Friction, Bottleneck Forensics & Risk Detection</span>
              <span aria-hidden="true">·</span>
              <span>Root-Cause Analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            <Flame className="w-3.5 h-3.5" />
            <span>High Executive Priority</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Behind aggregate satisfaction figures lie systemic process failures. This section isolates high-complaint service line anomalies, handoff breakdowns, tech friction, scheduling delays, and wait-time bottlenecks that erode patient trust.
        </p>
      </div>

      {/* 1. Service Lines with Unusually High Complaint Rates */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Service Lines with Unusually High Complaint Rates (Statistical Outliers)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Benchmark: System avg 18.2%</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outlierServiceLines.map((item) => (
            <div
              key={item.serviceLine}
              onClick={() => onSelectServiceLine(item.serviceLine)}
              className="border border-rose-200 bg-rose-50/30 rounded-lg p-4 cursor-pointer hover:bg-rose-50/60 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                  {item.serviceLine}
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-mono">
                  ANOMALY
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-rose-700 tabular-nums">
                  {item.complaintRate}%
                </span>
                <span className="text-xs text-rose-600 font-medium">complaint rate</span>
              </div>

              <div className="mt-2 text-xs text-slate-600 space-y-1 border-t border-rose-100 pt-2">
                <div className="flex justify-between">
                  <span>Satisfaction:</span>
                  <span className="font-mono font-semibold">{item.avgSatisfaction.toFixed(2)} / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Wait Time:</span>
                  <span className="font-mono font-semibold">{item.avgWaitTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Follow-Up Rate:</span>
                  <span className="font-mono font-semibold">{item.followUpRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: 2. Communication Bottlenecks & 3. Technology-Related Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Communication Bottlenecks */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircleOff className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Communication Bottlenecks</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Handoff Failure Modes</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {communicationBottlenecks.map((b, i) => (
                <div
                  key={i}
                  onClick={() => onFilterProblemCategory('Communication Bottleneck')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 transition-all cursor-pointer bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        b.severity === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.severity} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{b.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Impacted: {b.impactedServiceLines.join(', ')}</span>
                    <span className="font-mono text-slate-700 font-semibold">{b.incidentCount} cases</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Technology-Related Issues */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Technology-Related Issues</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Digital Friction Nodes</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {technologyIssues.map((tech, i) => (
                <div
                  key={i}
                  onClick={() => onFilterProblemCategory('Technology Issue')}
                  className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 transition-all cursor-pointer bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{tech.title}</h4>
                    <span className="text-[11px] font-mono text-slate-500">{tech.affectedCount} incidents</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{tech.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-teal-700 font-medium">Fix: {tech.resolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4. Scheduling-Related Issues & 5. Wait-Time Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Scheduling-Related Issues */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Scheduling-Related Issues</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Access & Capacity Lag</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {schedulingFriction.map((sched, i) => (
              <div
                key={i}
                onClick={() => onFilterProblemCategory('Scheduling Friction')}
                className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 hover:border-teal-500 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{sched.title}</h4>
                  <span className="text-xs font-mono font-bold text-rose-700">
                    {sched.leadTimeWeeks} Wks Delay
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{sched.description}</p>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Volume: {sched.complaintVolume} complaints</span>
                  <span className="text-slate-800 font-semibold">{sched.financialImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Wait-Time Complaints */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Wait-Time Complaints & Benchmarking</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Dwell Time vs SLA</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {waitTimeComplaints.map((wait, i) => (
              <div
                key={i}
                onClick={() => onFilterProblemCategory('Wait-Time Complaint')}
                className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 hover:border-teal-500 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{wait.metric}</h4>
                  <span className="text-xs font-mono font-bold text-rose-700">{wait.deltaPercent}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Observed Avg</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{wait.averageTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Target Standard</span>
                    <span className="font-mono text-slate-600 text-sm">{wait.benchmark}</span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-200 pt-1.5">
                  <strong className="text-slate-700 font-medium">Root Cause:</strong> {wait.primaryCause}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
