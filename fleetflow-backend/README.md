# FleetFlow - Spring Boot REST API Backend (MySQL Database)

> Production-ready Java Spring Boot backend for the **FleetFlow Intelligent Fleet & Logistics Management System**, providing enterprise REST APIs, Spring Data JPA persistence, transactional business rules, and real-time operational status management powered **exclusively by MySQL**.

---

## 1. Technology Stack

- **Framework**: Spring Boot 3.3.4
- **Language**: Java 21 (LTS)
- **Persistence**: Spring Data JPA / Hibernate 6.x
- **Database**: **MySQL 8.x** (`mysql-connector-j`) exclusively
- **Validation**: Jakarta Bean Validation (`jakarta.validation-api`)
- **Web**: Spring MVC REST Controllers (`spring-boot-starter-web`)
- **Build Tool**: Apache Maven (`pom.xml`, Maven Wrapper included)

---

## 2. Architecture & Design Principles

```
                  ┌──────────────────────────────────────────────┐
                  │          React Frontend (Port 3000)          │
                  │        apiClient.js / Service Layer         │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTP REST (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Spring Boot REST Controllers (/api/v1)   │
                  │ Vehicle, Driver, Trip, Delivery, Mnt, Fuel   │
                  └──────────────────────┬───────────────────────┘
                                         │ Business Delegation
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │               Service Layer                  │
                  │   Business Rules, Conflict Validation, Logic  │
                  └──────────────────────┬───────────────────────┘
                                         │ Data Access
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Spring Data Repositories          │
                  │     JpaRepository interfaces & queries       │
                  └──────────────────────┬───────────────────────┘
                                         │ SQL / Hibernate ORM
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            MySQL 8.x Database Server         │
                  │    Port: 3306 | Database: fleetflow_db       │
                  └──────────────────────────────────────────────┘
```

---

## 3. MySQL Database Configuration

Configured in [`src/main/resources/application.yml`](src/main/resources/application.yml):

```yaml
server:
  port: 8080
  servlet:
    context-path: /api/v1

spring:
  application:
    name: fleetflow-backend

  datasource:
    url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/${MYSQL_DB:fleetflow_db}?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: ${MYSQL_USER:root}
    password: ${MYSQL_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    database-platform: org.hibernate.dialect.MySQLDialect
    hibernate:
      ddl-auto: update
    show-sql: false
```

### Auto Database Creation:
- `createDatabaseIfNotExist=true` ensures MySQL will automatically create the `fleetflow_db` database if it doesn't already exist.
- Hibernate `ddl-auto: update` automatically generates and updates all 10 tables on startup.
- If your MySQL password is not `root`, either edit `src/main/resources/application.yml` or pass it as an environment variable:
  ```bash
  export MYSQL_PASSWORD=your_password    # Linux / macOS
  $env:MYSQL_PASSWORD="your_password"     # Windows PowerShell
  set MYSQL_PASSWORD=your_password        # Windows Command Prompt
  ```

---

## 4. MySQL Schema & Data Entities

The backend maps 10 core JPA entities to MySQL tables conforming to Section 19 & 24 of the FleetFlow specification:

| Model | MySQL Table | Description |
|---|---|---|
| `User` | `users` | Fleet managers, dispatchers, drivers, and platform admins with role-based access |
| `Vehicle` | `vehicles` | Fleet assets (trucks, vans, trailers), registration, odometer, fuel level, and status |
| `VehicleDocument` | `vehicle_documents` | Insurance, permits, fitness certificates with expiry tracking and foreign key to `vehicles` |
| `Driver` | `drivers` | Commercial drivers, license validation, experience, safety scores, and trip history |
| `Trip` | `trips` | Origin, destination, GPS coordinates, distance, cargo, vehicle & driver assignment |
| `TripStatusHistory` | `trip_status_history` | Audit trail of trip state transitions (Draft -> Assigned -> In Transit -> Completed) |
| `Delivery` | `deliveries` | Consignments with tracking codes, recipients, weight, priority, and proof of delivery |
| `Maintenance` | `maintenance_records` | Preventive & reactive servicing, vendor details, costs, and vehicle locking |
| `FuelRecord` | `fuel_records` | Fuel consumption logs, odometer tracking, spend analytics, and station logs |
| `Notification` | `notifications` | System alerts for maintenance due, license expirations, and delivery exceptions |

A complete raw SQL setup script is provided in [`mysql-init.sql`](mysql-init.sql) for direct inspection or manual import via MySQL Workbench or phpMyAdmin if desired.

---

## 5. Key Business Validations & Rules Enforced

1. **Trip Vehicle Assignment**:
   - Only vehicles in `Available` status can be assigned to a new trip.
   - Assigning a vehicle automatically transitions it to `Assigned` (or `On Trip` when dispatched).
2. **Trip Driver Assignment**:
   - Only drivers with `Available` status and an **unexpired commercial license** can be assigned.
3. **Trip Completion Immutability**:
   - Once a trip is marked `Completed`, its status is locked against accidental reversion to active transit.
   - Upon completion, the vehicle odometer is automatically incremented in MySQL by the trip distance, the vehicle is released to `Available`, the driver's trip counter is incremented, and associated deliveries are marked `Delivered`.
