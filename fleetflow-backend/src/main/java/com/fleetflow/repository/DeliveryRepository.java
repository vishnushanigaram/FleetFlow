package com.fleetflow.repository;

import com.fleetflow.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, String> {
    Optional<Delivery> findByTrackingIdIgnoreCase(String trackingId);
    List<Delivery> findByStatus(String status);
    List<Delivery> findByTripId(String tripId);
}

