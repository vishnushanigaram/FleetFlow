import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { deliveryService } from '../../services/deliveryService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { DeliveryTimeline } from '../../components/deliveries/DeliveryTimeline';
import { formatDateTime } from '../../utils/dateUtils';
import { Search, Package, ArrowLeft, Truck, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function PublicTrackingPage() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || 'FL-TRK-8921');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDelivery = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await deliveryService.getByTrackingId(idToSearch);
      setDelivery(res);
    } catch (err) {
      setError(err.message || 'Tracking ID not found.');
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setTrackingId(queryId);
      fetchDelivery(queryId);
    } else {
      fetchDelivery('FL-TRK-8921');
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDelivery(trackingId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Public Customer Tracking Portal
          </div>
        </div>

        {/* Search Consignment Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Track Consignment Status
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Enter your FleetFlow bill-of-lading or waybill tracking number (e.g. <button onClick={() => { setTrackingId('FL-TRK-8921'); fetchDelivery('FL-TRK-8921'); }} className="text-brand-600 underline font-mono">FL-TRK-8921</button> or <button onClick={() => { setTrackingId('FL-TRK-5100'); fetchDelivery('FL-TRK-5100'); }} className="text-brand-600 underline font-mono">FL-TRK-5100</button>).
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Enter tracking number (e.g. FL-TRK-8921)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <Button variant="primary" type="submit" loading={loading}>
              Track Shipment
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Consignment Tracking Results */}
        {delivery && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 animate-in fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Consignment Tracking Number
                </span>
                <h3 className="text-xl font-black font-mono text-brand-600 dark:text-brand-400">
                  {delivery.trackingId}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={delivery.priority} size="sm" />
                <Badge variant={delivery.status} size="lg" dot />
              </div>
            </div>

            {/* Consignment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Consignee Recipient</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{delivery.recipient}</p>
                <p className="text-slate-500 text-[11px]">{delivery.recipientContact}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Estimated Arrival (ETA)</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{formatDateTime(delivery.eta)}</p>
                <p className="text-slate-500 text-[11px]">Route: {delivery.origin} → {delivery.destination}</p>
              </div>
            </div>

            {/* Cargo specifics */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">Commodity / Manifest Description:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{delivery.itemsDescription}</p>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Tracking Milestones & History
              </h4>
              <DeliveryTimeline
                events={delivery.events}
                proofOfDelivery={delivery.proofOfDelivery}
                delayReason={delivery.delayReason}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
