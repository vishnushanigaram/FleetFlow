package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_documents")
public class VehicleDocument {
    @Id
    private String id;
    private String type;
    private String number;
    private String expiryDate;

    public VehicleDocument() {}

    public VehicleDocument(String id, String type, String number, String expiryDate) {
        this.id = id;
        this.type = type;
        this.number = number;
        this.expiryDate = expiryDate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
}

