package com.fleetflow.controller;

import com.fleetflow.model.FuelRecord;
import com.fleetflow.service.FuelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/fuel-records")
@CrossOrigin(origins = "*")
public class FuelController {
    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @GetMapping
    public ResponseEntity<List<FuelRecord>> getAll(@RequestParam(required = false) String vehicleId) {
        return ResponseEntity.ok(fuelService.getAll(vehicleId));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody FuelRecord record) {
        try {
            return ResponseEntity.ok(fuelService.create(record));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(fuelService.getMetrics());
    }
}

