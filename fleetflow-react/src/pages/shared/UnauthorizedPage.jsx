import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function UnauthorizedPage() {
  const { role, switchRole } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 mb-6 shadow-inner">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 mb-1">
        403 — Access Restricted
      </span>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Restricted Role Authorization
      </h1>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        Your current session role (<strong>{role}</strong>) does not hold the permissions required to view this operations route. Use the Quick Role Switcher in the top bar to elevate permissions.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={Home} onClick={() => switchRole('manager')}>
          Switch to Fleet Manager
        </Button>
        <Link to="/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
