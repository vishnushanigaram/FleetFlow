import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { useNotifications } from '../../context/NotificationContext';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { activeToast, clearToast } = useNotifications();
  const location = useLocation();

  const getToastIcon = (sev) => {
    switch (sev) {
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Real-time Toast Banner Alert */}
        {activeToast && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 animate-in slide-in-from-bottom-4 duration-200 flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(activeToast.severity)}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                {activeToast.title}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {activeToast.message}
              </p>
            </div>
            <button
              onClick={clearToast}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
