# 🚛 FleetFlow – Logistics, Fleet & Delivery Operations Management Platform

**Move Smarter. Deliver More.**

FleetFlow is a full-stack logistics and fleet operations management platform designed to help transport companies manage vehicles, drivers, trips, deliveries, maintenance, fuel consumption, and operational performance through a centralized system.

The application provides separate dashboards for Fleet Managers, Operations Dispatchers, Commercial Drivers, and Platform Administrators.

It is built using **React, Java Spring Boot, Spring Data JPA, and MySQL**, with REST APIs connecting the frontend and backend.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Key Features](#-key-features)
4. [User Roles](#-user-roles)
5. [Technology Stack](#-technology-stack)
6. [System Architecture](#-system-architecture)
7. [Business Rules](#-business-rules)
8. [Project Structure](#-project-structure)
9. [Database Design](#-database-design)
10. [Full-Stack Integration](#-full-stack-integration)
11. [Installation and Setup](#-installation-and-setup)
12. [Demo Accounts](#-demo-accounts)
13. [Future Enhancements](#-future-enhancements)
14. [Technical Interview Questions](#-technical-interview-questions)
15. [Project Completion Status](#-project-completion-status)

---

## 1. 📖 Project Overview

FleetFlow is a centralized fleet and logistics management solution that simplifies transportation operations.

Instead of managing vehicles, drivers, trips, and deliveries through separate spreadsheets or manual records, FleetFlow brings everything together in one platform.

The system allows organizations to:

- Manage vehicle and driver information.
- Assign vehicles and drivers to trips.
- Monitor trip and delivery progress.
- Maintain vehicle service records.
- Track fuel consumption and expenses.
- Capture digital proof of delivery.
- Monitor operational performance through dashboards and analytics.

**Main Objective:** To improve fleet utilization, reduce operational delays, prevent resource conflicts, and provide better visibility into transportation activities.

---

## 2. 🎯 Problem Statement

Traditional logistics operations face several challenges:

**1. Disconnected Information**

Vehicle details, driver records, fuel expenses, and delivery information are often maintained in different systems.

**2. Vehicle and Driver Availability**

Assigning an already occupied vehicle or unavailable driver can create scheduling conflicts.

**3. Maintenance Management**

Missed service schedules and expired vehicle documents can lead to unexpected breakdowns and compliance issues.

**4. Delivery Tracking**

Operations teams need a centralized way to monitor shipment progress and identify delayed deliveries.

**5. Lack of Operational Insights**

Without proper analytics, managers find it difficult to evaluate fleet utilization, fuel expenses, and delivery performance.

### FleetFlow Solution

FleetFlow addresses these problems by providing a centralized platform with resource management, automated validation, delivery tracking, maintenance management, and operational analytics.

---

## 3. 🚀 Key Features

### A. Vehicle Management

- Add, update, view, and delete vehicle records.
- Maintain registration numbers and vehicle specifications.
- Track vehicle availability and operational status.
- Monitor vehicle capacity and odometer readings.
- Track vehicle document expiration dates.

### B. Driver Management

- Manage driver profiles and personal information.
- Track commercial driving license validity.
- Monitor driver availability.
- Maintain driver safety ratings.
- Track completed trips.

### C. Trip Management

- Create and schedule transportation trips.
- Assign available vehicles and drivers.
- Validate resource availability before dispatch.
- Update trip statuses.
- Automatically update vehicle and driver availability when trips are completed or cancelled.

### D. Dispatch Management

- Manage trip assignments through a Kanban-style dispatch board.
- Monitor trip progress.
- Organize dispatch activities.
- Track delayed and active trips.

### E. Delivery Management

- Create and manage delivery consignments.
- Track shipments through different delivery stages.
- Maintain delivery status history.
- Capture electronic proof of delivery (e-POD).
- Support authorized delivery status corrections with justification.

### F. Maintenance Management

- Schedule preventive vehicle maintenance.
- Create and manage service work orders.
- Automatically mark vehicles as under maintenance when applicable.
- Restore vehicle availability after maintenance completion.

### G. Fuel Management

- Record fuel purchases and consumption.
- Track fuel expenses.
- Maintain vehicle fuel history.
- Generate fuel consumption summaries.

### H. Dashboard and Analytics

- Display fleet performance statistics.
- Calculate vehicle utilization.
- Monitor active trips and delayed deliveries.
- Display driver performance information.
- Generate operational reports.
- Export reports in CSV format.

### I. Authentication and Role-Based Access

- Provide role-specific dashboards.
- Restrict access to authorized pages.
- Support different operational permissions.
- Provide demo role switching for evaluation.

### J. Additional Features

- Light and dark themes.
- Search, sorting, filtering, and pagination.
- Notification center.
- Loading skeletons and error handling.
- Interactive route simulation.
- Public shipment tracking.

---

## 4. 👥 User Roles

FleetFlow supports five different user perspectives.

| Role | Responsibilities |
|---|---|
| Guest / Public | Explore the platform and track deliveries using tracking numbers. |
| Commercial Driver | View assigned trips, update delivery progress, and submit delivery proof. |
| Operations Dispatcher | Plan trips, assign resources, manage dispatch operations, and monitor deliveries. |
| Fleet Manager | Manage vehicles, drivers, maintenance, fuel records, and analytics. |
| Platform Admin | Manage users, permissions, master data, and system settings. |

Each role has access to features relevant to its responsibilities.

---

## 5. 🛠 Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | Building reusable UI components |
| Vite 5 | Frontend development and build tooling |
| React Router DOM 6 | Application navigation and routing |
| Tailwind CSS 3 | Responsive UI styling |
| Lucide React | Icons |
| JavaScript | Frontend application logic |

### Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot 3.3.4 | Building REST APIs |
| Spring Data JPA | Database operations and ORM |
| Hibernate | Object-relational mapping |
| MySQL 8.x | Relational database |
| Maven | Dependency management and project build |

### Communication

**REST API integration** connects the React frontend with the Spring Boot backend using HTTP requests.

The application uses standard HTTP methods:

- `GET` – Retrieve information.
- `POST` – Create new records.
- `PUT` – Update existing records.
- `PATCH` – Partially update records.
- `DELETE` – Remove records.

---

## 6. 🏗 System Architecture

FleetFlow follows a layered architecture that separates frontend presentation, backend business logic, and database operations.

### Architecture Diagram

```text
              USER
                |
                ▼
       REACT FRONTEND
       (React + Vite)
                |
                ▼
       COMPONENTS & PAGES
                |
                ▼
       CONTEXT & HOOKS
                |
                ▼
        SERVICE LAYER
      (vehicleService,
       driverService,
       tripService, etc.)
                |
                ▼
          API CLIENT
                |
                ▼
          REST APIs
                |
                ▼
       SPRING BOOT BACKEND
                |
                ▼
         CONTROLLER
                |
                ▼
          SERVICE
       (Business Logic)
                |
                ▼
         REPOSITORY
        (Spring Data JPA)
                |
                ▼
           HIBERNATE
                |
                ▼
          MYSQL DATABASE
```

### Frontend Architecture

The React application is divided into reusable components, pages, hooks, contexts, and service modules.

Important React concepts used:

- **Component Composition:** Reusable buttons, tables, modals, cards, and forms.
- **React Hooks:** `useState`, `useEffect`, `useMemo`, `useCallback`, and `useRef`.
- **Context API:** Shared authentication, notification, and theme state.
- **Custom Hooks:** Authentication, data fetching, debouncing, and local storage.
- **Protected Routes:** Restrict access based on user authentication and roles.
- **Error Boundaries:** Handle unexpected rendering errors.

### Backend Architecture

The Spring Boot backend follows a layered architecture:

| Layer | Responsibility |
|---|---|
| Controller | Handles incoming HTTP requests and returns responses. |
| Service | Implements business logic and validation. |
| Repository | Communicates with the database using Spring Data JPA. |
| Entity | Represents database tables. |
| DTO | Transfers structured data between frontend and backend. |
| Configuration | Manages application and database configuration. |

This separation makes the application easier to maintain, test, and extend.

---

## 7. ⚙ Important Business Rules

FleetFlow implements business rules to maintain consistency across fleet operations.

**1. Vehicle Availability Validation**

A vehicle cannot be assigned to a new trip if its current status is:

- On Trip
- Maintenance
- Inactive

**2. Driver Availability Validation**

A driver cannot be assigned if they are:

- Already on another trip.
- On leave.
- Inactive.
- Holding an expired commercial driving license.

**3. Trip Lifecycle Management**

When a trip is completed or cancelled, the system updates the associated vehicle and driver availability.

**4. Delivery Status Protection**

A completed delivery with signed proof cannot be reverted without an authorized correction process and a valid reason.

**5. Maintenance Management**

Vehicles under active maintenance are automatically marked unavailable for new trip assignments.

**6. Document Expiration Alerts**

The system highlights vehicle and driver documents approaching their expiration dates.

These rules help prevent invalid assignments and maintain operational consistency.

---

## 8. 📂 Project Structure

The project is organized into separate frontend and backend applications.

### Frontend Structure

```text
fleetflow-react/
│
├── public/
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── deliveries/
│   │   ├── maintenance/
│   │   ├── fuel/
│   │   └── analytics/
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── driver/
│   │   ├── operations/
│   │   ├── manager/
│   │   ├── admin/
│   │   └── shared/
│   │
│   ├── routes/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   │   ├── api/
│   │   ├── authService.js
│   │   ├── vehicleService.js
│   │   ├── driverService.js
│   │   ├── tripService.js
│   │   ├── deliveryService.js
│   │   ├── maintenanceService.js
│   │   ├── fuelService.js
│   │   └── analyticsService.js
│   │
│   ├── utils/
│   ├── data/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Backend Structure

```text
fleetflow-backend/
│
└── src/
    └── main/
        ├── java/
        │   └── com/fleetflow/
        │       ├── controller/
        │       ├── service/
        │       ├── repository/
        │       ├── entity/
        │       ├── dto/
        │       ├── config/
        │       └── FleetFlowApplication.java
        │
        └── resources/
            └── application.properties

pom.xml
```

---

## 9. 🗄 Database Design

FleetFlow uses MySQL to store and manage operational data.

The backend uses Spring Data JPA and Hibernate to map Java entities to relational database tables.

### Main Database Entities

The database contains entities for the following operational areas:

- Users
- Vehicles
- Drivers
- Trips
- Deliveries
- Maintenance records
- Fuel records
- Other supporting operational data

### Entity Relationships

| Relationship | Description |
|---|---|
| Vehicle → Trips | One vehicle can be associated with multiple trips over time. |
| Driver → Trips | One driver can complete multiple trips over time. |
| Trip → Deliveries | A trip can contain multiple deliveries. |
| Vehicle → Maintenance | A vehicle can have multiple maintenance records. |
| Vehicle → Fuel Records | A vehicle can have multiple fuel records. |

Foreign keys maintain relationships between related database records.

---

## 10. 🔗 Full-Stack Integration

FleetFlow integrates React with a Java Spring Boot backend through REST APIs.

### How Frontend and Backend Communicate

Consider the process of adding a new vehicle.

1. The Fleet Manager opens the vehicle management page.
2. The manager enters vehicle information and submits the form.
3. React calls the vehicle service.
4. The service sends an HTTP `POST` request to the Spring Boot API.
5. The Spring Boot Controller receives the request.
6. The Service layer validates the business rules.
7. The Repository saves the vehicle using Spring Data JPA.
8. Hibernate generates the required SQL query.
9. MySQL stores the vehicle information.
10. The backend returns a response to React.
11. React updates the interface with the latest information.

### Dual-Mode Architecture

FleetFlow also supports two data modes.

| Mode | Description |
|---|---|
| Spring Boot Mode | Uses REST APIs and stores data in MySQL. |
| Mock Mode | Uses browser localStorage for persistent demonstration data. |

The frontend can detect backend availability and use the appropriate data source. Users can also switch modes through the backend status indicator.

**Backend API Base URL:**

```text
http://localhost:8080/api/v1
```

---

## 11. 💻 Installation and Setup

### Prerequisites

Install the following software before running the application:

- Node.js 18 or higher
- npm
- Java JDK 17 or compatible configured JDK
- Maven
- MySQL 8.x
- VS Code or IntelliJ IDEA

### Step 1: Clone the Repository

```bash
git clone https://github.com/vishnushanigaram/FleetFlow.git
```

Navigate to the project directory:

```bash
cd FleetFlow
```

### Step 2: Configure MySQL

Create the database:

```sql
CREATE DATABASE fleetflow_db;
```

Configure your MySQL username, password, and database URL in the backend's `application.properties`.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fleetflow_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use your actual local database credentials.

### Step 3: Start the Spring Boot Backend

Open a terminal:

```bash
cd fleetflow-backend
```

Run:

```bash
mvn spring-boot:run
```

On Windows, if Maven is not installed globally, use the Maven wrapper if available:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

### Step 4: Start the React Frontend

Open another terminal:

```bash
cd fleetflow-react
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The Vite development server is configured to run at:

```text
http://localhost:3000
```

### Step 5: Open FleetFlow

Open the frontend URL in your browser.

Make sure both the Spring Boot backend and MySQL database are running to use the full-stack application.

### Production Build

To generate an optimized frontend build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## 12. 🔐 Demo Accounts

FleetFlow provides demo accounts for testing different user roles.

| Role | Email | Password |
|---|---|---|
| Fleet Manager | manager@fleetflow.io | password123 |
| Operations Dispatcher | dispatcher@fleetflow.io | password123 |
| Commercial Driver | driver@fleetflow.io | password123 |
| Platform Admin | admin@fleetflow.io | password123 |

A Quick Demo Switcher is also available in the navigation bar for switching between roles during demonstrations.

*These are demonstration credentials, not production authentication credentials.*

---

## 13. 🔮 Future Enhancements

The following improvements can extend FleetFlow into a more advanced logistics platform.

| Enhancement | Planned Technology |
|---|---|
| Secure authentication | Spring Security and JWT |
| Live GPS tracking | WebSockets and GPS integration |
| Route optimization | AI-based route recommendations |
| Predictive maintenance | Machine learning |
| Real-time notifications | WebSockets |
| Advanced reporting | Backend analytics and optimized SQL queries |

These are planned enhancements and are not part of the currently completed implementation.

---
## 14. ✅ Project Completion Status

| Module | Status |
|---|---|
| React Frontend | Completed |
| Responsive Dashboard | Completed |
| Vehicle Management | Completed |
| Driver Management | Completed |
| Trip Management | Completed |
| Dispatch Management | Completed |
| Delivery Tracking | Completed |
| Maintenance Management | Completed |
| Fuel Management | Completed |
| Dashboard Analytics | Completed |
| Spring Boot REST APIs | Completed |
| Spring Data JPA Integration | Completed |
| MySQL Database Integration | Completed |
| Dual-Mode Data Support | Completed |
| Spring Security and JWT | Planned |
| Real GPS Integration | Planned |
| AI-Based Route Optimization | Planned |

---

## 👨‍💻 Author

**Vishnu Shanigaram**

B.Tech – Computer Science and Engineering

GitHub: [vishnushanigaram](https://github.com/vishnushanigaram)

---

<p align="center">

**FLEETFLOW**

*Move Smarter. Operate Better. Deliver More.*

</p>
