import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CheckCircle2, PenTool, Camera, User } from 'lucide-react';

export function ProofOfDeliveryModal({ isOpen, onClose, delivery, onConfirm }) {
  const [signeeName, setSigneeName] = useState('');
  const [notes, setNotes] = useState('Cartons verified, seals inspected and intact.');
  const [loading, setLoading] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!delivery) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signeeName.trim()) return;

    setLoading(true);
    try {
      await onConfirm(delivery.id, {
        signeeName,
        notes,
        signatureImage: hasSignature ? 'mock-base64-signature' : null
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Proof of Delivery (e-POD)"
      subtitle={`Consignment #${delivery.trackingId} — ${delivery.recipient}`}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit} loading={loading} disabled={!signeeName.trim()}>
            Record Delivery Fulfilled
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-xl space-y-1 text-brand-900 dark:text-brand-200">
          <p className="font-bold">Destination: {delivery.destination}</p>
          <p className="text-[11px] opacity-80">Items: {delivery.itemsDescription}</p>
        </div>

        <Input
          label="Recipient / Consignee Full Name"
          required
          icon={User}
          value={signeeName}
          onChange={(e) => setSigneeName(e.target.value)}
          placeholder="e.g. Arthur Pendelton"
        />

        {/* Mock Electronic Signature Pad */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Consignee Signature
          </label>
          <div
            onClick={() => setHasSignature(true)}
            className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors"
          >
            {hasSignature ? (
              <div className="text-center font-cursive text-xl text-brand-600 dark:text-brand-400 select-none">
                {signeeName || 'Authorized Signature'}
                <p className="text-[10px] text-emerald-600 font-sans font-medium mt-1">✓ Signature captured & timestamped</p>
              </div>
            ) : (
              <div className="text-slate-400 flex flex-col items-center gap-1">
                <PenTool className="w-5 h-5 text-slate-400" />
                <span className="text-[11px]">Click or tap here to simulate digital signature</span>
              </div>
            )}
          </div>
        </div>

        <Input
          label="Receiver Inspection Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Condition notes, dock bay, seal verification..."
        />
      </form>
    </Modal>
  );
}
