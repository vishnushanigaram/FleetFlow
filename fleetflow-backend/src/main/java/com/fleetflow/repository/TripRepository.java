package com.fleetflow.repository;

import com.fleetflow.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByStatus(String status);
    List<Trip> findByDriverId(String driverId);
    List<Trip> findByVehicleId(String vehicleId);
}

