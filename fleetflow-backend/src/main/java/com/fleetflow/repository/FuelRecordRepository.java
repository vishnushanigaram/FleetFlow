package com.fleetflow.repository;

import com.fleetflow.model.FuelRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FuelRecordRepository extends JpaRepository<FuelRecord, String> {
    List<FuelRecord> findByVehicleId(String vehicleId);
}

