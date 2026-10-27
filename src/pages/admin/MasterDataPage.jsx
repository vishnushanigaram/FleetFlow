import React from 'react';
import { VEHICLE_TYPES, FUEL_TYPES, SERVICE_TYPES } from '../../utils/constants';
import { Database, MapPin, Truck, Fuel, Wrench } from 'lucide-react';

export function MasterDataPage() {
  const distributionHubs = [
    { code: 'HUB-CHI', name: 'Chicago Central Fulfillment Hub', state: 'IL', docks: 24, capacity: 'Heavy Freight' },
    { code: 'HUB-DET', name: 'Detroit Regional Distribution Center', state: 'MI', docks: 18, capacity: 'Automotive' },
    { code: 'HUB-SEA', name: 'Seattle Metro Hub', state: 'WA', docks: 14, capacity: 'Express & Cold' },
    { code: 'HUB-PDX', name: 'Portland Express Logistics Center', state: 'OR', docks: 12, capacity: 'General' },
    { code: 'HUB-DFW', name: 'Dallas Cold Storage Terminal', state: 'TX', docks: 30, capacity: 'Cold Chain' },
    { code: 'HUB-ATL', name: 'Atlanta Distribution Annex', state: 'GA', docks: 22, capacity: 'Parcel & EV' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Logistics Master Data & Network Hubs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Standardized hubs, terminals, asset categories, and service types.
        </p>
      </div>

      {/* Network Hubs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registered Distribution Hubs & Dock Facilities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {distributionHubs.map(h => (
            <div key={h.code} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-brand-600">{h.code}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">{h.state}</span>
              </div>
              <p className="font-bold text-slate-800 dark:text-slate-200">{h.name}</p>
              <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                <span>{h.docks} Dock Bays</span>
                <span>Type: {h.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Truck className="w-4 h-4 text-brand-600" /> Vehicle Categories
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {VEHICLE_TYPES.map(vt => (
              <li key={vt} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
                {vt}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Fuel className="w-4 h-4 text-emerald-600" /> Fuel & Powertrain Types
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {FUEL_TYPES.map(ft => (
              <li key={ft} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
                {ft}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Wrench className="w-4 h-4 text-amber-600" /> Approved Service Schedules
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {SERVICE_TYPES.map(st => (
              <li key={st} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
                {st}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
