import React, { useState, useMemo } from 'react';
import { DEFAULT_PATIENT_FEEDBACK } from './data/mockFeedbackData';
import { PRESET_DATASETS, DatasetPreset } from './data/datasets';
import {
  PatientComment,
  FilterState,
  ServiceLine,
  VisitType,
  PatientPersona,
} from './types/dashboard';
import { computeKPIOverview } from './utils/analytics';

// Components
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { SatisfactionInsights } from './components/SatisfactionInsights';
import { NLPAnalysis } from './components/NLPAnalysis';
import { HiddenProblems } from './components/HiddenProblems';
import { HealthcareEquity } from './components/HealthcareEquity';
import { AIRiskMonitoring } from './components/AIRiskMonitoring';
import { AIAgentOpportunities } from './components/AIAgentOpportunities';
import { ExecutiveRecommendations } from './components/ExecutiveRecommendations';

// Modals and Drawers
import { CommentDrilldownDrawer } from './components/CommentDrilldownDrawer';
import { DatasetSelectorModal } from './components/DatasetSelectorModal';
import { ExecutivePresentationView } from './components/ExecutivePresentationView';
import { AskExecutiveAgentModal } from './components/AskExecutiveAgentModal';

import { FileText, LayoutGrid, Download, Printer } from 'lucide-react';

