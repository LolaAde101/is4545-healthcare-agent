import React from 'react';
import { RECOMMENDED_AI_AGENTS } from '../utils/analytics';
import {
  Bot,
  Compass,
  Activity,
  Languages,
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';

interface AIAgentOpportunitiesProps {
  onSelectServiceLineFilter?: (serviceLine: any) => void;
}

export const AIAgentOpportunities: React.FC<AIAgentOpportunitiesProps> = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-indigo-600" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-teal-700" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5 text-emerald-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-amber-600" />;
      default:
        return <Bot className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Section 8: Healthcare AI Agent Opportunities
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Autonomous & Assistive Clinical Workflow Agents</span>
              <span aria-hidden="true">·</span>
              <span>Evidence-Based Pattern Synthesis</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>5 Purpose-Built Agent Blueprints</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          Based on the root causes uncovered in patient feedback—specifically discharge medication contradictions, emergency room boarding delays, multilingual communication failures, and specialty referral lags—we recommend 5 targeted AI agents engineered for hospital operational transformation.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="space-y-4">
        {RECOMMENDED_AI_AGENTS.map((agent, index) => {
          return (
            <div
              key={agent.id}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:border-teal-500 transition-all shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 max-w-3xl">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
                    {getIcon(agent.iconName)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        0{index + 1}.
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{agent.name}</h3>
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-mono">
                        {agent.timeToImplement} Deployment
                      </span>
                    </div>

                    {/* Required: Purpose */}
                    <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 font-semibold block mb-0.5">Purpose:</strong>
                      {agent.purpose}
                    </div>

                    {/* Required: Expected Organizational Impact */}
                    <div className="mt-3 p-3 bg-slate-50/80 rounded-md border border-slate-200/60 text-xs text-slate-800 leading-relaxed">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Expected Organizational Impact:
                      </div>
                      {agent.expectedImpact}
                    </div>
                  </div>
                </div>

                {/* Quantitative Badges & Architecture */}
                <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">PROJECTED ROI IMPACT</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {agent.projectedROI}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">TARGET KPI</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {agent.targetMetric}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">READINESS INDEX</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full"
                          style={{ width: `${agent.readinessScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {agent.readinessScore}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono block">PRIMARY UNITS</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.serviceLines.map((sl) => (
                        <span
                          key={sl}
                          className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                        >
                          {sl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Blueprint Banner */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">Architecture Specification:</span>
                <span className="text-slate-600 truncate">{agent.architectureHighlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
