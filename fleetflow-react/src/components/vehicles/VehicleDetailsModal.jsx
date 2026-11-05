import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { vehicleService } from '../../services/vehicleService';
import { formatNumber, formatDistance, formatCurrency } from '../../utils/formatters';
import { formatDate, isExpiringSoon, isPastDate, getDaysRemaining } from '../../utils/dateUtils';
import { 
  Truck, 
  FileText, 
  Wrench, 
  Fuel, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  ShieldAlert,
  Clock
} from 'lucide-react';

export function VehicleDetailsModal({ isOpen, onClose, vehicle, onAddDocument }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'documents' | 'history'
  const [history, setHistory] = useState({ trips: [], maintenance: [], fuel: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);

  // New document form state
  const [showDocForm, setShowDocForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: 'Commercial Insurance', number: '', expiryDate: '' });

  useEffect(() => {
    if (vehicle && isOpen) {
      setLoadingHistory(true);
      vehicleService.getVehicleFullHistory(vehicle.id)
        .then(res => setHistory(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingHistory(false));
    }
  }, [vehicle, isOpen]);

  if (!vehicle) return null;

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!newDoc.number || !newDoc.expiryDate) return;
    await onAddDocument(vehicle.id, newDoc);
    setShowDocForm(false);
    setNewDoc({ type: 'Commercial Insurance', number: '', expiryDate: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.registrationNo} — ${vehicle.model}`}
      subtitle={`${vehicle.type} • Manufactured ${vehicle.year || 2023}`}
      maxWidth="max-w-3xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close Vehicle Dossier
        </Button>
      }
    >
      {/* Tab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" /> Overview & Specs
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'documents'
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Compliance & Documents ({vehicle.documents?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'history'
              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Service & Trip History
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5 text-xs">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400">Current Operational Status</span>
              <div className="mt-1">
                <Badge variant={vehicle.status} size="lg" dot />
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Assigned Driver</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {vehicle.assignedDriverName || 'No Driver Assigned'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400">Odometer</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {formatDistance(vehicle.odometer)}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400">Max Payload</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {formatNumber(vehicle.capacity)} kg
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400">Fuel Type</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {vehicle.fuelType}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-slate-400">Tank / Battery</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {vehicle.currentFuelLevel || 80}% Full
              </p>
            </div>
          </div>

          {vehicle.currentTripId && (
            <div className="p-3.5 bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900 rounded-xl">
              <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                Active Transit Mission
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Currently linked to Trip <strong className="font-semibold text-brand-600">{vehicle.currentTripId}</strong>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Documents with Expiry Alerts */}
      {activeTab === 'documents' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-slate-500">
              Regulatory documents, road permits, fitness and commercial insurances.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setShowDocForm(!showDocForm)}
            >
              Add Document
            </Button>
          </div>

          {showDocForm && (
            <form onSubmit={handleDocSubmit} className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">Attach Compliance Document</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Doc Type (e.g. Pollution PUC)"
                  value={newDoc.type}
                  onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                  required
                />
                <input
                  type="text"
                  placeholder="Certificate / Policy Number"
                  value={newDoc.number}
                  onChange={e => setNewDoc({ ...newDoc, number: e.target.value })}
                  className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                  required
                />
                <input
                  type="date"
                  value={newDoc.expiryDate}
                  onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                  className="px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 text-xs"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowDocForm(false)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit">Save Document</Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {(!vehicle.documents || vehicle.documents.length === 0) ? (
              <p className="text-center py-6 text-slate-400">No documents on file for this vehicle.</p>
            ) : (
              vehicle.documents.map((doc) => {
                const expired = isPastDate(doc.expiryDate);
                const expiringSoon = isExpiringSoon(doc.expiryDate);
                const daysLeft = getDaysRemaining(doc.expiryDate);

                return (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      expired
                        ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'
                        : expiringSoon
                        ? 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        expired ? 'bg-rose-100 text-rose-600 dark:bg-rose-900' :
                        expiringSoon ? 'bg-amber-100 text-amber-600 dark:bg-amber-900' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white">{doc.type}</span>
                        <p className="text-slate-400 text-[11px]">Certificate #{doc.number}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        Expires {formatDate(doc.expiryDate)}
                      </div>
                      {expired && (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center justify-end gap-1 mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> EXPIRED
                        </span>
                      )}
                      {!expired && expiringSoon && (
                        <span className="text-[10px] font-bold text-amber-600 flex items-center justify-end gap-1 mt-0.5">
                          <AlertTriangle className="w-3 h-3" /> Expiring in {daysLeft} days
                        </span>
                      )}
                      {!expired && !expiringSoon && (
                        <span className="text-[10px] font-medium text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Compliant ({daysLeft} days)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Service & Trip History */}
      {activeTab === 'history' && (
        <div className="space-y-4 text-xs">
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-500" /> Maintenance Records
            </h5>
            {history.maintenance.length === 0 ? (
              <p className="text-slate-400 italic">No maintenance tickets logged.</p>
            ) : (
              <div className="space-y-1.5">
                {history.maintenance.map(m => (
                  <div key={m.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between">
                    <div>
                      <span className="font-bold">{m.serviceType}</span>
                      <p className="text-slate-400 text-[11px]">{m.notes} ({m.serviceProvider})</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={m.status} size="sm" />
                      <p className="text-[11px] text-slate-500 mt-1">{formatDate(m.scheduledDate)} • {formatCurrency(m.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-emerald-500" /> Recent Refuel Transactions
            </h5>
            {history.fuel.length === 0 ? (
              <p className="text-slate-400 italic">No fuel logs recorded.</p>
            ) : (
              <div className="space-y-1.5">
                {history.fuel.map(f => (
                  <div key={f.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between">
                    <div>
                      <span className="font-bold">{f.quantity} Liters at {f.station}</span>
                      <p className="text-slate-400 text-[11px]">Logged by {f.driverName}</p>
                    </div>
                    <div className="text-right font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(f.cost)}
                      <p className="text-[11px] text-slate-400">{formatDate(f.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
