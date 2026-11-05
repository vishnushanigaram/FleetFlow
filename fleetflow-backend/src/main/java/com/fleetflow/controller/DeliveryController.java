package com.fleetflow.controller;

import com.fleetflow.model.Delivery;
import com.fleetflow.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String tripId) {
        return ResponseEntity.ok(deliveryService.getAll(search, status, priority, tripId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(deliveryService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> getByTrackingId(@PathVariable String trackingId) {
        try {
            return ResponseEntity.ok(deliveryService.getByTrackingId(trackingId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Delivery delivery) {
        return ResponseEntity.ok(deliveryService.create(delivery));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        try {
            String newStatus = (String) body.get("status");
            String reason = (String) body.get("reason");
            boolean isCorrection = Boolean.TRUE.equals(body.get("isExplicitCorrection"));
            return ResponseEntity.ok(deliveryService.updateStatus(id, newStatus, reason, isCorrection));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/pod")
    public ResponseEntity<?> confirmPOD(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String signeeName = body.get("signeeName");
            String notes = body.get("notes");
            return ResponseEntity.ok(deliveryService.confirmPOD(id, signeeName, notes));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

