package com.fleetflow.repository;

import com.fleetflow.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByRegistrationNoIgnoreCase(String registrationNo);
    boolean existsByRegistrationNoIgnoreCase(String registrationNo);
    List<Vehicle> findByStatus(String status);
}

