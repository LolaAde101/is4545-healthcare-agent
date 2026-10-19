import React from 'react';
import { PatientComment, ServiceLine, VisitType, PatientPersona } from '../types/dashboard';
import {
  computeSatisfactionDistribution,
  computeSatisfactionByServiceLine,
  computeSatisfactionByVisitType,
  computeSatisfactionByPersona,
} from '../utils/analytics';
import { Star, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SatisfactionInsightsProps {
  comments: PatientComment[];
  onSelectServiceLine: (sl: ServiceLine) => void;
  onSelectVisitType: (vt: VisitType) => void;
  onSelectPersona: (p: PatientPersona) => void;
  onSelectScoreDrilldown: (score: number) => void;
}

export const SatisfactionInsights: React.FC<SatisfactionInsightsProps> = ({
  comments,
  onSelectServiceLine,
  onSelectVisitType,
  onSelectPersona,
  onSelectScoreDrilldown,
}) => {
  const distribution = computeSatisfactionDistribution(comments);
  const serviceLineStats = computeSatisfactionByServiceLine(comments);
  const visitTypeStats = computeSatisfactionByVisitType(comments);
  const personaStats = computeSatisfactionByPersona(comments);

  // Calculate highest and lowest satisfaction service lines
  const sortedBySat = [...serviceLineStats].sort((a, b) => b.avgSatisfaction - a.avgSatisfaction);
  const topService = sortedBySat[0];
  const lowestService = sortedBySat[sortedBySat.length - 1];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 2: Patient Satisfaction Insights
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Experience Scores & Disparity Analysis</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{comments.length} Encounters Evaluated</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-slate-600">
              Top Rated:{' '}
              <span className="font-semibold text-emerald-700">
                {topService?.serviceLine} ({topService?.avgSatisfaction.toFixed(2)})
              </span>
            </div>
            <div className="text-slate-600">
              Needs Attention:{' '}
              <span className="font-semibold text-rose-700">
                {lowestService?.serviceLine} ({lowestService?.avgSatisfaction.toFixed(2)})
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Breakdown of patient satisfaction across ratings, clinical departments, care modalities, and demographic personas.
          Click any bar or category to drill directly into corresponding patient feedback verbatims.
        </p>
      </div>

      {/* Grid: Distribution (1-5 stars) and Visit Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual 1: Satisfaction Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Satisfaction Score Distribution</h3>
              <div className="text-xs text-slate-500">1 to 5 Stars Frequency & Proportion</div>
            </div>
            <span className="text-xs font-mono text-slate-500">Click to filter</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {distribution.map((item) => {
              const isHigh = item.score >= 4;
              const isLow = item.score <= 2;
              const barColor = isHigh
                ? 'bg-emerald-500'
                : isLow
                ? 'bg-rose-500'
                : 'bg-amber-400';

              return (
                <button
                  key={item.score}
                  onClick={() => onSelectScoreDrilldown(item.score)}
                  className="w-full text-left group hover:bg-slate-50 p-1.5 rounded transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700 group-hover:text-slate-900">
                      <div className="flex items-center">
                        {Array.from({ length: item.score }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-slate-500 text-[11px] ml-1">({item.label})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 text-[11px] tabular-nums">
                        {item.count.toLocaleString()} comments
                      </span>
                      <span className="font-mono font-semibold text-slate-900 text-xs tabular-nums min-w-[42px] text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-300`}
                      style={{ width: `${Math.max(2, item.percentage)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Favorable (4-5 Stars): {((distribution[3].count + distribution[4].count) / (comments.length || 1) * 100).toFixed(1)}%</span>
            <span>Unfavorable (1-2 Stars): {((distribution[0].count + distribution[1].count) / (comments.length || 1) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Visual 2: Satisfaction by Visit Type */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Satisfaction by Care Setting / Visit Type</h3>
              <div className="text-xs text-slate-500">Encounter Modality Performance</div>
            </div>
            <span className="text-xs font-mono text-slate-500">Click to filter</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {visitTypeStats.map((item) => {
              const scorePct = (item.avgSatisfaction / 5.0) * 100;
              const isLow = item.avgSatisfaction < 3.8;

              return (
                <button
                  key={item.visitType}
                  onClick={() => onSelectVisitType(item.visitType)}
                  className="w-full text-left group hover:bg-slate-50 p-1.5 rounded transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {item.visitType}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px] tabular-nums">
                        {item.count} encounters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs tabular-nums">
                      <span className="text-slate-500 text-[11px]">Avg Wait: {item.avgWaitTime}m</span>
                      <span className={`font-bold ${isLow ? 'text-rose-700' : 'text-slate-900'}`}>
                        {item.avgSatisfaction.toFixed(2)} / 5.0
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${isLow ? 'bg-amber-500' : 'bg-teal-600'} rounded-full transition-all duration-300`}
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Emergency/Trauma displays lowest satisfaction due to boarding lag</span>
            <span className="font-mono font-medium text-slate-700">Telehealth: 3.98/5.0</span>
          </div>
        </div>
      </div>

      {/* Visual 3: Satisfaction by Service Line */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Satisfaction by Clinical Service Line</h3>
            <div className="text-xs text-slate-500">Cross-departmental performance and complaint vulnerability</div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Total Encounters</span>
            <span>Avg Satisfaction</span>
            <span>Complaint Rate</span>
          </div>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {serviceLineStats.map((item) => {
            const satBarWidth = (item.avgSatisfaction / 5.0) * 100;
            return (
              <div
                key={item.serviceLine}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded transition-colors group cursor-pointer"
                onClick={() => onSelectServiceLine(item.serviceLine)}
              >
                <div className="md:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {item.serviceLine}
                    </span>
                    {item.isAnomalyHighComplaints && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> High Complaint Anomaly
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {item.totalComments} comments · Avg wait {item.avgWaitTime} mins
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="md:w-1/3">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        item.avgSatisfaction >= 4.2
                          ? 'bg-emerald-500'
                          : item.avgSatisfaction >= 3.8
                          ? 'bg-teal-600'
                          : 'bg-rose-500'
                      } rounded-full`}
                      style={{ width: `${satBarWidth}%` }}
                    />
                  </div>
                </div>

                {/* Numeric Metrics */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3 text-xs font-mono tabular-nums">
                  <div className="text-slate-600">
                    <span className="text-slate-400 text-[10px] block md:hidden">Satisfaction</span>
                    <strong className="text-slate-900 font-bold">{item.avgSatisfaction.toFixed(2)}</strong> / 5.0
                  </div>
                  <div className="text-slate-600">
                    <span className="text-slate-400 text-[10px] block md:hidden">Comm Rating</span>
                    <span>{item.avgCommunication.toFixed(2)}</span>
                  </div>
                  <div className="min-w-[65px] text-right">
                    <span className="text-slate-400 text-[10px] block md:hidden">Complaint %</span>
                    <span
                      className={`font-semibold ${
                        item.complaintRate > 25 ? 'text-rose-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {item.complaintRate}%
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual 4: Satisfaction by Patient Persona */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Satisfaction by Patient Persona Cohort</h3>
            <div className="text-xs text-slate-500">Demographic experience disparity and engagement variance</div>
          </div>
          <span className="text-xs font-mono text-slate-500">Click persona to isolate cohort</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {personaStats.map((item) => {
            const isDisadvantaged = item.avgSatisfaction < 3.8;
            return (
              <div
                key={item.persona}
                onClick={() => onSelectPersona(item.persona)}
                className="border border-slate-200 rounded-lg p-4 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer bg-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 hover:text-teal-700 transition-colors">
                    {item.persona}
                  </h4>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {item.totalComments} pts
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-extrabold font-mono tabular-nums ${
                      isDisadvantaged ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {item.avgSatisfaction.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 5.0</span>
                  {isDisadvantaged && (
                    <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-medium ml-auto">
                      Disparity Gap
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                  <div className="flex justify-between">
                    <span>Communication:</span>
                    <span className="font-mono text-slate-700 font-medium tabular-nums">{item.avgCommunication.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Follow-Up Adherence:</span>
                    <span className="font-mono text-slate-700 font-medium tabular-nums">{item.followUpRate}%</span>
                  </div>
                  {item.languageIssues > 0 && (
                    <div className="flex justify-between text-rose-700">
                      <span>Language Barriers:</span>
                      <span className="font-mono font-medium tabular-nums">{item.languageIssues} flagged</span>
                    </div>
                  )}
                  {item.digitalLiteracyIssues > 0 && (
                    <div className="flex justify-between text-amber-700">
                      <span>Digital Friction:</span>
                      <span className="font-mono font-medium tabular-nums">{item.digitalLiteracyIssues} flagged</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
