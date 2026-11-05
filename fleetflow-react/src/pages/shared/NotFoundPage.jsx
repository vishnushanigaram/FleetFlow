import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6 shadow-inner">
        <Compass className="w-10 h-10 animate-spin text-brand-500" style={{ animationDuration: '8s' }} />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
        404 — Route Not Found
      </span>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Waybill or Route Coordinate Lost
      </h1>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        The destination URL you navigated to does not exist or has been relocated in the FleetFlow network map.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="secondary" icon={Home}>
            Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
