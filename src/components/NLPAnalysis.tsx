import React, { useState } from 'react';
import { PatientComment } from '../types/dashboard';
import { computeTopThemes, computeKeywordStats } from '../utils/analytics';
import { Sparkles, MessageSquareQuote, CheckCircle, AlertTriangle } from 'lucide-react';

interface NLPAnalysisProps {
  comments: PatientComment[];
  onSelectThemeDrilldown: (theme: string) => void;
  onSelectKeywordDrilldown: (keyword: string) => void;
}

export const NLPAnalysis: React.FC<NLPAnalysisProps> = ({
  comments,
  onSelectThemeDrilldown,
  onSelectKeywordDrilldown,
}) => {
  const themes = computeTopThemes(comments);
  const keywords = computeKeywordStats(comments);
  const [selectedKeywordCategory, setSelectedKeywordCategory] = useState<string>('All');
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const categories = ['All', 'Clinical', 'Operational', 'Communication', 'Technology', 'Scheduling', 'Equity', 'Accessibility'];

  const filteredKeywords =
    selectedKeywordCategory === 'All'
      ? keywords
      : keywords.filter((k) => k.category === selectedKeywordCategory);

  // Layout coordinates for SVG Word Cloud
  const wordCloudData = keywords.slice(0, 22).map((k, index) => {
    // Sizing between 13px and 34px
    const maxCount = keywords[0]?.count || 1;
    const size = Math.round(13 + (k.count / maxCount) * 22);

    // Color based on sentiment
    const color =
      k.sentiment === 'Positive'
        ? '#059669' // emerald-600
        : k.sentiment === 'Negative'
        ? '#e11d48' // rose-600
        : '#475569'; // slate-600

    return {
      ...k,
      size,
      color,
    };
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 3: Natural Language Processing (NLP) Analysis
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Unstructured Patient Feedback Semantic Extraction</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{comments.length} Patient Comments Processed</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Multi-Class Theme Classifier & Lemmatized Keyword Frequencies</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          AI-driven thematic clustering reveals the hidden drivers of satisfaction and distress.
          While bedside nursing empathy drives the highest positive sentiment, wait times and discharge ambiguity dominate negative discourse.
        </p>
      </div>

      {/* Visual 1: Interactive Word Cloud & Keyword Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Word Cloud */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interactive Patient Feedback Word Cloud</h3>
              <div className="text-xs text-slate-500">Semantic term frequency scaled by sentiment intensity</div>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Neutral
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Negative
              </span>
            </div>
          </div>

          {/* Word Cloud Surface */}
          <div className="my-6 p-4 bg-slate-50 rounded-lg border border-slate-100 min-h-[280px] flex flex-wrap items-center justify-center gap-x-4 gap-y-3 select-none">
            {wordCloudData.map((item) => (
              <button
                key={item.keyword}
                onClick={() => onSelectKeywordDrilldown(item.keyword)}
                onMouseEnter={() => setHoveredWord(item.keyword)}
                onMouseLeave={() => setHoveredWord(null)}
                style={{
                  fontSize: `${item.size}px`,
                  color: item.color,
                }}
                className={`font-semibold cursor-pointer transition-all duration-150 transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded px-1.5 py-0.5 ${
                  hoveredWord === item.keyword ? 'bg-white shadow-xs underline' : ''
                }`}
                title={`Keyword: "${item.keyword}" · Occurred ${item.count} times (${item.sentiment})`}
              >
                {item.keyword}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Click any keyword to open the exact patient feedback verbatims</span>
            <span className="font-mono text-slate-700">Hover for frequency and sentiment</span>
          </div>
        </div>

        {/* Visual 2: Ranked Keyword Frequency List with Category Filters */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Most Frequently Occurring Keywords</h3>
              <div className="text-xs text-slate-500">Occurrences and domain taxonomy</div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1 mt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedKeywordCategory(cat)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                  selectedKeywordCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Keyword Frequency Bars */}
          <div className="mt-3 divide-y divide-slate-100 overflow-y-auto max-h-[300px] pr-1">
            {filteredKeywords.map((k) => {
              const maxCount = keywords[0]?.count || 1;
              const barWidth = (k.count / maxCount) * 100;
              const isPos = k.sentiment === 'Positive';
              const isNeg = k.sentiment === 'Negative';

              return (
                <div
                  key={k.keyword}
                  onClick={() => onSelectKeywordDrilldown(k.keyword)}
                  className="py-2 hover:bg-slate-50 px-2 rounded cursor-pointer group transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {k.keyword}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({k.category})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                      <span className="text-slate-600">{k.count} mentions</span>
                      <span
                        className={`text-[10px] font-medium ${
                          isPos ? 'text-emerald-700' : isNeg ? 'text-rose-700' : 'text-slate-500'
                        }`}
                      >
                        {k.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        isPos ? 'bg-emerald-500' : isNeg ? 'bg-rose-500' : 'bg-slate-400'
                      } rounded-full`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual 3 & 4: Top Themes Identified from Comments & Theme Distribution */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Top Themes Identified from Comments & Sentiment Distribution
            </h3>
            <div className="text-xs text-slate-500">
              Frequency ranking, sentiment ratio, and average satisfaction per clinical theme
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">Click any theme for verbatim comments</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((t) => {
            const total = t.count;
            const posPct = ((t.positiveCount / total) * 100).toFixed(0);
            const negPct = ((t.negativeCount / total) * 100).toFixed(0);
            const neuPct = ((t.neutralCount / total) * 100).toFixed(0);

            const isHighSat = t.avgSatisfaction >= 4.0;
            const isLowSat = t.avgSatisfaction <= 2.8;

            return (
              <div
                key={t.theme}
                onClick={() => onSelectThemeDrilldown(t.theme)}
                className="border border-slate-200 rounded-lg p-4 hover:border-teal-500 hover:shadow-xs transition-all cursor-pointer bg-white group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {t.theme}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {t.count} comments ({t.percentage}% of all analyzed feedback)
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono tabular-nums ${
                        isHighSat ? 'text-emerald-700' : isLowSat ? 'text-rose-700' : 'text-slate-800'
                      }`}
                    >
                      {t.avgSatisfaction.toFixed(2)} / 5.0
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Avg Score</div>
                  </div>
                </div>

                {/* Sentiment Distribution Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-1">
                    <span className="text-emerald-700">+{posPct}% Pos</span>
                    <span className="text-slate-500">{neuPct}% Neu</span>
                    <span className="text-rose-700">-{negPct}% Neg</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${posPct}%` }} />
                    <div className="bg-slate-300 h-full transition-all" style={{ width: `${neuPct}%` }} />
                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${negPct}%` }} />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Net Sentiment:</span>
                  <span
                    className={`font-mono font-medium ${
                      t.sentimentRatio >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {t.sentimentRatio >= 0 ? `+${t.sentimentRatio}%` : `${t.sentimentRatio}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
