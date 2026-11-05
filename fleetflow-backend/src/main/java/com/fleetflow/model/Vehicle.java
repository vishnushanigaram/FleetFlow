package com.fleetflow.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String registrationNo;

    private String type;
    private String model;
    private Double capacity;
    private String fuelType;
    private String status; // Available, Assigned, On Trip, Maintenance, Inactive
    private Double odometer;
    private Integer year;
    private Double fuelCapacity;
    private Integer currentFuelLevel;
    private String assignedDriverId;
    private String assignedDriverName;
    private String currentTripId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id")
    private List<VehicleDocument> documents = new ArrayList<>();

    public Vehicle() {}

    public Vehicle(String id, String registrationNo, String type, String model, Double capacity, String fuelType, String status, Double odometer, Integer year, Double fuelCapacity, Integer currentFuelLevel) {
        this.id = id;
        this.registrationNo = registrationNo;
        this.type = type;
        this.model = model;
        this.capacity = capacity;
        this.fuelType = fuelType;
        this.status = status;
        this.odometer = odometer;
        this.year = year;
        this.fuelCapacity = fuelCapacity;
        this.currentFuelLevel = currentFuelLevel;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Double getCapacity() { return capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getOdometer() { return odometer; }
    public void setOdometer(Double odometer) { this.odometer = odometer; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getFuelCapacity() { return fuelCapacity; }
    public void setFuelCapacity(Double fuelCapacity) { this.fuelCapacity = fuelCapacity; }

    public Integer getCurrentFuelLevel() { return currentFuelLevel; }
    public void setCurrentFuelLevel(Integer currentFuelLevel) { this.currentFuelLevel = currentFuelLevel; }

    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }

    public String getAssignedDriverName() { return assignedDriverName; }
    public void setAssignedDriverName(String assignedDriverName) { this.assignedDriverName = assignedDriverName; }

    public String getCurrentTripId() { return currentTripId; }
    public void setCurrentTripId(String currentTripId) { this.currentTripId = currentTripId; }

    public List<VehicleDocument> getDocuments() { return documents; }
    public void setDocuments(List<VehicleDocument> documents) { this.documents = documents; }
}

