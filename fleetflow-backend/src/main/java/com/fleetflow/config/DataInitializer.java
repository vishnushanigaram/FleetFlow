package com.fleetflow.config;

import com.fleetflow.model.*;
import com.fleetflow.repository.*;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final DeliveryRepository deliveryRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FuelRecordRepository fuelRecordRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            TripRepository tripRepository,
            DeliveryRepository deliveryRepository,
            MaintenanceRepository maintenanceRepository,
            FuelRecordRepository fuelRecordRepository,
            NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
        this.deliveryRepository = deliveryRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.fuelRecordRepository = fuelRecordRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println(">>> Initializing FleetFlow Spring Boot Relational Data...");

        // 1. Users
        userRepository.saveAll(List.of(
                new User("USR-01", "Rohit Sharma", "manager@fleetflow.io", "password123", "manager", "Senior Fleet Director", "+1 (555) 492-1084", "Active", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", LocalDate.of(2023, 3, 15)),
                new User("USR-02", "Sarah Jenkins", "dispatcher@fleetflow.io", "password123", "dispatcher", "Operations Coordinator", "+1 (555) 391-7721", "Active", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", LocalDate.of(2023, 6, 20)),
                new User("USR-03", "Ajay Kumar", "driver@fleetflow.io", "password123", "driver", "Senior Commercial Fleet Driver", "+1 (555) 234-5678", "Active", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", LocalDate.of(2022, 11, 1)),
                new User("USR-04", "Vikram Mehta", "admin@fleetflow.io", "password123", "admin", "Lead Systems Administrator", "+1 (555) 883-2910", "Active", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", LocalDate.of(2022, 1, 10))
        ));

        // 2. Vehicles
        Vehicle v1 = new Vehicle("VEH-101", "DL 1L AB 1234", "Heavy Truck", "Volvo FH16 540", 24000.0, "Diesel", "On Trip", 48250.0, 2023, 600.0, 75);
        v1.setAssignedDriverId("DRV-1001");
        v1.setAssignedDriverName("Ajay Kumar");
        v1.setCurrentTripId("TRP-5001");
        v1.getDocuments().add(new VehicleDocument("DOC-101", "Commercial Insurance", "POL-9923812", "2027-03-15"));
        v1.getDocuments().add(new VehicleDocument("DOC-102", "Fitness Certificate", "FIT-2024-88", "2026-11-12")); // Expiring soon

        Vehicle v2 = new Vehicle("VEH-102", "HR 55 CD 5678", "Medium Duty Truck", "Mercedes-Benz Atego", 12000.0, "Diesel", "Available", 62100.0, 2022, 320.0, 88);
        v2.getDocuments().add(new VehicleDocument("DOC-104", "Commercial Insurance", "POL-110928", "2027-06-20"));

        Vehicle v3 = new Vehicle("VEH-103", "KA 03 EF 9012", "Delivery Van", "Ford Transit High Roof", 3500.0, "CNG", "On Trip", 31400.0, 2023, 120.0, 62);
        v3.setAssignedDriverId("DRV-1002");
        v3.setAssignedDriverName("Priya Sharma");
        v3.setCurrentTripId("TRP-5002");
        v3.getDocuments().add(new VehicleDocument("DOC-106", "Commercial Insurance", "POL-449102", "2026-11-04")); // Expiring soon

        Vehicle v4 = new Vehicle("VEH-104", "MH 12 GH 3456", "Heavy Truck", "Scania R500 V8", 26000.0, "Diesel", "Maintenance", 89300.0, 2021, 650.0, 45);
        v4.getDocuments().add(new VehicleDocument("DOC-108", "Commercial Insurance", "POL-782193", "2027-09-30"));
        v4.getDocuments().add(new VehicleDocument("DOC-109", "Fitness Certificate", "FIT-2024-51", "2026-10-20")); // Expired

        Vehicle v5 = new Vehicle("VEH-105", "TN 09 IJ 7890", "Electric Van", "Rivian Commercial 700", 4500.0, "Electric", "Available", 14500.0, 2024, 135.0, 94);
        v5.getDocuments().add(new VehicleDocument("DOC-110", "Commercial Insurance", "POL-332910", "2027-12-01"));

        Vehicle v6 = new Vehicle("VEH-106", "UP 16 KL 2345", "Refrigerated Van", "Mercedes Sprinter 314", 4000.0, "Diesel", "Assigned", 42150.0, 2023, 95.0, 70);
        v6.setAssignedDriverId("DRV-1003");
        v6.setAssignedDriverName("Sunil Verma");
        v6.setCurrentTripId("TRP-5003");

        Vehicle v7 = new Vehicle("VEH-107", "WB 02 MN 6789", "Flatbed Trailer", "Tata Signa 4825.TK", 28000.0, "Diesel", "Available", 57400.0, 2022, 400.0, 80);
        Vehicle v8 = new Vehicle("VEH-108", "GJ 01 OP 1234", "Delivery Van", "Isuzu Reach Cargo", 3200.0, "Diesel", "Inactive", 142000.0, 2019, 80.0, 25);

        vehicleRepository.saveAll(List.of(v1, v2, v3, v4, v5, v6, v7, v8));

        // 3. Drivers
        Driver d1 = new Driver("DRV-1001", "Ajay Kumar", "+1 (555) 234-5678", "driver@fleetflow.io", "DL-908234-HMV", "Heavy Commercial (HMV)", "2027-08-15", 8, "On Trip", 4.9, 98, 142, 3, 64200.0, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
        d1.setCurrentTripId("TRP-5001");
        d1.setCurrentVehicleId("VEH-101");

        Driver d2 = new Driver("DRV-1002", "Priya Sharma", "+1 (555) 345-6789", "priya.sharma@fleetflow.io", "DL-481920-LCV", "Light Commercial (LCV)", "2026-11-18", 5, "On Trip", 4.8, 96, 89, 1, 38100.0, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80");
        d2.setCurrentTripId("TRP-5002");
        d2.setCurrentVehicleId("VEH-103");

        Driver d3 = new Driver("DRV-1003", "Sunil Verma", "+1 (555) 456-7890", "sunil.verma@fleetflow.io", "DL-339102-HMV", "Heavy Commercial (HMV)", "2027-11-30", 11, "Assigned", 4.7, 94, 215, 6, 95400.0, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80");
        d3.setCurrentTripId("TRP-5003");
        d3.setCurrentVehicleId("VEH-106");

        Driver d4 = new Driver("DRV-1004", "Marcus Vance", "+1 (555) 567-8901", "marcus.v@fleetflow.io", "DL-119283-LCV", "Light Commercial (LCV)", "2028-01-25", 4, "Available", 4.6, 95, 76, 2, 29800.0, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80");
        Driver d5 = new Driver("DRV-1005", "Elena Rostova", "+1 (555) 678-9012", "elena.r@fleetflow.io", "DL-882736-HMV", "Heavy Commercial (HMV)", "2026-11-05", 7, "Available", 4.9, 99, 118, 0, 54100.0, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80");
        Driver d6 = new Driver("DRV-1006", "David Chen", "+1 (555) 789-0123", "david.chen@fleetflow.io", "DL-552199-LCV", "Light Commercial (LCV)", "2026-10-15", 3, "Leave", 4.2, 89, 42, 5, 16800.0, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80");

        driverRepository.saveAll(List.of(d1, d2, d3, d4, d5, d6));

        // 4. Trips
        Trip t1 = new Trip("TRP-5001", "VEH-101", "DL 1L AB 1234", "DRV-1001", "Ajay Kumar", "Chicago Central Fulfillment Hub (IL)", "Detroit Automotive Logistics Center (MI)", "2026-10-26T08:00:00", "2026-10-26T16:30:00", 460.0, "Precision Powertrain Assemblies (18,500 kg)", "In Transit");
        t1.setProgressPercent(68);
        t1.setCurrentSpeed(62);
        t1.setActualStart("2026-10-26T08:15:00");
        t1.getStatusHistory().add(new TripStatusHistory("SH-1", "Planned", "2026-10-25T14:00:00Z", "Route planned and approved", "Sarah Jenkins"));
        t1.getStatusHistory().add(new TripStatusHistory("SH-2", "In Transit", "2026-10-26T08:15:00Z", "Departed Chicago Hub on schedule", "Ajay Kumar"));

        Trip t2 = new Trip("TRP-5002", "VEH-103", "KA 03 EF 9012", "DRV-1002", "Priya Sharma", "Seattle Metro Hub (WA)", "Portland Express Center (OR)", "2026-10-26T07:30:00", "2026-10-26T12:45:00", 280.0, "Medical Devices & Diagnostics (2,100 kg)", "Delayed");
        t2.setIsDelayed(true);
        t2.setProgressPercent(45);
        t2.setCurrentSpeed(55);

        Trip t3 = new Trip("TRP-5003", "VEH-106", "UP 16 KL 2345", "DRV-1003", "Sunil Verma", "Dallas Cold Storage Terminal (TX)", "Austin Grocery Hub (TX)", "2026-10-26T14:00:00", "2026-10-26T18:30:00", 315.0, "Fresh Organic Dairy & Produce (3,400 kg)", "Assigned");

        Trip t4 = new Trip("TRP-5004", "VEH-102", "HR 55 CD 5678", "DRV-1004", "Marcus Vance", "Philadelphia Logistics Yard (PA)", "Boston Distribution Center (MA)", "2026-10-24T06:00:00", "2026-10-24T14:30:00", 510.0, "Retail Apparel & Footwear (8,200 kg)", "Completed");
        t4.setProgressPercent(100);

        tripRepository.saveAll(List.of(t1, t2, t3, t4));

        // 5. Deliveries
        Delivery del1 = new Delivery("DEL-8001", "FL-TRK-8921", "TRP-5001", "Apex Precision Automotive Works", "Gate 4, +1 313-555-0199", "Chicago, IL", "Detroit, MI", "4 Pallets Precision Gearboxes", 4200.0, "Urgent", "In Transit", "2026-10-26T16:30:00");
        Delivery del2 = new Delivery("DEL-8002", "FL-TRK-7412", "TRP-5002", "Pacific Northwest Health Systems", "Dock 2, +1 503-555-0182", "Seattle, WA", "Portland, OR", "6 Crates Cryogenic Diagnostic Kits", 850.0, "High", "Delayed", "2026-10-26T14:15:00");
        del2.setDelayReason("Severe I-5 interstate accident and winter rainfall slowdown.");

        Delivery del3 = new Delivery("DEL-8003", "FL-TRK-6309", "TRP-5003", "Central Texas Natural Grocers Co-op", "+1 512-555-0144", "Dallas, TX", "Austin, TX", "8 Pallets Farm Dairy", 3400.0, "Normal", "Pending", "2026-10-26T18:30:00");

        Delivery del4 = new Delivery("DEL-8004", "FL-TRK-5100", "TRP-5004", "Beacon Hill Apparel Warehouse", "+1 617-555-0133", "Philadelphia, PA", "Boston, MA", "25 Cartons Premium Outerwear", 2800.0, "Normal", "Delivered", "2026-10-24T14:30:00");
        del4.setSigneeName("Arthur Pendelton");
        del4.setPodTimestamp("2026-10-24T14:12:00Z");
        del4.setPodNotes("All cartons verified and received in immaculate condition.");

        deliveryRepository.saveAll(List.of(del1, del2, del3, del4));

        // 6. Maintenance
        Maintenance m1 = new Maintenance("MNT-301", "VEH-104", "MH 12 GH 3456", "Brake Inspection", "In Progress", "2026-10-25", 89300.0, 580.0, "Driver reported front axle vibration during braking.", "Continental Fleet Tech Services");
        Maintenance m2 = new Maintenance("MNT-302", "VEH-103", "KA 03 EF 9012", "Oil Change", "Overdue", "2026-10-23", 31400.0, 160.0, "Scheduled 30,000 km standard synthetic oil & filter interval.", "Express QuickLube Hub");
        Maintenance m3 = new Maintenance("MNT-303", "VEH-101", "DL 1L AB 1234", "Tire Replacement", "Scheduled", "2026-10-30", 48250.0, 1250.0, "Rotate rear steer tires and fit new Michelin treads.", "Goodyear Commercial Tire Center");
        maintenanceRepository.saveAll(List.of(m1, m2, m3));

        // 7. Fuel Records
        FuelRecord f1 = new FuelRecord("FUL-401", "VEH-101", "DL 1L AB 1234", "2026-10-25", 320.0, 448.0, 47900.0, "Diesel", "Pilot Flying J Travel Plaza #41", "Ajay Kumar");
        FuelRecord f2 = new FuelRecord("FUL-402", "VEH-102", "HR 55 CD 5678", "2026-10-22", 190.0, 266.0, 61800.0, "Diesel", "Love’s Travel Stop #182", "Marcus Vance");
        FuelRecord f3 = new FuelRecord("FUL-403", "VEH-103", "KA 03 EF 9012", "2026-10-24", 65.0, 84.50, 31100.0, "CNG", "Clean Energy Fuels CNG Hub", "Priya Sharma");
        fuelRecordRepository.saveAll(List.of(f1, f2, f3));

        // 8. Notifications
        Notification n1 = new Notification("NOTIF-01", "MAINTENANCE_OVERDUE", "Maintenance Overdue", "Scheduled Oil Change for KA 03 EF 9012 is overdue since 23 Oct 2026.", "error", false, "2026-10-26T07:15:00Z", "/maintenance");
        Notification n2 = new Notification("NOTIF-02", "DOCUMENT_EXPIRY", "Vehicle Document Expiring Soon", "Fitness Certificate for DL 1L AB 1234 expires in 17 days.", "warning", false, "2026-10-26T08:00:00Z", "/vehicles");
        Notification n3 = new Notification("NOTIF-03", "TRIP_DELAYED", "Trip TRP-5002 Delayed", "Trip to Portland is delayed due to severe interstate traffic.", "warning", false, "2026-10-26T10:15:00Z", "/operations/tracking");
        notificationRepository.saveAll(List.of(n1, n2, n3));

        System.out.println(">>> FleetFlow Spring Boot Backend Initialized Successfully!");
    }
}

