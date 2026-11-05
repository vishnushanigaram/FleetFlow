-- =====================================================================
-- FleetFlow Intelligent Fleet & Logistics Management System
-- Database: MySQL 8.x
-- Database Name: fleetflow_db
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `fleetflow_db` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `fleetflow_db`;

-- 1. Users & RBAC
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `title` VARCHAR(100),
  `status` VARCHAR(50) DEFAULT 'Active',
  `avatar` VARCHAR(255),
  `phone` VARCHAR(50),
  `joined_date` VARCHAR(50),
  `driver_id` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `registration_no` VARCHAR(50) NOT NULL UNIQUE,
  `type` VARCHAR(50) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `capacity` INT NOT NULL,
  `fuel_type` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `odometer` INT DEFAULT 0,
  `year` INT,
  `fuel_capacity` INT,
  `current_fuel_level` INT DEFAULT 100,
  `assigned_driver_id` VARCHAR(50),
  `assigned_driver_name` VARCHAR(100),
  `current_trip_id` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Vehicle Compliance Documents
CREATE TABLE IF NOT EXISTS `vehicle_documents` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `vehicle_id` VARCHAR(50) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `number` VARCHAR(100),
  `expiry_date` VARCHAR(50),
  INDEX `idx_doc_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_doc_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Commercial Drivers
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `contact` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150),
  `license_number` VARCHAR(100) NOT NULL UNIQUE,
  `license_category` VARCHAR(100),
  `license_expiry` VARCHAR(50) NOT NULL,
  `experience_years` INT DEFAULT 1,
  `status` VARCHAR(50) NOT NULL,
  `rating` DOUBLE DEFAULT 5.0,
  `safety_score` INT DEFAULT 100,
  `completed_trips` INT DEFAULT 0,
  `delayed_trips` INT DEFAULT 0,
  `total_distance` INT DEFAULT 0,
  `avatar` VARCHAR(255),
  `current_trip_id` VARCHAR(50),
  `current_vehicle_id` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Operational Trips
CREATE TABLE IF NOT EXISTS `trips` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `vehicle_id` VARCHAR(50),
  `vehicle_reg` VARCHAR(50),
  `driver_id` VARCHAR(50),
  `driver_name` VARCHAR(100),
  `origin` VARCHAR(150) NOT NULL,
  `destination` VARCHAR(150) NOT NULL,
  `planned_start` VARCHAR(50),
  `actual_start` VARCHAR(50),
  `estimated_arrival` VARCHAR(50),
  `distance_km` INT DEFAULT 0,
  `current_speed` INT DEFAULT 0,
  `cargo_load` VARCHAR(255),
  `notes` TEXT,
  `status` VARCHAR(50) NOT NULL,
  `is_delayed` BOOLEAN DEFAULT FALSE,
  `progress_percent` INT DEFAULT 0,
  `origin_lat` DOUBLE,
  `origin_lng` DOUBLE,
  `origin_city` VARCHAR(100),
  `dest_lat` DOUBLE,
  `dest_lng` DOUBLE,
  `dest_city` VARCHAR(100),
  `current_lat` DOUBLE,
  `current_lng` DOUBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Trip Status Audit Trail
CREATE TABLE IF NOT EXISTS `trip_status_history` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `trip_id` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `note` VARCHAR(255),
  `updated_by` VARCHAR(100),
  INDEX `idx_history_trip` (`trip_id`),
  CONSTRAINT `fk_history_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Consignments & Deliveries
CREATE TABLE IF NOT EXISTS `deliveries` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `tracking_id` VARCHAR(100) NOT NULL UNIQUE,
  `trip_id` VARCHAR(50),
  `recipient` VARCHAR(150) NOT NULL,
  `recipient_contact` VARCHAR(50),
  `origin` VARCHAR(150),
  `destination` VARCHAR(150) NOT NULL,
  `items_description` VARCHAR(255),
  `weight_kg` INT DEFAULT 100,
  `priority` VARCHAR(50) DEFAULT 'Normal',
  `status` VARCHAR(50) NOT NULL,
  `eta` VARCHAR(50),
  `delay_reason` VARCHAR(255),
  `proof_signee_name` VARCHAR(150),
  `proof_timestamp` VARCHAR(50),
  `proof_notes` TEXT,
  `proof_signature_image` MEDIUMTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Preventive & Reactive Maintenance Work Orders
CREATE TABLE IF NOT EXISTS `maintenance_records` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `vehicle_id` VARCHAR(50) NOT NULL,
  `vehicle_reg` VARCHAR(50),
  `service_type` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `scheduled_date` VARCHAR(50) NOT NULL,
  `completed_date` VARCHAR(50),
  `odometer` INT DEFAULT 0,
  `cost` INT DEFAULT 0,
  `notes` TEXT,
  `service_provider` VARCHAR(150),
  `technician_name` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Fuel Consumption Logs
CREATE TABLE IF NOT EXISTS `fuel_records` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `vehicle_id` VARCHAR(50) NOT NULL,
  `vehicle_reg` VARCHAR(50),
  `date` VARCHAR(50) NOT NULL,
  `quantity` DOUBLE NOT NULL,
  `cost` DOUBLE NOT NULL,
  `odometer` INT DEFAULT 0,
  `fuel_type` VARCHAR(50),
  `station` VARCHAR(150),
  `driver_name` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Operational System Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` VARCHAR(255) NOT NULL,
  `severity` VARCHAR(50) DEFAULT 'info',
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Initial Demo Accounts (Password: password123)
-- =====================================================================
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `title`, `status`, `avatar`, `phone`, `joined_date`, `driver_id`)
VALUES 
('USR-01', 'Sarah Jenkins', 'manager@fleetflow.io', 'password123', 'manager', 'Head of Fleet Operations', 'Active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', '+1 (555) 234-5678', '2023-01-15', NULL),
('USR-02', 'David Rodriguez', 'dispatcher@fleetflow.io', 'password123', 'dispatcher', 'Senior Route Coordinator', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+1 (555) 345-6789', '2023-04-10', NULL),
('USR-03', 'Marcus Vance', 'driver@fleetflow.io', 'password123', 'driver', 'Senior Commercial Driver', 'Active', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+1 (555) 456-7890', '2022-08-20', 'DRV-01'),
('USR-04', 'Vikram Mehta', 'admin@fleetflow.io', 'password123', 'admin', 'System Platform Admin', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+1 (555) 567-8901', '2021-11-01', NULL)
ON DUPLICATE KEY UPDATE `email`=`email`;

