import React, { useState } from 'react';
import { PRESET_DATASETS, DatasetPreset, parseFeedbackCSV, SAMPLE_CSV_TEMPLATE } from '../data/datasets';
import { PatientComment } from '../types/dashboard';
import { X, Upload, Database, Check, FileText, Download, AlertCircle } from 'lucide-react';

interface DatasetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDatasetId: string;
  onSelectPreset: (preset: DatasetPreset) => void;
  onCustomDatasetLoaded: (data: PatientComment[], name: string) => void;
}

export const DatasetSelectorModal: React.FC<DatasetSelectorModalProps> = ({
  isOpen,
  onClose,
  currentDatasetId,
  onSelectPreset,
  onCustomDatasetLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseFeedbackCSV(text);
        if (parsed.length === 0) {
          setErrorMsg('Failed to parse patient records. Please ensure CSV headers include "comment", "satisfaction", or "service_line".');
          setIsProcessing(false);
          return;
        }

        onCustomDatasetLoaded(parsed, file.name.replace(/\.[^/.]+$/, ''));
        setIsProcessing(false);
        onClose();
      } catch (err: any) {
        setErrorMsg('Error parsing CSV file: ' + err.message);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Failed to read the uploaded file.');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient_feedback_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hospital Patient Feedback Dataset</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an enterprise hospital cohort or upload a custom patient survey CSV
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Cohorts */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Standard Hospital Presets
            </h4>
            <div className="space-y-3">
              {PRESET_DATASETS.map((preset) => {
                const isSelected = currentDatasetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-teal-700" />
                        <span className="text-sm font-bold text-slate-900">{preset.name}</span>
                        <span className="text-xs font-medium text-slate-500 font-mono">
                          ({preset.facility})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{preset.description}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded tabular-nums">
                        {preset.count.toLocaleString()} records
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-teal-700" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload Custom CSV */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Upload Custom Patient Feedback CSV
              </h4>
              <button
                onClick={handleDownloadTemplate}
                className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-teal-600 bg-teal-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-800">
                Drag and drop your patient feedback CSV here
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports columns: comment, satisfaction_score, service_line, persona, wait_time
              </p>
              <label className="mt-3 inline-block">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <span className="px-3 py-1.5 bg-white border border-slate-300 text-xs font-semibold text-slate-700 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-xs">
                  Browse Files
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
