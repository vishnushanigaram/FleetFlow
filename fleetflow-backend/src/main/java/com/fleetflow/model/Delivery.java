package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "deliveries")
public class Delivery {
    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String trackingId;

    private String tripId;

    @Column(nullable = false)
    private String recipient;

    private String recipientContact;
    private String origin;
    private String destination;
    private String itemsDescription;
    private Double weightKg;
    private String priority; // Normal, High, Urgent
    private String status;   // Pending, Picked Up, In Transit, Out for Delivery, Delivered, Failed, Cancelled, Delayed
    private String eta;

    // Proof of delivery fields
    private String signeeName;
    private String podTimestamp;
    private String podNotes;

    // Delay reason
    private String delayReason;

    public Delivery() {}

    public Delivery(String id, String trackingId, String tripId, String recipient, String recipientContact, String origin, String destination, String itemsDescription, Double weightKg, String priority, String status, String eta) {
        this.id = id;
        this.trackingId = trackingId;
        this.tripId = tripId;
        this.recipient = recipient;
        this.recipientContact = recipientContact;
        this.origin = origin;
        this.destination = destination;
        this.itemsDescription = itemsDescription;
        this.weightKg = weightKg;
        this.priority = priority;
        this.status = status;
        this.eta = eta;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getRecipientContact() { return recipientContact; }
    public void setRecipientContact(String recipientContact) { this.recipientContact = recipientContact; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getItemsDescription() { return itemsDescription; }
    public void setItemsDescription(String itemsDescription) { this.itemsDescription = itemsDescription; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }

    public String getSigneeName() { return signeeName; }
    public void setSigneeName(String signeeName) { this.signeeName = signeeName; }

    public String getPodTimestamp() { return podTimestamp; }
    public void setPodTimestamp(String podTimestamp) { this.podTimestamp = podTimestamp; }

    public String getPodNotes() { return podNotes; }
    public void setPodNotes(String podNotes) { this.podNotes = podNotes; }

    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
}

