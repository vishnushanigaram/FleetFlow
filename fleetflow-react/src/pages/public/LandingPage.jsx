import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, DEMO_ACCOUNTS } from '../../utils/constants';
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Package, 
  Zap, 
  Compass, 
  Sun, 
  Moon,
  Sparkles,
  Layers,
  Fuel,
  Users
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export function LandingPage() {
  const { switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleQuickDemo = async (role, destination = '/dashboard') => {
    await switchRole(role);
    navigate(destination);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              FLEET<span className="text-brand-500">FLOW</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Enterprise Logistics Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/track-shipment"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <Search className="w-3.5 h-3.5" /> Track Consignment
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link to="/auth/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleQuickDemo(ROLES.MANAGER, '/dashboard')}
          >
            Launch Demo Console
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FleetFlow 2.0 • Move Smart. Deliver More.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl leading-[1.15]">
          Smart Fleet Management, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
            All in One High-Performance Platform
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Streamline transport companies, freight coordinators, and enterprise delivery businesses. 
          Manage vehicles, drivers, trips, maintenance schedules, and proof-of-delivery in real-time.
        </p>

        {/* Demo Role Switcher Showcase */}
        <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl w-full">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Instant 1-Click Interactive Demo Perspectives
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleQuickDemo(ROLES.MANAGER, '/dashboard')}
              className="p-3 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold transition-all flex flex-col items-center gap-1.5"
            >
              <Layers className="w-5 h-5 text-brand-600" />
              <span>Fleet Manager</span>
            </button>

            <button
              onClick={() => handleQuickDemo(ROLES.DISPATCHER, '/operations')}
              className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all flex flex-col items-center gap-1.5"
            >
              <Compass className="w-5 h-5 text-purple-600" />
              <span>Operations Dispatch</span>
            </button>

            <button
              onClick={() => handleQuickDemo(ROLES.DRIVER, '/driver')}
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex flex-col items-center gap-1.5"
            >
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Driver Console</span>
            </button>

            <button
              onClick={() => handleQuickDemo(ROLES.ADMIN, '/admin')}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex flex-col items-center gap-1.5"
            >
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span>Platform Admin</span>
            </button>
          </div>
        </div>

        {/* Public Waybill Tracking Search Box */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="landingTrackingInput"
              placeholder="Track Consignment (e.g. FL-TRK-8921)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/track-shipment?id=${e.target.value.trim()}`);
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              const input = document.getElementById('landingTrackingInput');
              const val = input?.value?.trim() || 'FL-TRK-8921';
              navigate(`/track-shipment?id=${val}`);
            }}
          >
            Track Shipment
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl w-full">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Route & Fleet Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time interactive GPS highway simulation with waypoint progress, vehicle marker animation, and speed metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kanban Dispatch & Validation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag-and-drop dispatch board. Built-in business rules prevent assigning unavailable, in-maintenance vehicles or busy drivers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Operational Analytics & e-POD
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dynamically calculated fleet utilization, on-time delivery ratios, fuel consumption curves, and signed digital proof-of-delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 bg-white/50 dark:bg-slate-900/50">
        <p>FLEETFLOW — Move smarter. Deliver more. Developed with React & Spring Boot ready service layer.</p>
      </footer>
    </div>
  );
}
