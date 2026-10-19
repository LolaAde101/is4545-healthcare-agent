import React from 'react';
import { Database, Presentation, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDatasetModal: () => void;
  onOpenPresentationMode: () => void;
  onOpenAIAssistant: () => void;
  onExportCSV: () => void;
  datasetName: string;
  totalCommentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDatasetModal,
  onOpenPresentationMode,
  onOpenAIAssistant,
  onExportCSV,
  datasetName,
  totalCommentsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-teal-700 transition-colors text-left"
            >
              Healthcare Analytics Agent
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4">
              <span>{datasetName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{totalCommentsCount.toLocaleString()} records</span>
            </div>
          </div>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'overview' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab('satisfaction')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'satisfaction' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Satisfaction Insights
            </button>
            <button
              onClick={() => setActiveTab('nlp')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'nlp' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              NLP & Themes
            </button>
            <button
              onClick={() => setActiveTab('problems')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'problems' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Hidden Problems
            </button>
            <button
              onClick={() => setActiveTab('equity-risk')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'equity-risk' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              Equity & AI Risks
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'strategy' ? 'text-teal-700 font-semibold border-b-2 border-teal-700' : ''
              }`}
            >
              AI Agents & Priorities
            </button>
          </nav>

          {/* Zone 3: Primary action cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors whitespace-nowrap"
              title="Query AI Analytics Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Executive AI Brief</span>
            </button>

            <button
              onClick={onOpenDatasetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
              title="Switch or Upload Dataset"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Switch Dataset</span>
            </button>

            <button
              onClick={onOpenPresentationMode}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
              title="Launch Executive Presentation Mode"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Presentation Mode</span>
            </button>

            <button
              onClick={onExportCSV}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
              title="Export Filtered CSV Data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
