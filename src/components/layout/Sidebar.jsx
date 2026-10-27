import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import {
  LayoutDashboard,
  Truck,
  Users,
  Compass,
  MapPin,
  Kanban,
  PackageCheck,
  Wrench,
  Fuel,
  BarChart3,
  ShieldAlert,
  Sliders,
  Database,
  ExternalLink,
  X,
  FileText
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();

  // Navigation schema configured per user role
  const getNavSections = () => {
    if (role === ROLES.DRIVER) {
      return [
        {
          title: 'Driver Operations',
          items: [
            { to: '/driver', label: 'Driver Cockpit', icon: LayoutDashboard },
            { to: '/driver/trips', label: 'My Assigned Trips', icon: Compass },
            { to: '/driver/deliveries', label: 'Shipments & POD', icon: PackageCheck },
            { to: '/driver/profile', label: 'License & Performance', icon: Users }
          ]
        },
        {
          title: 'Fleet Visibility',
          items: [
            { to: '/tracking', label: 'Live GPS Route Map', icon: MapPin },
            { to: '/track-shipment', label: 'Public Consignment Lookup', icon: ExternalLink }
          ]
        }
      ];
    }

    if (role === ROLES.DISPATCHER) {
      return [
        {
          title: 'Dispatch & Operations',
          items: [
            { to: '/operations', label: 'Operations Dashboard', icon: LayoutDashboard },
            { to: '/operations/planning', label: 'Trip Planning & Assign', icon: Compass },
            { to: '/dispatch', label: 'Kanban Dispatch Board', icon: Kanban },
            { to: '/tracking', label: 'Live GPS Tracking Map', icon: MapPin },
            { to: '/deliveries', label: 'Delivery Lifecycle', icon: PackageCheck }
          ]
        },
        {
          title: 'Resource Monitoring',
          items: [
            { to: '/vehicles', label: 'Vehicle Availability', icon: Truck },
            { to: '/drivers', label: 'Driver Availability', icon: Users },
            { to: '/maintenance', label: 'Service Schedule', icon: Wrench }
          ]
        }
      ];
    }

    if (role === ROLES.ADMIN) {
      return [
        {
          title: 'Platform Administration',
          items: [
            { to: '/admin', label: 'Administration Console', icon: LayoutDashboard },
            { to: '/admin/users', label: 'User & Role Access', icon: Users },
            { to: '/admin/master-data', label: 'Master Data & Assets', icon: Database },
            { to: '/admin/settings', label: 'API & System Settings', icon: Sliders }
          ]
        },
        {
          title: 'Fleet Operations View',
          items: [
            { to: '/dashboard', label: 'Manager Dashboard', icon: LayoutDashboard },
            { to: '/vehicles', label: 'Vehicles', icon: Truck },
            { to: '/trips', label: 'Trips & Dispatch', icon: Compass },
            { to: '/tracking', label: 'Live Tracking', icon: MapPin },
            { to: '/analytics', label: 'Analytics & KPIs', icon: BarChart3 }
          ]
        }
      ];
    }

    // Default: Fleet Manager
    return [
      {
        title: 'Operations Overview',
        items: [
          { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { to: '/dispatch', label: 'Dispatch Kanban Board', icon: Kanban },
          { to: '/tracking', label: 'Live Fleet Tracking', icon: MapPin }
        ]
      },
      {
        title: 'Core Management',
        items: [
          { to: '/vehicles', label: 'Vehicles & Fleet', icon: Truck },
          { to: '/drivers', label: 'Drivers & Compliance', icon: Users },
          { to: '/trips', label: 'Trips & Routes', icon: Compass },
          { to: '/deliveries', label: 'Delivery Management', icon: PackageCheck },
          { to: '/maintenance', label: 'Maintenance & Repairs', icon: Wrench },
          { to: '/fuel', label: 'Fuel Logs & Costs', icon: Fuel }
        ]
      },
      {
        title: 'Intelligence & Audit',
        items: [
          { to: '/analytics', label: 'Operational Analytics', icon: BarChart3 },
          { to: '/track-shipment', label: 'Customer Tracking Portal', icon: ExternalLink }
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 bg-slate-950/60">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">
                FLEET<span className="text-brand-400">FLOW</span>
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                Logistics OS
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <p className="px-2.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white font-semibold shadow-sm shadow-brand-500/20'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Backend Readiness & Architecture Badge */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span>Architecture</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                Mock REST
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Spring Boot + JPA + MySQL API layer ready.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
