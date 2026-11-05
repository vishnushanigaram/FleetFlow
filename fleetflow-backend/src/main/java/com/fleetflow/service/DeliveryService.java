package com.fleetflow.service;

import com.fleetflow.model.Delivery;
import com.fleetflow.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public List<Delivery> getAll(String search, String status, String priority, String tripId) {
        return deliveryRepository.findAll().stream()
                .filter(d -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String q = search.trim().toLowerCase();
                        boolean match = d.getTrackingId().toLowerCase().contains(q) ||
                                d.getRecipient().toLowerCase().contains(q) ||
                                d.getDestination().toLowerCase().contains(q) ||
                                (d.getItemsDescription() != null && d.getItemsDescription().toLowerCase().contains(q));
                        if (!match) return false;
                    }
                    if (status != null && !status.equalsIgnoreCase("ALL")) {
                        if (!d.getStatus().equalsIgnoreCase(status)) return false;
                    }
                    if (priority != null && !priority.equalsIgnoreCase("ALL")) {
                        if (!d.getPriority().equalsIgnoreCase(priority)) return false;
                    }
                    if (tripId != null && !tripId.equalsIgnoreCase("ALL")) {
                        if (d.getTripId() == null || !d.getTripId().equalsIgnoreCase(tripId)) return false;
                    }
                    return true;
                })
                .toList();
    }

    public Delivery getById(String id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery with ID " + id + " not found."));
    }

    public Delivery getByTrackingId(String trackingId) {
        return deliveryRepository.findByTrackingIdIgnoreCase(trackingId.trim())
                .orElseThrow(() -> new IllegalArgumentException("Tracking ID \"" + trackingId + "\" not found."));
    }

    public Delivery create(Delivery delivery) {
        if (delivery.getId() == null) {
            delivery.setId("DEL-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        if (delivery.getTrackingId() == null) {
            delivery.setTrackingId("FL-TRK-" + (1000 + new Random().nextInt(9000)));
        }
        if (delivery.getStatus() == null) {
            delivery.setStatus("Pending");
        }
        if (delivery.getPriority() == null) {
            delivery.setPriority("Normal");
        }
        return deliveryRepository.save(delivery);
    }

    public Delivery updateStatus(String id, String newStatus, String reason, boolean isExplicitCorrection) {
        Delivery delivery = getById(id);

        // Section 23 Business Rule: Delivered shipments should not be returned to earlier stages without explicit correction flow!
        if ("Delivered".equalsIgnoreCase(delivery.getStatus()) && !"Delivered".equalsIgnoreCase(newStatus)) {
            if (!isExplicitCorrection) {
                throw new IllegalStateException("Compliance Rule Violation: This delivery is already recorded as DELIVERED with signed proof. Reverting requires explicit supervisor authorization.");
            }
        }

        delivery.setStatus(newStatus);
        if ("Delayed".equalsIgnoreCase(newStatus)) {
            delivery.setDelayReason(reason != null ? reason : "Unforeseen logistics delay reported.");
        }

        return deliveryRepository.save(delivery);
    }

    public Delivery confirmPOD(String id, String signeeName, String notes) {
        Delivery delivery = getById(id);
        delivery.setStatus("Delivered");
        delivery.setSigneeName(signeeName);
        delivery.setPodTimestamp(Instant.now().toString());
        delivery.setPodNotes(notes);
        return deliveryRepository.save(delivery);
    }
}

