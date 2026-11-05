package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "maintenance")
public class Maintenance {
    @Id
    private String id;

    @Column(nullable = false)
    private String vehicleId;

    private String vehicleReg;
    private String serviceType;
    private String status; // Scheduled, In Progress, Completed, Overdue
    private String scheduledDate;
    private String completedDate;
    private Double odometer;
    private Double cost;
    private String notes;
    private String serviceProvider;
    private String technicianName;

    public Maintenance() {}

    public Maintenance(String id, String vehicleId, String vehicleReg, String serviceType, String status, String scheduledDate, Double odometer, Double cost, String notes, String serviceProvider) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleReg = vehicleReg;
        this.serviceType = serviceType;
        this.status = status;
        this.scheduledDate = scheduledDate;
        this.odometer = odometer;
        this.cost = cost;
        this.notes = notes;
        this.serviceProvider = serviceProvider;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getCompletedDate() { return completedDate; }
    public void setCompletedDate(String completedDate) { this.completedDate = completedDate; }

    public Double getOdometer() { return odometer; }
    public void setOdometer(Double odometer) { this.odometer = odometer; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getServiceProvider() { return serviceProvider; }
    public void setServiceProvider(String serviceProvider) { this.serviceProvider = serviceProvider; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }
}

