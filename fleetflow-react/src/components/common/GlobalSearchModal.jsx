import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Truck, Users, Compass, Package, ArrowRight, X } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { tripService } from '../../services/tripService';
import { deliveryService } from '../../services/deliveryService';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ vehicles: [], drivers: [], trips: [], deliveries: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ vehicles: [], drivers: [], trips: [], deliveries: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const [v, d, t, del] = await Promise.all([
          vehicleService.getAll({ search: query }),
          driverService.getAll({ search: query }),
          tripService.getAll({ search: query }),
          deliveryService.getAll({ search: query })
        ]);
        setResults({
          vehicles: v.slice(0, 3),
          drivers: d.slice(0, 3),
          trips: t.slice(0, 3),
          deliveries: del.slice(0, 3)
        });
      } catch (err) {
        console.error('Quick search error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const totalResults = results.vehicles.length + results.drivers.length + results.trips.length + results.deliveries.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10">
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type registration, driver name, trip ID, or tracking number..."
            className="w-full px-3 py-4 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {query.trim().length >= 2 && totalResults === 0 && (
            <p className="text-center py-8 text-xs text-slate-400">
              No matching logistics assets or consignments found for "{query}".
            </p>
          )}

          {query.trim().length < 2 && (
            <div className="text-center py-6 text-xs text-slate-400">
              Search across Vehicles, Drivers, Active Trips, and Shipments.
            </div>
          )}

          {/* Vehicles */}
          {results.vehicles.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-500" /> Vehicles
              </p>
              <div className="space-y-1">
                {results.vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleSelect(`/vehicles`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{v.registrationNo}</span>
                      <span className="text-slate-400 ml-2">({v.model} • {v.type})</span>
                    </div>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      {v.status} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drivers */}
          {results.drivers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" /> Drivers
              </p>
              <div className="space-y-1">
                {results.drivers.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect(`/drivers`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{d.name}</span>
                      <span className="text-slate-400 ml-2">Lic: {d.licenseNumber}</span>
                    </div>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      {d.status} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trips */}
          {results.trips.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-500" /> Trips & Routes
              </p>
              <div className="space-y-1">
                {results.trips.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect(`/trips`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{t.id}</span>
                      <span className="text-slate-400 ml-2">{t.origin} → {t.destination}</span>
                    </div>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      {t.status} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliveries */}
          {results.deliveries.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-500" /> Deliveries & Waybills
              </p>
              <div className="space-y-1">
                {results.deliveries.map((del) => (
                  <div
                    key={del.id}
                    onClick={() => handleSelect(`/deliveries`)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{del.trackingId}</span>
                      <span className="text-slate-400 ml-2">{del.recipient} ({del.destination})</span>
                    </div>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 flex items-center gap-1">
                      {del.status} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
