import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { FilterState, ServiceLine, VisitType, PatientPersona, SentimentCategory, RiskFlagType } from '../types/dashboard';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.serviceLine !== 'All' ||
    filters.visitType !== 'All' ||
    filters.patientPersona !== 'All' ||
    filters.sentiment !== 'All' ||
    filters.riskFlag !== 'All';

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      serviceLine: 'All',
      visitType: 'All',
      patientPersona: 'All',
      sentiment: 'All',
      riskFlag: 'All',
      problemCategory: 'All',
      dateRange: 'All',
    });
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search comments, keywords, or patient MRN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Service Line */}
            <select
              value={filters.serviceLine}
              onChange={(e) => setFilters((prev) => ({ ...prev, serviceLine: e.target.value as ServiceLine | 'All' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="All">All Service Lines</option>
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Oncology">Oncology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Primary Care">Primary Care</option>
            </select>

            {/* Visit Type */}
            <select
              value={filters.visitType}
              onChange={(e) => setFilters((prev) => ({ ...prev, visitType: e.target.value as VisitType | 'All' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="All">All Visit Types</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency/Trauma">Emergency/Trauma</option>
              <option value="Telehealth">Telehealth</option>
              <option value="Ambulatory Surgery">Ambulatory Surgery</option>
            </select>

            {/* Persona */}
            <select
              value={filters.patientPersona}
              onChange={(e) => setFilters((prev) => ({ ...prev, patientPersona: e.target.value as PatientPersona | 'All' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="All">All Personas</option>
              <option value="Chronic Disease Senior">Chronic Disease Senior</option>
              <option value="Tech-Savvy Digital First">Tech-Savvy Digital First</option>
              <option value="Working Parent">Working Parent</option>
              <option value="Non-English Native">Non-English Native</option>
              <option value="Low Digital Literacy / Rural">Low Digital Literacy / Rural</option>
              <option value="High-Acuity Acute Care">High-Acuity Acute Care</option>
            </select>

            {/* Sentiment */}
            <select
              value={filters.sentiment}
              onChange={(e) => setFilters((prev) => ({ ...prev, sentiment: e.target.value as SentimentCategory | 'All' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>

            {/* Risk Flag */}
            <select
              value={filters.riskFlag}
              onChange={(e) => setFilters((prev) => ({ ...prev, riskFlag: e.target.value as RiskFlagType | 'All' }))}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              <option value="All">All Risk Profiles</option>
              <option value="Hallucination Trap">Hallucination Traps</option>
              <option value="Bias-Related">Bias-Related</option>
              <option value="Human Review Required">Human Review Required</option>
            </select>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md font-medium transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Result Counter (Tabular numbers without pill enclosures) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Showing</span>
            <span className="font-mono font-semibold text-slate-800 tabular-nums">{filteredCount.toLocaleString()}</span>
            <span>of</span>
            <span className="font-mono text-slate-600 tabular-nums">{totalCount.toLocaleString()}</span>
            <span>comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};
