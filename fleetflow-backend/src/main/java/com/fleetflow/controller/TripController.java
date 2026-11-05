package com.fleetflow.controller;

import com.fleetflow.model.Trip;
import com.fleetflow.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String vehicleId,
            @RequestParam(required = false) String driverId) {
        return ResponseEntity.ok(tripService.getAll(search, status, vehicleId, driverId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(tripService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Trip trip, @RequestParam(required = false) String createdBy) {
        try {
            return ResponseEntity.ok(tripService.create(trip, createdBy));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String newStatus = body.get("status");
            String note = body.get("note");
            String updatedBy = body.get("updatedBy");
            return ResponseEntity.ok(tripService.updateStatus(id, newStatus, note, updatedBy));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