4. **Delivery Status Correction Protocol**:
   - Delivered shipments cannot be reverted to earlier stages without passing an explicit supervisor correction flag and documented reason.
5. **Maintenance Vehicle Lock**:
   - Scheduling maintenance in `In Progress` status automatically locks the vehicle to `Maintenance` status, preventing dispatch until maintenance completes.

---

## 6. REST API Endpoints Specification

Base Path: `http://localhost:8080/api/v1`

### Authentication (`/auth`)
- `POST /auth/login`: Authenticate email and password against MySQL `users` table.
- `POST /auth/register`: Register new user account.
- `GET /auth/users`: List all platform users.

### Vehicles (`/vehicles`)
- `GET /vehicles`: Retrieve all vehicles (supports `?search=`, `?status=`, `?type=`, `?fuelType=`).
- `GET /vehicles/{id}`: Get vehicle by ID.
- `POST /vehicles`: Register a new vehicle with unique registration check.
- `PUT /vehicles/{id}`: Update vehicle specifications.
- `DELETE /vehicles/{id}`: Archive/delete vehicle (blocked if vehicle is currently `On Trip`).
- `POST /vehicles/{id}/documents`: Attach compliance document.

### Drivers (`/drivers`)
- `GET /drivers`: Retrieve drivers (supports `?search=`, `?status=`).
- `GET /drivers/{id}`: Get driver profile by ID.
- `POST /drivers`: Onboard new driver with unique commercial license validation.
- `PUT /drivers/{id}`: Update driver details.
- `PATCH /drivers/{id}/deactivate`: Deactivate driver (blocked if driver is currently on an active trip).

### Trips (`/trips`)
- `GET /trips`: Query trips (supports `?search=`, `?status=`, `?vehicleId=`, `?driverId=`).
- `GET /trips/{id}`: Get trip details including full audit history.
- `POST /trips`: Create and dispatch trip with vehicle & driver availability enforcement.
- `PATCH /trips/{id}/status`: Transition trip status (`Draft` -> `Assigned` -> `In Transit` -> `Completed` / `Delayed` / `Cancelled`).

### Deliveries (`/deliveries`)
- `GET /deliveries`: Query deliveries with status/priority filters.
- `GET /deliveries/{id}`: Get delivery by ID.
- `GET /deliveries/track/{trackingId}`: Public tracking lookup by consignment number.
- `POST /deliveries`: Book new consignment.
- `PATCH /deliveries/{id}/status`: Update status with supervisor correction protocol protection.
- `POST /deliveries/{id}/proof`: Capture proof of delivery (receiver name, signature, timestamp).

### Maintenance (`/maintenance`)
- `GET /maintenance`: Query maintenance schedules and service logs.
- `POST /maintenance`: Schedule maintenance service.
- `PATCH /maintenance/{id}/status`: Update status (`Scheduled` -> `In Progress` -> `Completed`).

### Fuel Logs & Metrics (`/fuel-records`)
- `GET /fuel-records`: List fuel fill-ups.
- `POST /fuel-records`: Log fuel transaction and update vehicle odometer.
- `GET /fuel-records/metrics`: Return fleet total fuel spend, volume, and average cost per unit.

### Analytics & Dashboard (`/analytics`)
- `GET /analytics/dashboard`: Aggregate KPI metrics (operable fleet utilization %, active trips, on-time delivery rate %, overdue maintenance, recent activity stream).

### Notifications (`/notifications`)
- `GET /notifications`: List all operational alerts.
- `PATCH /notifications/{id}/read`: Mark notification as read.
- `POST /notifications/read-all`: Mark all notifications as read.

---

## 7. How to Run the Backend with MySQL

### Prerequisites
1. **MySQL Server Running**: Ensure your MySQL server is running on `localhost:3306`.
2. **Java 21 JDK**: Verify with `java -version`.

### Running the Application:
```bash
cd fleetflow-backend
mvn spring-boot:run
```
*Or on Windows using the included Maven Wrapper:*
```cmd
cd fleetflow-backend
mvnw.cmd spring-boot:run
```

The server will connect directly to MySQL, auto-create the `fleetflow_db` schema, generate all 10 tables, seed initial operational data, and start listening on:
- **API Base URL**: `http://localhost:8080/api/v1`

---

## 8. Pre-Seeded Demonstration Data in MySQL

On initial startup, `DataInitializer.java` automatically populates MySQL with:
- **4 Demo Accounts**:
  - `manager@fleetflow.io` / `password123` (Fleet Manager)
  - `dispatcher@fleetflow.io` / `password123` (Operations Dispatcher)
  - `driver@fleetflow.io` / `password123` (Commercial Driver)
  - `admin@fleetflow.io` / `password123` (Platform Admin)
- **8 Commercial Vehicles**: Freightliners, Volvo FH16, Electric Delivery Vans, Reefer trailers.
- **6 Certified Commercial Drivers** with valid commercial licenses, contact details, and safety scores.
- **4 Operational Trips** in varied states (In Transit, Assigned, Completed, Delayed).
- **Consignments, maintenance logs, and fuel transactions** for instant testing and dashboard visualization.
