import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { DELIVERY_STATUS } from '../../utils/constants';

export function StatusCorrectionModal({ isOpen, onClose, delivery, onConfirmCorrection }) {
  const [correctedStatus, setCorrectedStatus] = useState(DELIVERY_STATUS.IN_TRANSIT);
  const [reason, setReason] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!delivery) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A formal justification is mandatory to revert a delivered consignment.');
      return;
    }

    setLoading(true);
    try {
      await onConfirmCorrection(delivery.id, correctedStatus, {
        isExplicitCorrection: true,
        correctionReason: `${reason} (Ref Ticket: ${ticketId || 'SUPV-OVERRIDE'})`
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supervisor Status Correction Protocol"
      subtitle={`Delivery #${delivery.trackingId} — Audit Compliance Exception`}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Abort
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={loading}
            disabled={!reason.trim()}
          >
            Authorize Status Rollback
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <p>
            <strong>Compliance Restriction:</strong> This shipment was marked <strong>DELIVERED</strong>. 
            Reverting to an earlier status violates normal delivery lifecycle unless an explicit exception is logged.
          </p>
        </div>

        {error && (
          <div className="p-2.5 text-xs text-rose-600 bg-rose-50 rounded-lg">
            {error}
          </div>
        )}

        <Select
          label="Corrected Stage Target"
          value={correctedStatus}
          onChange={(e) => setCorrectedStatus(e.target.value)}
          options={[
            { value: DELIVERY_STATUS.IN_TRANSIT, label: 'In Transit (Premature delivery mark)' },
            { value: DELIVERY_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery (Wrong address attempt)' },
            { value: DELIVERY_STATUS.FAILED, label: 'Failed (Customer rejected shipment)' },
            { value: DELIVERY_STATUS.PENDING, label: 'Pending (Package returned to warehouse)' }
          ]}
        />

        <Input
          label="Correction Incident / Ticket #"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="e.g. INC-90412 or SUPV-SARAH"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Mandatory Justification / Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Driver accidentally confirmed delivery for wrong pallet barcode at dock."
            className="w-full px-3 py-2 border rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </form>
    </Modal>
  );
}
