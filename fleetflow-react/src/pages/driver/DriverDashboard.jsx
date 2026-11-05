import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { deliveryService } from '../../services/deliveryService';
import { driverService } from '../../services/driverService';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ProofOfDeliveryModal } from '../../components/deliveries/ProofOfDeliveryModal';
import { formatDateTime, formatDate, isExpiringSoon } from '../../utils/dateUtils';
import { formatDistance } from '../../utils/formatters';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Package,
  Award,
  Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DriverDashboard() {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [podOpen, setPodOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const driverId = user?.driverId || 'DRV-1001';

  const loadDriverData = async () => {
    setLoading(true);
    try {
      const [trips, deliveries, profile] = await Promise.all([
        tripService.getAll({ driverId }),
        deliveryService.getAll(),
        driverService.getById(driverId).catch(() => null)
      ]);

      const active = trips.find(t => t.status === 'In Transit' || t.status === 'Delayed' || t.status === 'Assigned');
      setActiveTrip(active || trips[0]);

      if (active) {
        const del = deliveries.find(d => d.tripId === active.id && d.status !== 'Delivered');
        setActiveDelivery(del || deliveries[0]);
      } else {
        setActiveDelivery(deliveries[0]);
      }

      setDriverProfile(profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverData();
  }, [driverId]);

  const handleConfirmPOD = async (deliveryId, proofData) => {
    await deliveryService.confirmProofOfDelivery(deliveryId, proofData);
    loadDriverData();
  };

  const handleCompleteTrip = async () => {
    if (!activeTrip) return;
    await tripService.updateStatus(activeTrip.id, 'Completed', 'Driver reported successful arrival and unloading', user?.name || 'Driver');
    loadDriverData();
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400 animate-pulse">Loading driver mission cockpit...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Driver Operational Cockpit
            </h1>
            <Badge variant="Available" size="sm" dot>Duty Active</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome, <strong>{user?.name || 'Ajay Kumar'}</strong> • CDL Verified
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/driver/profile')}
          >
            My License & Score
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/tracking')}
          >
            Live GPS Route
          </Button>
        </div>
      </div>

      {/* Active Mission Banner */}
      {activeTrip ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-brand-500/40 p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Current Assigned Mission ({activeTrip.id})
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {activeTrip.origin} → {activeTrip.destination}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={activeTrip.status} size="lg" dot />
            </div>
          </div>

          {/* Telemetry and Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-400">Assigned Vehicle</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{activeTrip.vehicleReg}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-400">Cruising Speed</span>
              <p className="font-bold text-brand-600 mt-1">{activeTrip.currentSpeed || 62} km/h</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-400">Estimated Arrival (ETA)</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{formatDateTime(activeTrip.estimatedArrival)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-400">Total Distance</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{formatDistance(activeTrip.distanceKm)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Route Progress</span>
              <span className="font-bold text-brand-600">{activeTrip.progressPercent || 68}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${activeTrip.progressPercent || 68}%` }}
              />
            </div>
          </div>

          {/* Driver Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Cargo: <strong>{activeTrip.cargoLoad}</strong>
            </div>

            <div className="flex items-center gap-2">
              {activeDelivery && activeDelivery.status !== 'Delivered' && (
                <Button
                  variant="success"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={() => setPodOpen(true)}
                >
                  Capture Consignee Signature (POD)
                </Button>
              )}

              {activeTrip.status !== 'Completed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCompleteTrip}
                >
                  Confirm Mission Fulfillment
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Truck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active Missions In Flight</h4>
          <p className="text-xs text-slate-500 mt-1">You are currently in the Available Driver Pool ready for dispatch.</p>
        </div>
      )}

      {/* Driver Stats summary */}
      {driverProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Missions Completed</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{driverProfile.completedTrips}</p>
            </div>
            <Award className="w-7 h-7 text-brand-600" />
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Safety Index Rating</span>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{driverProfile.safetyScore}%</p>
            </div>
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Customer Review Score</span>
              <p className="text-xl font-black text-amber-500 mt-0.5">{driverProfile.rating} / 5.0</p>
            </div>
            <Star className="w-7 h-7 text-amber-500 fill-current" />
          </div>
        </div>
      )}

      {/* Proof of delivery modal */}
      <ProofOfDeliveryModal
        isOpen={podOpen}
        onClose={() => setPodOpen(false)}
        delivery={activeDelivery}
        onConfirm={handleConfirmPOD}
      />
    </div>
  );
}
