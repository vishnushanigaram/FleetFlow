import React from 'react';
import { Badge } from '../common/Badge';
import { CheckCircle2, Clock, AlertTriangle, Truck, Package, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

export function DeliveryTimeline({ events = [], proofOfDelivery, delayReason }) {
  return (
    <div className="space-y-4">
      {delayReason && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Reported Delay Exception:</strong>
            <p className="mt-0.5">{delayReason}</p>
          </div>
        </div>
      )}

      {/* Chronological event milestones */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 text-xs">
        {events.map((evt, idx) => {
          const isLatest = idx === events.length - 1;
          return (
            <div key={idx} className="relative">
              <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ${
                isLatest
                  ? 'bg-brand-600 ring-brand-100 dark:ring-brand-950 animate-pulse'
                  : 'bg-slate-400 ring-white dark:ring-slate-900'
              }`} />
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {evt.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {evt.time}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                {evt.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Proof of delivery box if present */}
      {proofOfDelivery && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Proof of Delivery Recorded
          </div>
          <p>Signee: <strong>{proofOfDelivery.signeeName}</strong></p>
          <p className="text-[11px] opacity-80">Timestamp: {formatDateTime(proofOfDelivery.timestamp)}</p>
          {proofOfDelivery.notes && (
            <p className="italic text-[11px] mt-1">"{proofOfDelivery.notes}"</p>
          )}
        </div>
      )}
    </div>
  );
}
