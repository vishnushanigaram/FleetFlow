package com.fleetflow.repository;

import com.fleetflow.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, String> {
    List<Maintenance> findByStatus(String status);
    List<Maintenance> findByVehicleId(String vehicleId);
}

