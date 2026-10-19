import React from 'react';
import { PatientComment } from '../types/dashboard';
import { X, Star, AlertTriangle, ShieldAlert, Clock, CheckCircle2, User } from 'lucide-react';

interface CommentDrilldownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  comments: PatientComment[];
  onOpenRiskConsole?: () => void;
}

export const CommentDrilldownDrawer: React.FC<CommentDrilldownDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  comments,
  onOpenRiskConsole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <div className="relative z-10 w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{subtitle || 'Patient Experience Records'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {comments.length} matching comments
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Verbatim Comments */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No patient comments match this specific drill-down criteria.
            </div>
          ) : (
            comments.map((c) => {
              const isPos = c.sentiment === 'Positive';
              const isNeg = c.sentiment === 'Negative';
              const hasRisk = c.riskFlag !== 'None';

              return (
                <div
                  key={c.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 shadow-xs"
                >
                  {/* Top Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{c.patientId}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-medium text-slate-700">{c.serviceLine}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{c.visitType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Star Rating */}
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < c.satisfactionScore
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-slate-500 text-[11px]">{c.date}</span>
                    </div>
                  </div>

                  {/* Verbatim Quote */}
                  <p className="text-xs text-slate-800 leading-relaxed font-normal bg-slate-50/70 p-3 rounded border border-slate-100 italic">
                    "{c.comment}"
                  </p>

                  {/* Operational & Risk Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isNeg
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.sentiment} ({c.sentimentScore > 0 ? `+${c.sentimentScore}` : c.sentimentScore})
                      </span>

                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        Theme: {c.primaryTheme}
                      </span>

                      {c.waitTimeMinutes > 0 && (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Wait: {c.waitTimeMinutes}m
                        </span>
                      )}
                    </div>

                    {hasRisk && (
                      <div className="flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{c.riskFlag}</span>
                      </div>
                    )}
                  </div>

                  {/* Persona and Follow Up */}
                  <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{c.patientPersona}</span>
                    </div>
                    <div>
                      {c.followUpCompliant ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Follow-Up Completed
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Follow-Up Missing</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">HIPAA compliant patient feedback archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors"
          >
            Close Drilldown
          </button>
        </div>
      </div>
    </div>
  );
};