export default function App() {
  // Current active dataset
  const [datasetName, setDatasetName] = useState<string>('Metropolitan Academic Medical Center');
  const [currentDatasetId, setCurrentDatasetId] = useState<string>('metro-enterprise');
  const [allComments, setAllComments] = useState<PatientComment[]>(DEFAULT_PATIENT_FEEDBACK);

  // Active view tab: 'overview' | 'satisfaction' | 'nlp' | 'problems' | 'equity-risk' | 'strategy' | 'full-briefing'
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isFullBriefingMode, setIsFullBriefingMode] = useState<boolean>(false);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    serviceLine: 'All',
    visitType: 'All',
    patientPersona: 'All',
    sentiment: 'All',
    riskFlag: 'All',
    problemCategory: 'All',
    dateRange: 'All',
  });

  // Modals & Drawers state
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Comment Drilldown Drawer
  const [drilldownState, setDrilldownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    comments: PatientComment[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    comments: [],
  });

  // Filtered comments computation
  const filteredComments = useMemo(() => {
    return allComments.filter((c) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesComment = c.comment.toLowerCase().includes(q);
        const matchesMRN = c.patientId.toLowerCase().includes(q);
        const matchesTheme = c.primaryTheme.toLowerCase().includes(q);
        const matchesKeyword = c.keywords.some((k) => k.toLowerCase().includes(q));
        if (!matchesComment && !matchesMRN && !matchesTheme && !matchesKeyword) return false;
      }

      // Service line
      if (filters.serviceLine !== 'All' && c.serviceLine !== filters.serviceLine) {
        return false;
      }

      // Visit type
      if (filters.visitType !== 'All' && c.visitType !== filters.visitType) {
        return false;
      }

      // Persona
      if (filters.patientPersona !== 'All' && c.patientPersona !== filters.patientPersona) {
        return false;
      }

      // Sentiment
      if (filters.sentiment !== 'All' && c.sentiment !== filters.sentiment) {
        return false;
      }

      // Risk Flag
      if (filters.riskFlag !== 'All' && c.riskFlag !== filters.riskFlag) {
        return false;
      }

      // Problem Category
      if (filters.problemCategory !== 'All' && c.problemCategory !== filters.problemCategory) {
        return false;
      }

      return true;
    });
  }, [allComments, filters]);

  // Computed KPIs for filtered set
  const kpis = useMemo(() => {
    return computeKPIOverview(filteredComments);
  }, [filteredComments]);

  // Handlers for dataset switching
  const handleSelectPreset = (preset: DatasetPreset) => {
    setDatasetName(preset.facility);
    setCurrentDatasetId(preset.id);
    setAllComments(preset.data);
  };

  const handleCustomDatasetLoaded = (data: PatientComment[], name: string) => {
    setDatasetName(`Custom Upload: ${name}`);
    setCurrentDatasetId('custom-upload');
    setAllComments(data);
  };

  // Status updates on risk comments
  const handleUpdateCommentStatus = (
    id: string,
    status: 'Under Review' | 'Resolved' | 'Escalated',
    note?: string
  ) => {
    setAllComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          reviewStatus: status,
          reviewerNotes: note || c.reviewerNotes,
        };
      })
    );
  };

  // Drilldown triggers
  const openDrilldown = (title: string, subtitle: string, commentsSubset: PatientComment[]) => {
    setDrilldownState({
      isOpen: true,
      title,
      subtitle,
      comments: commentsSubset,
    });
  };

  const handleScoreDrilldown = (score: number) => {
    const subset = filteredComments.filter((c) => c.satisfactionScore === score);
    openDrilldown(
      `${score} Star Patient Feedback`,
      `Showing all verbatims with satisfaction rating ${score} of 5`,
      subset
    );
  };

  const handleServiceLineDrilldown = (sl: ServiceLine) => {
    const subset = filteredComments.filter((c) => c.serviceLine === sl);
    openDrilldown(
      `${sl} Feedback & Verbatims`,
      `Service Line deep-dive for ${sl}`,
      subset
    );
  };

  const handleVisitTypeDrilldown = (vt: VisitType) => {
    const subset = filteredComments.filter((c) => c.visitType === vt);
    openDrilldown(
      `${vt} Encounters`,
      `Care setting feedback for ${vt}`,
      subset
    );
  };

  const handlePersonaDrilldown = (p: PatientPersona) => {
    const subset = filteredComments.filter((c) => c.patientPersona === p);
    openDrilldown(
      `${p} Cohort Feedback`,
      `Demographic experience records for ${p}`,
      subset
    );
  };

  const handleThemeDrilldown = (theme: string) => {
    const subset = filteredComments.filter((c) => c.primaryTheme === theme);
    openDrilldown(
      `Theme: "${theme}"`,
      `Patient comments categorized under ${theme}`,
      subset
    );
  };

  const handleKeywordDrilldown = (kw: string) => {
    const lower = kw.toLowerCase();
    const subset = filteredComments.filter(
      (c) =>
        c.comment.toLowerCase().includes(lower) ||
        c.keywords.some((k) => k.toLowerCase().includes(lower))
    );
    openDrilldown(
      `Keyword: "${kw}"`,
      `Patient comments referencing term "${kw}"`,
      subset
    );
  };

  const handleProblemCategoryFilter = (category: any) => {
    setFilters((prev) => ({ ...prev, problemCategory: category }));
    const subset = filteredComments.filter((c) => c.problemCategory === category);
    openDrilldown(
      `Problem Category: ${category}`,
      `Operational incidents categorized under ${category}`,
      subset
    );
  };

  const handleEquityFilter = (issue: string) => {
    const subset = filteredComments.filter((c) => c.equityIssue === issue);
    openDrilldown(
      `Health Equity Flag: ${issue}`,
      `Patient encounters involving ${issue}`,
      subset
    );
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'id',
      'patientId',
      'date',
      'serviceLine',
      'visitType',
      'patientPersona',
      'satisfactionScore',
      'communicationRating',
      'waitTimeMinutes',
      'followUpCompliant',
      'sentiment',
      'sentimentScore',
      'primaryTheme',
      'riskFlag',
      'riskSeverity',
      'comment',
    ];

    const rows = filteredComments.map((c) => [
      c.id,
      c.patientId,
      c.date,
      `"${c.serviceLine}"`,
      `"${c.visitType}"`,
      `"${c.patientPersona}"`,
      c.satisfactionScore,
      c.communicationRating,
      c.waitTimeMinutes,
      c.followUpCompliant,
      c.sentiment,
      c.sentimentScore,
      `"${c.primaryTheme}"`,
      `"${c.riskFlag}"`,
      `"${c.riskSeverity || ''}"`,
      `"${c.comment.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `healthcare_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsFullBriefingMode(false);
        }}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onOpenPresentationMode={() => setIsPresentationOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onExportCSV={handleExportCSV}
        datasetName={datasetName}
        totalCommentsCount={allComments.length}
      />

      {/* Global Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalCount={allComments.length}
        filteredCount={filteredComments.length}
      />

      {/* Mode View Switcher Bar */}
      <div className="bg-slate-100/70 border-b border-slate-200 py-2 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Dashboard Layout:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded p-0.5">
              <button
                onClick={() => setIsFullBriefingMode(false)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  !isFullBriefingMode ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tabbed Section Explorer</span>
              </button>
              <button
                onClick={() => setIsFullBriefingMode(true)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  isFullBriefingMode ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Continuous Briefing</span>
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-500">
            <span>Healthcare Leadership Intelligence Console</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handlePrintReport}
              className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Executive Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* If in Continuous Full Briefing mode, render all 8 sections in sequence */}
        {isFullBriefingMode ? (
          <div className="space-y-12">
            {/* Section 1 */}
            <section id="section-overview">
              <ExecutiveOverview
                kpis={kpis}
                onNavigateToSection={(s) => {
                  const el = document.getElementById(`section-${s}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSelectRiskFilter={() => {
                  setFilters((prev) => ({ ...prev, riskFlag: 'Human Review Required' }));
                  const el = document.getElementById('section-risk');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </section>

            {/* Section 2 */}
            <section id="section-satisfaction" className="print-page-break">
              <SatisfactionInsights
                comments={filteredComments}
                onSelectScoreDrilldown={handleScoreDrilldown}
                onSelectServiceLine={handleServiceLineDrilldown}
                onSelectVisitType={handleVisitTypeDrilldown}
                onSelectPersona={handlePersonaDrilldown}
              />
            </section>

            {/* Section 3 */}
            <section id="section-nlp" className="print-page-break">
              <NLPAnalysis
                comments={filteredComments}
                onSelectThemeDrilldown={handleThemeDrilldown}
                onSelectKeywordDrilldown={handleKeywordDrilldown}
              />
            </section>

            {/* Section 4 */}
            <section id="section-problems" className="print-page-break">
              <HiddenProblems
                comments={filteredComments}
                onSelectServiceLine={handleServiceLineDrilldown}
                onFilterProblemCategory={handleProblemCategoryFilter}
              />
            </section>

            {/* Section 6 */}
            <section id="section-equity" className="print-page-break">
              <HealthcareEquity
                comments={filteredComments}
                onSelectPersona={handlePersonaDrilldown}
                onFilterEquityIssue={handleEquityFilter}
              />
            </section>

            {/* Section 7 */}
            <section id="section-risk" className="print-page-break">
              <AIRiskMonitoring
                comments={filteredComments}
                onUpdateCommentStatus={handleUpdateCommentStatus}
              />
            </section>

            {/* Section 8 */}
            <section id="section-agents" className="print-page-break">
              <AIAgentOpportunities />
            </section>

            {/* Section 9 */}
            <section id="section-recommendations" className="print-page-break">
              <ExecutiveRecommendations onPrintReport={handlePrintReport} />
            </section>
          </div>
        ) : (
          /* Tabbed Explorer Navigation Mode */
          <div>
            {activeTab === 'overview' && (
              <ExecutiveOverview
                kpis={kpis}
                onNavigateToSection={(section) => setActiveTab(section)}
                onSelectRiskFilter={() => {
                  setFilters((prev) => ({ ...prev, riskFlag: 'Human Review Required' }));
                  setActiveTab('equity-risk');
                }}
              />
            )}

            {activeTab === 'satisfaction' && (
              <SatisfactionInsights
                comments={filteredComments}
                onSelectScoreDrilldown={handleScoreDrilldown}
                onSelectServiceLine={handleServiceLineDrilldown}
                onSelectVisitType={handleVisitTypeDrilldown}
                onSelectPersona={handlePersonaDrilldown}
              />
            )}

            {activeTab === 'nlp' && (
              <NLPAnalysis
                comments={filteredComments}
                onSelectThemeDrilldown={handleThemeDrilldown}
                onSelectKeywordDrilldown={handleKeywordDrilldown}
              />
            )}

            {activeTab === 'problems' && (
              <HiddenProblems
                comments={filteredComments}
                onSelectServiceLine={handleServiceLineDrilldown}
                onFilterProblemCategory={handleProblemCategoryFilter}
              />
            )}

            {activeTab === 'equity-risk' && (
              <div className="space-y-10">
                <HealthcareEquity
                  comments={filteredComments}
                  onSelectPersona={handlePersonaDrilldown}
                  onFilterEquityIssue={handleEquityFilter}
                />
                <AIRiskMonitoring
                  comments={filteredComments}
                  onUpdateCommentStatus={handleUpdateCommentStatus}
                />
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-10">
                <AIAgentOpportunities />
                <ExecutiveRecommendations onPrintReport={handlePrintReport} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-800 font-semibold">Healthcare Analytics Agent</strong>
            <span className="mx-2">·</span>
            <span>Executive Hospital Leadership Intelligence Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPresentationOpen(true)}
              className="text-slate-700 hover:text-teal-700 font-medium"
            >
              Board Presentation Mode
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportCSV}
              className="text-slate-700 hover:text-teal-700 font-medium"
            >
              Export Records ({filteredComments.length})
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsDatasetModalOpen(true)}
              className="text-slate-700 hover:text-teal-700 font-medium"
            >
              Upload / Switch Dataset
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals and Flyouts */}
      <CommentDrilldownDrawer
        isOpen={drilldownState.isOpen}
        onClose={() => setDrilldownState((prev) => ({ ...prev, isOpen: false }))}
        title={drilldownState.title}
        subtitle={drilldownState.subtitle}
        comments={drilldownState.comments}
      />

      <DatasetSelectorModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        currentDatasetId={currentDatasetId}
        onSelectPreset={handleSelectPreset}
        onCustomDatasetLoaded={handleCustomDatasetLoaded}
      />

      <ExecutivePresentationView
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        kpis={kpis}
        comments={filteredComments}
      />

      <AskExecutiveAgentModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        kpis={kpis}
        comments={filteredComments}
      />
    </div>
  );
}
