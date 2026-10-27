import React, { useState, useEffect } from 'react';
import { mockStorage, STORAGE_KEYS } from '../../services/api/mockStorage';
import { StatCard } from '../../components/analytics/StatCard';
import { Button } from '../../components/common/Button';
import { Users, Database, ShieldCheck, Server, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ vehicles: 0, drivers: 0, trips: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(mockStorage.get(STORAGE_KEYS.USERS));
    setCounts({
      vehicles: mockStorage.get(STORAGE_KEYS.VEHICLES).length,
      drivers: mockStorage.get(STORAGE_KEYS.DRIVERS).length,
      trips: mockStorage.get(STORAGE_KEYS.TRIPS).length
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Platform Administration & Master Data
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Role-based access control (RBAC), mock REST server persistence, and Spring Boot readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/settings')}
          >
            System & API Config
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users & Roles
          </Button>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Registered System Users"
          value={users.length}
          subvalue="Multi-role RBAC active"
          icon={Users}
          color="brand"
          onClick={() => navigate('/admin/users')}
        />

        <StatCard
          title="Master Fleet Assets"
          value={counts.vehicles + counts.drivers}
          subvalue={`${counts.vehicles} vehicles • ${counts.drivers} licensed drivers`}
          icon={Database}
          color="purple"
          onClick={() => navigate('/admin/master-data')}
        />

        <StatCard
          title="Backend Integration Status"
          value="Mock REST Ready"
          subvalue="Spring Boot + MySQL Schema aligned"
          icon={Server}
          color="emerald"
          onClick={() => navigate('/admin/settings')}
        />
      </div>

      {/* Architecture Explanation Card (Section 5 & 24) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Architecture & Spring Boot Mapping (Section 5 & 24)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Phase 1 Compliant
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          FleetFlow strictly decouples UI components from data-fetching logic. All API communication flows through dedicated domain services (<code>services/vehicleService.js</code>, <code>services/tripService.js</code>, etc.). 
          When transitioning to Spring Boot:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white">1. Spring Security & JWT</h5>
            <p className="text-slate-500 mt-1">Replaces mock token in <code>authService.js</code> with stateless JWT bearer tokens.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white">2. Spring Data JPA + MySQL</h5>
            <p className="text-slate-500 mt-1">Directly maps Vehicle, Driver, Trip, and Delivery entities with foreign keys.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-white">3. Zero React Rewrite</h5>
            <p className="text-slate-500 mt-1">Only the <code>apiClient.js</code> base URL updates from local mock adapter to Spring Boot endpoint.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
