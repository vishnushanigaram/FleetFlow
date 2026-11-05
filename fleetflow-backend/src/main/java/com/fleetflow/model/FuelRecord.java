package com.fleetflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fuel_records")
public class FuelRecord {
    @Id
    private String id;

    @Column(nullable = false)
    private String vehicleId;

    private String vehicleReg;
    private String date;
    private Double quantity;
    private Double cost;
    private Double odometer;
    private String fuelType;
    private String station;
    private String driverName;

    public FuelRecord() {}

    public FuelRecord(String id, String vehicleId, String vehicleReg, String date, Double quantity, Double cost, Double odometer, String fuelType, String station, String driverName) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleReg = vehicleReg;
        this.date = date;
        this.quantity = quantity;
        this.cost = cost;
        this.odometer = odometer;
        this.fuelType = fuelType;
        this.station = station;
        this.driverName = driverName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public Double getOdometer() { return odometer; }
    public void setOdometer(Double odometer) { this.odometer = odometer; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getStation() { return station; }
    public void setStation(String station) { this.station = station; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}

