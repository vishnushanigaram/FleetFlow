import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import { ROLES } from '../../utils/constants';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  UserCheck, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  Truck,
  Layers,
  Search
} from 'lucide-react';

export function Header({ onToggleSidebar, onOpenSearch }) {
  const { user, role, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels = {
    [ROLES.MANAGER]: 'Fleet Manager',
    [ROLES.DISPATCHER]: 'Operations Dispatcher',
    [ROLES.DRIVER]: 'Driver Console',
    [ROLES.ADMIN]: 'Platform Admin'
  };

  const roleIcons = {
    [ROLES.MANAGER]: Layers,
    [ROLES.DISPATCHER]: Truck,
    [ROLES.DRIVER]: UserCheck,
    [ROLES.ADMIN]: ShieldCheck
  };

  const CurrentRoleIcon = roleIcons[role] || Layers;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Hint */}
        <div 
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick find (Vehicles, Drivers, Trips)...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-xs">
            Ctrl+K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Instant Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors"
            title="Switch Demo Role"
          >
            <CurrentRoleIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="hidden md:inline">{roleLabels[role] || 'Select Role'}</span>
            <span className="inline md:hidden capitalize">{role}</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </button>

          {showRoleMenu && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in"
              onMouseLeave={() => setShowRoleMenu(false)}
            >
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Demo Perspective
              </div>
              {[
                { r: ROLES.MANAGER, label: 'Fleet Manager', desc: 'Vehicles, Fuel, Analytics' },
                { r: ROLES.DISPATCHER, label: 'Operations Dispatcher', desc: 'Trip Planning, Live Board' },
                { r: ROLES.DRIVER, label: 'Commercial Driver', desc: 'Assigned Trips, Proof POD' },
                { r: ROLES.ADMIN, label: 'Platform Admin', desc: 'Users, Master Data, Audit' }
              ].map((item) => (
                <button
                  key={item.r}
                  onClick={() => {
                    switchRole(item.r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${
                    role === item.r
                      ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/60 dark:text-brand-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {role === item.r && <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            title="Notifications and operational alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Rohit Sharma'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              {user?.title || 'Fleet Director'}
            </p>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
