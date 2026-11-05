import React, { useState, useEffect } from 'react';
import { deliveryService } from '../../services/deliveryService';
import { DeliveryTable } from '../../components/deliveries/DeliveryTable';
import { ProofOfDeliveryModal } from '../../components/deliveries/ProofOfDeliveryModal';
import { Modal } from '../../components/common/Modal';
import { DeliveryTimeline } from '../../components/deliveries/DeliveryTimeline';
import { Button } from '../../components/common/Button';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Package } from 'lucide-react';

export function DriverDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [podOpen, setPodOpen] = useState(false);
  const [podDelivery, setPodDelivery] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [timelineDelivery, setTimelineDelivery] = useState(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getAll();
      setDeliveries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleConfirmPOD = async (deliveryId, proofData) => {
    await deliveryService.confirmProofOfDelivery(deliveryId, proofData);
    fetchDeliveries();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Shipments & Proof of Delivery (e-POD)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Record digital recipient sign-offs and fulfill consignment manifests at dock.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No consignments found"
          description="You currently have no active or completed shipments."
        />
      ) : (
        <DeliveryTable
          deliveries={deliveries}
          onView={(del) => { setTimelineDelivery(del); setTimelineOpen(true); }}
          onRecordPOD={(del) => { setPodDelivery(del); setPodOpen(true); }}
          onCorrectStatus={() => {}}
          onSort={() => {}}
          sortBy="eta"
          sortOrder="asc"
        />
      )}

      <ProofOfDeliveryModal
        isOpen={podOpen}
        onClose={() => setPodOpen(false)}
        delivery={podDelivery}
        onConfirm={handleConfirmPOD}
      />

      <Modal
        isOpen={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        title={`Delivery Details: ${timelineDelivery?.trackingId}`}
        subtitle={`Consignee: ${timelineDelivery?.recipient}`}
        maxWidth="max-w-xl"
        footer={<Button variant="secondary" onClick={() => setTimelineOpen(false)}>Close</Button>}
      >
        {timelineDelivery && (
          <DeliveryTimeline
            events={timelineDelivery.events}
            proofOfDelivery={timelineDelivery.proofOfDelivery}
            delayReason={timelineDelivery.delayReason}
          />
        )}
      </Modal>
    </div>
  );
}
