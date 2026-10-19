import React, { useState } from 'react';
import { EXECUTIVE_RECOMMENDATIONS } from '../utils/analytics';
import { ExecutiveRecommendation } from '../types/dashboard';
import {
  Briefcase,
  Zap,
  Target,
  Sparkles,
  Calendar,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface ExecutiveRecommendationsProps {
  onPrintReport: () => void;
}

export const ExecutiveRecommendations: React.FC<ExecutiveRecommendationsProps> = ({
  onPrintReport,
}) => {
  const [recommendations, setRecommendations] = useState<ExecutiveRecommendation[]>(
    EXECUTIVE_RECOMMENDATIONS
  );
  const [activeCategory, setActiveCategory] = useState<
    'All' | 'Top Priority' | 'Quick Win (3 Mo)' | 'Long-Term AI (6-12 Mo)'
  >('All');

  const topPriorities = recommendations.filter((r) => r.category === 'Top Priority');
  const quickWins = recommendations.filter((r) => r.category === 'Quick Win (3 Mo)');
  const longTermAI = recommendations.filter((r) => r.category === 'Long-Term AI (6-12 Mo)');

  const toggleStatus = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nextStatus =
          r.status === 'In Planning'
            ? 'Ready to Deploy'
            : r.status === 'Ready to Deploy'
            ? 'Under Evaluation'
            : 'In Planning';
        return { ...r, status: nextStatus };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 9: Executive Recommendations & Strategic Roadmap
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>C-Suite Action Matrix & Phased Implementation Schedule</span>
              <span aria-hidden="true">·</span>
              <span>Hospital Board of Directors Briefing</span>
            </div>
          </div>
          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Brief</span>
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Synthesizing feedback across 1,248 patient encounters into a definitive executive roadmap: 5 critical organizational priorities, immediate 90-day quick wins, and transformative 6–12 month autonomous AI horizon programs.
        </p>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Initiatives ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveCategory('Top Priority')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeCategory === 'Top Priority'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            Top 5 Priorities ({topPriorities.length})
          </button>
          <button
            onClick={() => setActiveCategory('Quick Win (3 Mo)')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeCategory === 'Quick Win (3 Mo)'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Quick Wins &lt; 3 Mo ({quickWins.length})
          </button>
          <button
            onClick={() => setActiveCategory('Long-Term AI (6-12 Mo)')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeCategory === 'Long-Term AI (6-12 Mo)'
                ? 'bg-teal-700 text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            Long-Term AI 6–12 Mo ({longTermAI.length})
          </button>
        </div>
      </div>

      {/* 1. TOP 5 ORGANIZATIONAL PRIORITIES */}
      {(activeCategory === 'All' || activeCategory === 'Top Priority') && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Top 5 Immediate Organizational Priorities
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Board Oversight Mandate</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {topPriorities.map((rec, i) => (
              <div
                key={rec.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/40 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-700">0{i + 1}.</span>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>
                      <strong className="text-slate-700">Lead Stakeholder:</strong> {rec.leadStakeholder}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">
                      Target: {rec.expectedOutcome}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => toggleStatus(rec.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold border rounded text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                    title="Click to cycle status"
                  >
                    {rec.status}
                  </button>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      rec.effort === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : rec.effort === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {rec.effort} Effort
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. QUICK WINS (WITHIN 3 MONTHS) */}
      {(activeCategory === 'All' || activeCategory === 'Quick Win (3 Mo)') && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Quick Wins (Deployable within 3 Months)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Low-Friction Rapid Impact</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickWins.map((rec) => (
              <div
                key={rec.id}
                className="border border-slate-200 rounded-lg p-4 bg-white hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      &lt; 90 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{rec.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Owner:</span>
                    <span className="text-slate-800 font-medium">{rec.leadStakeholder}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Outcome:</span>
                    <span>{rec.expectedOutcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LONG-TERM AI OPPORTUNITIES (6–12 MONTHS) */}
      {(activeCategory === 'All' || activeCategory === 'Long-Term AI (6-12 Mo)') && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Long-Term AI Horizon Opportunities (6–12 Months)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Transformative Autonomous Systems</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {longTermAI.map((rec) => (
              <div
                key={rec.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-900 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-teal-400 font-mono text-xs font-bold">HORIZON:</span>
                    <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Lead: {rec.leadStakeholder}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-300 font-medium">{rec.expectedOutcome}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded">
                    6–12 Month Horizon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
