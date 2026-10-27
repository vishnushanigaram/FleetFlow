import { mockStorage, STORAGE_KEYS } from './api/mockStorage';
import { DELIVERY_STATUS, DELIVERY_PRIORITY } from '../utils/constants';

export const deliveryService = {
  async getAll({ search = '', status = '', priority = '', tripId = '', sortBy = 'eta', sortOrder = 'asc' } = {}) {
    await mockStorage.delay(200);
    let list = mockStorage.get(STORAGE_KEYS.DELIVERIES);

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(d =>
        d.trackingId.toLowerCase().includes(q) ||
        d.recipient.toLowerCase().includes(q) ||
        d.destination.toLowerCase().includes(q) ||
        (d.itemsDescription && d.itemsDescription.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'ALL') {
      list = list.filter(d => d.status === status);
    }

    if (priority && priority !== 'ALL') {
      list = list.filter(d => d.priority === priority);
    }

    if (tripId && tripId !== 'ALL') {
      list = list.filter(d => d.tripId === tripId);
    }

    list.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return list;
  },

  async getById(id) {
    await mockStorage.delay(180);
    const list = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const item = list.find(d => d.id === id);
    if (!item) throw new Error(`Delivery ${id} not found.`);
    return item;
  },

  async getByTrackingId(trackingId) {
    await mockStorage.delay(250);
    const list = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const clean = trackingId.trim().toUpperCase();
    const item = list.find(d => d.trackingId.toUpperCase() === clean);
    if (!item) {
      throw new Error(`Tracking Number "${clean}" not found. Please verify the consignment number.`);
    }
    return item;
  },

  async create(data) {
    await mockStorage.delay(300);
    const list = mockStorage.get(STORAGE_KEYS.DELIVERIES);

    const trackingId = `FL-TRK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDelivery = {
      id: `DEL-${Date.now().toString().slice(-4)}`,
      trackingId,
      tripId: data.tripId || null,
      recipient: data.recipient.trim(),
      recipientContact: data.recipientContact || '',
      origin: data.origin.trim(),
      destination: data.destination.trim(),
      itemsDescription: data.itemsDescription || 'General Goods',
      weightKg: Number(data.weightKg || 500),
      priority: data.priority || DELIVERY_PRIORITY.NORMAL,
      status: data.status || DELIVERY_STATUS.PENDING,
      eta: data.eta || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      proofOfDelivery: null,
      delayReason: null,
      events: [
        {
          time: new Date().toISOString().replace('T', ' ').slice(0, 16),
          title: 'Manifest Created',
          desc: 'Delivery booking logged into FleetFlow system',
          status: DELIVERY_STATUS.PENDING
        }
      ]
    };

    list.unshift(newDelivery);
    mockStorage.set(STORAGE_KEYS.DELIVERIES, list);
    return newDelivery;
  },

  async updateStatus(id, newStatus, { note = '', delayReason = '', isExplicitCorrection = false, correctionReason = '' } = {}) {
    await mockStorage.delay(250);
    const list = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const delivery = list.find(d => d.id === id);
    if (!delivery) throw new Error(`Delivery ${id} not found.`);

    // Important business rule: Delivered shipment cannot be returned to earlier stages without an explicit simulated correction flow!
    if (delivery.status === DELIVERY_STATUS.DELIVERED && newStatus !== DELIVERY_STATUS.DELIVERED) {
      if (!isExplicitCorrection) {
        throw new Error(
          'Compliance Rule Violation: This delivery is already recorded as DELIVERED with signed proof. ' +
          'Reverting to an earlier status requires explicit supervisor authorization & correction protocol.'
        );
      }
    }

    const prevStatus = delivery.status;
    delivery.status = newStatus;

    if (newStatus === DELIVERY_STATUS.DELAYED) {
      delivery.delayReason = delayReason || note || 'Unforeseen logistics or transit delay.';
    }

    delivery.events = delivery.events || [];
    delivery.events.push({
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: isExplicitCorrection ? `Status Corrected to ${newStatus}` : `Status: ${newStatus}`,
      desc: isExplicitCorrection ? `Supervisor Correction: ${correctionReason}` : (note || `Delivery transitioned from ${prevStatus} to ${newStatus}`),
      status: newStatus
    });

    mockStorage.set(STORAGE_KEYS.DELIVERIES, list);
    return delivery;
  },

  async confirmProofOfDelivery(id, proofData) {
    await mockStorage.delay(300);
    const list = mockStorage.get(STORAGE_KEYS.DELIVERIES);
    const delivery = list.find(d => d.id === id);
    if (!delivery) throw new Error(`Delivery ${id} not found.`);

    delivery.status = DELIVERY_STATUS.DELIVERED;
    delivery.proofOfDelivery = {
      signeeName: proofData.signeeName || 'Consignee Receiver',
      timestamp: new Date().toISOString(),
      notes: proofData.notes || 'Package delivered intact. Seal inspected.',
      signatureImage: proofData.signatureImage || null
    };

    delivery.events = delivery.events || [];
    delivery.events.push({
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Delivered (Proof Captured)',
      desc: `Accepted & signed by ${delivery.proofOfDelivery.signeeName}.`,
      status: DELIVERY_STATUS.DELIVERED
    });

    mockStorage.set(STORAGE_KEYS.DELIVERIES, list);
    return delivery;
  }
};
