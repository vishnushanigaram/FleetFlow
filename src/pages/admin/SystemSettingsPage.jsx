import React, { useState } from 'react';
import { mockStorage } from '../../services/api/mockStorage';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Sliders, RefreshCw, AlertTriangle, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export function SystemSettingsPage() {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [errorSimulated, setErrorSimulated] = useState(mockStorage.isSimulatedErrorActive());
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetData = () => {
    mockStorage.resetAll();
    setResetConfirmOpen(false);
    setSuccessMessage('Mock database successfully restored to pristine seed data.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleToggleError = () => {
    mockStorage.toggleSimulatedError();
    setErrorSimulated(mockStorage.isSimulatedErrorActive());
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System Diagnostics & Mock REST Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Evaluate error handling, resilience, network latency simulation, and state reset triggers.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Database State Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Local Mock REST Database Reset
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          FleetFlow persists all mock mutations (created vehicles, updated trips, new fuel logs, e-POD signatures) in <code>localStorage</code>. 
          Use this action to purge custom test entries and restore the baseline demonstration fleet.
        </p>

        <Button
          variant="danger"
          size="sm"
          icon={RefreshCw}
          onClick={() => setResetConfirmOpen(true)}
        >
          Reset Mock Data to Initial Seeds
        </Button>
      </div>

      {/* Network Failure Injection Simulation (Section 21 & 23) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={`w-5 h-5 ${errorSimulated ? 'text-rose-500' : 'text-slate-400'}`} />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Simulated API / Network Error Mode (Section 21 & 23)
              </h3>
              <p className="text-[11px] text-slate-400">
                Tests UI error boundaries, retry buttons, and network failure tolerance.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleError}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              errorSimulated
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {errorSimulated ? 'Error Mode ACTIVE' : 'Normal Operation'}
          </button>
        </div>

        {errorSimulated && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
            <strong>Warning:</strong> Simulated 503 Network Error is active. All subsequent API queries will reject with simulated network downtime until switched off.
          </div>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Entire Mock Logistics Database?"
        message="This will overwrite all vehicles, drivers, trips, fuel logs, and maintenance records with the initial dataset. Any newly created records will be lost."
        confirmText="Confirm Database Reset"
      />
    </div>
  );
}
