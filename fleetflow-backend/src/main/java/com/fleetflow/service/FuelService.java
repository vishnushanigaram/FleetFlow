package com.fleetflow.service;

import com.fleetflow.model.FuelRecord;
import com.fleetflow.model.Vehicle;
import com.fleetflow.repository.FuelRecordRepository;
import com.fleetflow.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class FuelService {
    private final FuelRecordRepository fuelRecordRepository;
    private final VehicleRepository vehicleRepository;

    public FuelService(FuelRecordRepository fuelRecordRepository, VehicleRepository vehicleRepository) {
        this.fuelRecordRepository = fuelRecordRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<FuelRecord> getAll(String vehicleId) {
        if (vehicleId != null && !vehicleId.equalsIgnoreCase("ALL")) {
            return fuelRecordRepository.findByVehicleId(vehicleId);
        }
        return fuelRecordRepository.findAll();
    }

    @Transactional
    public FuelRecord create(FuelRecord record) {
        Vehicle vehicle = vehicleRepository.findById(record.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Selected vehicle not found."));

        if (record.getId() == null) {
            record.setId("FUL-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        record.setVehicleReg(vehicle.getRegistrationNo());
        if (record.getDate() == null) {
            record.setDate(LocalDate.now().toString());
        }

        // Update vehicle odometer if higher
        if (record.getOdometer() != null && (vehicle.getOdometer() == null || record.getOdometer() > vehicle.getOdometer())) {
            vehicle.setOdometer(record.getOdometer());
            vehicleRepository.save(vehicle);
        }

        return fuelRecordRepository.save(record);
    }

    public Map<String, Object> getMetrics() {
        List<FuelRecord> records = fuelRecordRepository.findAll();
        double totalSpend = records.stream().mapToDouble(r -> r.getCost() != null ? r.getCost() : 0.0).sum();
        double totalQty = records.stream().mapToDouble(r -> r.getQuantity() != null ? r.getQuantity() : 0.0).sum();
        double avgCostPerUnit = totalQty > 0 ? (totalSpend / totalQty) : 0.0;

        Map<String, Object> res = new HashMap<>();
        res.put("totalSpend", totalSpend);
        res.put("totalQuantity", totalQty);
        res.put("avgCostPerUnit", avgCostPerUnit);
        res.put("recordCount", records.size());
        return res;
    }
}

