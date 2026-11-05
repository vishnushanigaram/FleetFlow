package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "trip_status_histories")
public class TripStatusHistory {
    @Id
    private String id;
    private String status;
    private String timestamp;
    private String note;
    private String updatedBy;

    public TripStatusHistory() {}

    public TripStatusHistory(String id, String status, String timestamp, String note, String updatedBy) {
        this.id = id;
        this.status = status;
        this.timestamp = timestamp;
        this.note = note;
        this.updatedBy = updatedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}

