import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatNumber, formatDistance } from '../../utils/formatters';
import { Truck, Scale } from 'lucide-react';

export function VehicleComparisonModal({ isOpen, onClose, vehicles = [] }) {
  const [vehicleAId, setVehicleAId] = useState(vehicles[0]?.id || '');
  const [vehicleBId, setVehicleBId] = useState(vehicles[1]?.id || '');

  const vA = vehicles.find(v => v.id === vehicleAId) || vehicles[0];
  const vB = vehicles.find(v => v.id === vehicleBId) || vehicles[1];

  if (!vA || !vB) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fleet Asset Comparison Analysis"
      subtitle="Side-by-side technical specification, capacity, and operational status comparison"
      maxWidth="max-w-3xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Comparison
        </Button>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vehicle A</label>
            <select
              value={vehicleAId}
              onChange={e => setVehicleAId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNo} ({v.model})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Vehicle B</label>
            <select
              value={vehicleBId}
              onChange={e => setVehicleBId(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNo} ({v.model})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side Comparison Matrix */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          <div className="grid grid-cols-3 p-3 bg-slate-50 dark:bg-slate-850 font-bold text-slate-700 dark:text-slate-300">
            <span>Metric</span>
            <span className="text-brand-600">{vA.registrationNo}</span>
            <span className="text-brand-600">{vB.registrationNo}</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Model & Year</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{vA.model} ({vA.year || 2023})</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{vB.model} ({vB.year || 2023})</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Vehicle Type</span>
            <span>{vA.type}</span>
            <span>{vB.type}</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Status</span>
            <div><Badge variant={vA.status} size="sm" dot /></div>
            <div><Badge variant={vB.status} size="sm" dot /></div>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Payload Capacity</span>
            <span className="font-bold">{formatNumber(vA.capacity)} kg</span>
            <span className="font-bold">{formatNumber(vB.capacity)} kg</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Fuel / Powertrain</span>
            <span>{vA.fuelType} ({vA.currentFuelLevel || 80}%)</span>
            <span>{vB.fuelType} ({vB.currentFuelLevel || 80}%)</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Odometer Reading</span>
            <span>{formatDistance(vA.odometer)}</span>
            <span>{formatDistance(vB.odometer)}</span>
          </div>

          <div className="grid grid-cols-3 p-3 items-center">
            <span className="text-slate-400">Active Driver</span>
            <span>{vA.assignedDriverName || 'None'}</span>
            <span>{vB.assignedDriverName || 'None'}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
