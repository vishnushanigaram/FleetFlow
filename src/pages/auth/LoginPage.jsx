import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, DEMO_ACCOUNTS } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Truck, Lock, Mail, Sparkles, Layers, Compass, UserCheck, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('manager@fleetflow.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.user.role === ROLES.DRIVER) {
        navigate('/driver');
      } else if (res.user.role === ROLES.DISPATCHER) {
        navigate('/operations');
      } else if (res.user.role === ROLES.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoQuickAccess = async (role) => {
    await switchRole(role);
    if (role === ROLES.DRIVER) navigate('/driver');
    else if (role === ROLES.DISPATCHER) navigate('/operations');
    else if (role === ROLES.ADMIN) navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            FLEET<span className="text-brand-500">FLOW</span>
          </span>
        </Link>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Sign In to Logistics Operations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access vehicle telemetry, dispatch boards & operations suites.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Quick 1-Click Demo Logins */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Instant Demo Access
              </span>
              <span className="text-[10px] text-slate-400">Click to switch</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoQuickAccess(ROLES.MANAGER)}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-left text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4 text-brand-600" /> Fleet Manager
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickAccess(ROLES.DISPATCHER)}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-left text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4 text-purple-600" /> Dispatcher
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickAccess(ROLES.DRIVER)}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Truck className="w-4 h-4 text-emerald-600" /> Driver
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickAccess(ROLES.ADMIN)}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-left text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" /> Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              required
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager@fleetflow.io"
            />

            <Input
              label="Account Password"
              type="password"
              required
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-brand-600" />
                <span>Remember session</span>
              </label>
              <Link to="/auth/forgot-password" className="text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full py-2.5"
            >
              Sign In to FleetFlow
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            Need an operational driver profile?{' '}
            <Link to="/auth/register" className="font-semibold text-brand-600 hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
