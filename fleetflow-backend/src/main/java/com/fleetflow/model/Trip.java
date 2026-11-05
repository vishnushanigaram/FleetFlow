package com.fleetflow.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    private String id;

    @Column(nullable = false)
    private String vehicleId;

    private String vehicleReg;

    @Column(nullable = false)
    private String driverId;

    private String driverName;
    private String origin;
    private String destination;
    private String plannedStart;
    private String actualStart;
    private String estimatedArrival;
    private Double distanceKm;
    private Integer currentSpeed;
    private String cargoLoad;
    private String notes;
    private String status; // Planned, Assigned, In Transit, Paused, Completed, Cancelled, Delayed
    private Boolean isDelayed;
    private Integer progressPercent;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "trip_id")
    private List<TripStatusHistory> statusHistory = new ArrayList<>();

    public Trip() {}

    public Trip(String id, String vehicleId, String vehicleReg, String driverId, String driverName, String origin, String destination, String plannedStart, String estimatedArrival, Double distanceKm, String cargoLoad, String status) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.vehicleReg = vehicleReg;
        this.driverId = driverId;
        this.driverName = driverName;
        this.origin = origin;
        this.destination = destination;
        this.plannedStart = plannedStart;
        this.estimatedArrival = estimatedArrival;
        this.distanceKm = distanceKm;
        this.cargoLoad = cargoLoad;
        this.status = status;
        this.isDelayed = false;
        this.progressPercent = 0;
        this.currentSpeed = 0;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getVehicleReg() { return vehicleReg; }
    public void setVehicleReg(String vehicleReg) { this.vehicleReg = vehicleReg; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getPlannedStart() { return plannedStart; }
    public void setPlannedStart(String plannedStart) { this.plannedStart = plannedStart; }

    public String getActualStart() { return actualStart; }
    public void setActualStart(String actualStart) { this.actualStart = actualStart; }

    public String getEstimatedArrival() { return estimatedArrival; }
    public void setEstimatedArrival(String estimatedArrival) { this.estimatedArrival = estimatedArrival; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getCurrentSpeed() { return currentSpeed; }
    public void setCurrentSpeed(Integer currentSpeed) { this.currentSpeed = currentSpeed; }

    public String getCargoLoad() { return cargoLoad; }
    public void setCargoLoad(String cargoLoad) { this.cargoLoad = cargoLoad; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsDelayed() { return isDelayed; }
    public void setIsDelayed(Boolean isDelayed) { this.isDelayed = isDelayed; }

    public Integer getProgressPercent() { return progressPercent; }
    public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }

    public List<TripStatusHistory> getStatusHistory() { return statusHistory; }
    public void setStatusHistory(List<TripStatusHistory> statusHistory) { this.statusHistory = statusHistory; }
}

