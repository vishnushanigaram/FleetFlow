# FleetFlow — Logistics, Fleet & Delivery Operations Management Platform

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.26-ca4245.svg?style=flat&logo=react-router)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Move Smarter. Deliver More.**  
> FleetFlow is an enterprise-grade logistics and fleet operations management platform built for transport companies, freight coordinators, warehouse logistics teams, and fleet administrators.

---

## 1. Project Overview & Business Problem

### Business Problem
- **Disconnected Systems**: Fleet operators traditionally juggle drivers, vehicle availability, work orders, fuel receipts, and delivery tracking across fragmented spreadsheets and messaging apps.
- **Downtime & Expired Compliance**: Missed preventive maintenance dates and expired vehicle fitness or driver commercial licenses lead to costly breakdowns and regulatory penalties.
- **Lack of Real-time Visibility**: Operations teams struggle to track delayed shipments, optimize fleet capacity utilization, or obtain verifiable digital proof-of-delivery (e-POD).
- **Scalability Needs**: Organizations require an enterprise-grade frontend architecture that can seamlessly transition from a client-side mock REST prototype to a production **Java Spring Boot + Spring Data JPA + MySQL** backend without rewriting the React application.

### FleetFlow Solution
FleetFlow provides an end-to-end operational operating system designed to handle the entire logistical lifecycle:
1. **Asset Management**: Full vehicle lifecycle tracking, odometer tracking, capacity limits, and regulatory document expiry alerts.
2. **Personnel Compliance**: Commercial Driver License (CDL) verification, safety rating indices, and automated availability locking.
3. **Trip Planning & Scheduling**: Strict assignment validation ensuring only `Available` vehicles and drivers can be dispatched.
4. **Interactive Dispatch**: Drag-and-drop Kanban dispatch board with real-time status transitions.
5. **Live Route Simulation & Telemetry**: Interactive GPS highway corridor simulation with waypoint tracking, simulated speed telemetry, and movement controls.
6. **Consignment Lifecycle & e-POD**: Waybill tracking, digital signature capture, and supervisor-authorized delivery correction protocol.
7. **Maintenance & Fuel Logistics**: Service work order scheduling that automatically updates vehicle duty status, plus fuel consumption analytics.
8. **Operational Intelligence**: Real-time calculated fleet utilization, on-time SLA metrics, driver leaderboards, and CSV exports.

---

## 2. User Roles & Capabilities

| Role | Operational Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Guest / Public** | Product exploration & package tracking | View landing page, inspect product capabilities, and track consignments publicly via tracking number (e.g., `FL-TRK-8921`). |
| **Commercial Driver** | Assigned missions & dock fulfillment | Driver cockpit, view assigned highway trips, capture digital consignee signatures (e-POD), inspect license validity and safety index. |
| **Operations Dispatcher**| Fleet coordination & route staging | Plan and dispatch trips with resource availability validation, manage live Kanban dispatch board, monitor GPS tracking and delayed routes. |
| **Fleet Manager** | Resource allocation & KPI audit | Executive dashboard, vehicle/driver CRUD, preventive maintenance work orders, fuel logs, fleet capacity utilization, and exportable analytics. |
| **Platform Admin** | System administration & diagnostics | RBAC user management, master hubs data, simulated network latency, API error injection mode, and database reset triggers. |

---

## 3. Technology Stack

- **Frontend Core**: React 18 (Functional Components, Hooks, Context API)
- **Tooling & Bundler**: Vite 5 (Ultra-fast HMR and optimized production bundling)
- **Routing**: React Router DOM v6 (Nested routes, role-based Protected Routes, 404/403 handlers)
- **Styling & UI**: Tailwind CSS v3 with custom color tokens and Dark/Light mode theme system
- **Icons**: Lucide React
- **Asynchronous Service Layer**: Dedicated domain API clients (`vehicleService`, `tripService`, etc.) backed by local persistent mock REST storage with simulated network latency and error injection.
- **Exporting**: Client-side CSV generation utility for operational reports.

---

## 4. Architecture & React Concepts Demonstrated

### Target Architecture (Decoupled Service Layer)
```
[ React Components & Pages ]
           │
           ▼
[ Context & Custom Hooks ] (useAuth, useFetch, useDebounce, useLocalStorage, useNotifications)
           │
           ▼
[ Validation & Utility Layer ] (validateVehicle, validateTrip, dateUtils, formatters)
           │
           ▼
[ Dedicated Domain Services ] (vehicleService, tripService, deliveryService, etc.)
           │
           ▼
[ API Client / Mock Storage Adapter ] (Persistent localStorage + simulated async latency)
           │
           ▼ (Future Migration Path)
[ Spring Boot REST Controller -> Spring Data JPA -> MySQL Database ]
```

### React Concepts Implemented:
- **Component Composition & Props**: Modular, reusable UI components (`Badge`, `Button`, `Input`, `Select`, `Modal`, `Pagination`, `SearchFilterBar`, `LoadingSkeleton`, `EmptyState`, `ConfirmDialog`).
- **Hooks & State Management**: `useState`, `useEffect`, `useMemo`, `useCallback`, and `useRef`.
- **Custom Hooks**:
  - `useAuth`: Exposes user state, roles, login, register, and 1-click role switching.
  - `useDebounce`: Real-time debouncing of search filters (e.g. 300ms) to prevent excessive filtering re-renders.
  - `useLocalStorage`: Reactive synchronization with browser storage.
  - `useFetch`: Generalized asynchronous fetch hook with loading, error, and refetch states.
  - `useTheme`: Persistent light/dark mode theme switching.
  - `useNotifications`: Real-time notification center and toast dispatch.
- **Context API**: `AuthContext`, `NotificationContext`, `ThemeContext`.
- **Protected & Role-Based Routes**: Enforces role access (`Driver`, `Dispatcher`, `Manager`, `Admin`) and redirects unauthorized attempts to a dedicated 403 screen.
- **Error Boundaries**: Class-based `ErrorBoundary` wrapper that intercepts runtime rendering exceptions with a recovery retry button.
- **Client-Side Validation & Business Rules**: Schema validation preventing duplicate vehicle registrations or driver licenses, past-date validations, and resource locking.

---

## 5. Important Business Rules Enforced

1. **Vehicle Assignment Locking**: Trips cannot be created with a vehicle that is currently `On Trip`, `Maintenance`, or `Inactive`.
2. **Driver Availability Locking**: Trips cannot be assigned to drivers who are `On Trip`, `Leave`, `Inactive`, or have an expired commercial driver license.
3. **Trip Lifecycle Integrity**: Completed trips cannot accept in-transit updates. Completing a trip automatically returns the vehicle and driver to `Available` status and increments the driver's completed trips counter.
4. **Delivery Protection Protocol**: A delivery marked as `Delivered` with signed proof cannot be reverted to earlier stages without an explicit supervisor correction protocol requiring justification and incident logging.
5. **Maintenance Impact**: Scheduling maintenance in `In Progress` status automatically takes the vehicle off duty and flags it as `Maintenance`. Completing the work order restores the vehicle to `Available`.
6. **Regulatory Expiry Alerts**: Driver licenses and vehicle fitness certificates expiring within 30 days are automatically surfaced with amber badges and notification center alerts.

---

## 6. Directory Structure

```
fleetflow-react/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # Badge, Button, Input, Modal, Pagination, SearchFilterBar, EmptyState, etc.
│   │   ├── layout/             # Header, Sidebar, DashboardLayout, NotificationDropdown
│   │   ├── vehicles/           # VehicleTable, VehicleCard, VehicleFormModal, VehicleDetailsModal, VehicleComparisonModal
│   │   ├── drivers/            # DriverTable, DriverCard, DriverFormModal, DriverProfileModal
│   │   ├── trips/              # TripTable, TripCard, CreateTripModal, TripStatusModal, LiveRouteMap, DispatchBoard
│   │   ├── deliveries/         # DeliveryTable, DeliveryTimeline, ProofOfDeliveryModal, StatusCorrectionModal, CreateDeliveryModal
│   │   ├── maintenance/        # MaintenanceTable, CreateMaintenanceModal
│   │   ├── fuel/               # FuelTable, CreateFuelModal
│   │   └── analytics/          # StatCard, MetricCharts, UtilizationGauge, DriverLeaderboard
│   ├── pages/
│   │   ├── public/             # LandingPage, PublicTrackingPage
│   │   ├── auth/               # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── driver/             # DriverDashboard, DriverTripsPage, DriverDeliveriesPage, DriverProfilePage
│   │   ├── operations/         # OperationsDashboard, TripPlanningPage, DispatchBoardPage, LiveTrackingPage, DeliveriesPage
│   │   ├── manager/            # ManagerDashboard, VehiclesPage, DriversPage, MaintenancePage, FuelPage, AnalyticsPage
│   │   ├── admin/              # AdminDashboard, UserManagementPage, MasterDataPage, SystemSettingsPage
│   │   └── shared/             # NotFoundPage, UnauthorizedPage
│   ├── routes/                 # AppRoutes, ProtectedRoute
│   ├── context/                # AuthContext, NotificationContext, ThemeContext
│   ├── hooks/                  # useAuth, useDebounce, useLocalStorage, useFetch
│   ├── services/
│   │   ├── api/                # apiClient, mockStorage (with latency & error injection simulation)
│   │   ├── authService.js
│   │   ├── vehicleService.js
│   │   ├── driverService.js
│   │   ├── tripService.js
│   │   ├── deliveryService.js
│   │   ├── maintenanceService.js
│   │   ├── fuelService.js
│   │   ├── analyticsService.js
│   │   └── notificationService.js
│   ├── utils/                  # constants, dateUtils, formatters, validators, exportCsv
│   ├── data/                   # Initial seed data for vehicles, drivers, trips, fuel, and users
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
```

---

## 7. Demo Accounts & Quick Switcher

FleetFlow includes a **Quick Demo Switcher** directly in the top navigation bar, allowing immediate switching between perspectives without tedious logins:

| Role | Name | Email | Password | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Fleet Manager** | Rohit Sharma | `manager@fleetflow.io` | `password123` | Executive KPIs, vehicle/driver CRUD, fuel, maintenance, analytics |
| **Operations Dispatcher** | Sarah Jenkins | `dispatcher@fleetflow.io`| `password123` | Trip planning, live Kanban board, route tracking, delivery monitoring |
| **Commercial Driver** | Ajay Kumar | `driver@fleetflow.io` | `password123` | Driver cockpit, active trip progress, digital e-POD signature capture |
| **Platform Admin** | Vikram Mehta | `admin@fleetflow.io` | `password123` | User access control, master hubs, database reset, simulated API failure |

---

## 8. Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/your-username/fleetflow-react.git
cd fleetflow-react

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 9. Full-Stack Integration (Spring Boot REST API + React)

The project now includes an enterprise **Java Spring Boot 3.3.4** backend located in the `../fleetflow-backend` directory, delivering complete full-stack integration with automatic fallback support.

### Dual-Mode Architecture & Auto-Detection
The frontend `apiClient.js` automatically probes `http://localhost:8080/api/v1` on startup:
1. **When Spring Boot is running**: React transparently routes all REST operations (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) to the Spring Boot backend and persists data in H2/MySQL. A live green badge **"Spring Boot Active"** appears in the header.
2. **When Spring Boot is offline**: React smoothly falls back to the client-side persistent storage with zero crashes or broken UI. The header displays **"Mock DB Active"**.
3. **Manual Overrides**: Users can click the backend badge in the top navigation bar to force Spring Boot mode, force Mock mode, or re-test live connectivity at any time.

### How to Run Full-Stack (Frontend + Backend)

#### Step 1: Start the Spring Boot Backend (Port 8080)
```bash
cd ../fleetflow-backend
mvn spring-boot:run
# Or on Windows using wrapper:
# .\mvnw.cmd spring-boot:run
```
*Backend endpoints will be live at `http://localhost:8080/api/v1` and H2 console at `http://localhost:8080/api/v1/h2-console`.*

#### Step 2: Start the React Frontend (Port 3000)
```bash
cd fleetflow-react
npm run dev
```
*The Vite development server runs on `http://localhost:3000` with an automatic reverse proxy forwarding `/api/v1` requests to port 8080.*

---

## 10. Roadmap & Enterprise Progression

| Phase | Technology | Architecture & Status |
| :--- | :--- | :--- |
| **Stage 1** | **React + Mock REST API** | ✅ **Complete**: 15+ interactive pages, responsive Tailwind CSS, role switches, client persistence. |
| **Stage 2** | **Java Spring Boot REST API** | ✅ **Complete**: Spring Boot 3.3.4 backend with full REST controllers, DTOs, and transaction services. |
| **Stage 3** | **Spring Data JPA + H2/MySQL** | ✅ **Complete**: 10 JPA entities, repository interfaces, pre-seeded sample data, dual H2 & MySQL profiles. |
| **Stage 4** | **Spring Security + JWT** | Planned: Stateless JWT validation, `@PreAuthorize` method security. |
| **Stage 5** | **Real GPS Telemetry** | Planned: WebSocket / MQTT streaming from hardware IoT GPS OBD-II trackers into Spring Boot. |
| **Stage 6** | **AI Logistics Integration** | Planned: Spring Boot AI integration (Gemini API / Vertex AI) for automated route dispatch optimization and predictive maintenance. |

---

## 11. Answers to 18 Viva / Evaluation Questions

<details>
<summary><strong>Click to expand answers to all 18 technical viva questions</strong></summary>

### 1. Why did you choose React for FleetFlow?
React was selected for its component-based architecture, declarative state management, virtual DOM performance, and rich ecosystem. In a complex logistics dashboard with rapidly changing telemetry (velocities, coordinates, trip progress, notification toasts), React allows localized re-rendering without refreshing the whole page.

### 2. How did you structure the application into domains/components?
The codebase follows a domain-driven structure under `src/`:
- `components/common/`: Reusable primitive UI atoms (buttons, badges, inputs, modals, pagination).
- Domain folders (`vehicles/`, `drivers/`, `trips/`, `deliveries/`, `maintenance/`, `fuel/`, `analytics/`): Contain feature-specific tables, cards, and modal dialogs.
- `services/`: Encapsulates all domain-specific API calls away from the UI.
- `pages/`: Grouped by role (`manager/`, `operations/`, `driver/`, `admin/`, `public/`).

### 3. Why are API calls kept inside service files?
Keeping API logic in dedicated service files follows the **Single Responsibility Principle** and **Separation of Concerns**. UI components should only care about rendering and user interaction, not HTTP methods or endpoint URLs. This design allows swapping the mock localStorage backend with a Spring Boot REST API by modifying only the service layer, requiring zero rewrites in page components.

### 4. Where did you use Context API and why?
- `AuthContext`: Manages user credentials, active role permissions, login/logout, and demo role switching across the application.
- `NotificationContext`: Manages system-wide alerts, unread counts, and real-time toast alerts.
- `ThemeContext`: Synchronizes Dark/Light mode theme state with `document.documentElement` and localStorage.

### 5. How do protected and role-based routes work?
The `ProtectedRoute` component inspects the current authentication state from `useAuth`. If the user is unauthenticated, it redirects them to `/auth/login`. If the route requires specific roles (e.g. `['admin']` or `['manager']`) and the current user lacks them, it redirects to the `/unauthorized` (403) page.

### 6. How do you prevent assigning an unavailable vehicle?
When planning a new trip in `CreateTripModal.jsx` and `tripService.js`:
1. The vehicle dropdown lists vehicles along with their current status.
2. The `validateTrip` validator and `tripService.create` method explicitly check `vehicle.status === VEHICLE_STATUS.AVAILABLE`. If a vehicle is `On Trip` or `Maintenance`, trip creation is rejected with an explanatory validation error.

### 7. How do you prevent assigning an unavailable driver?
Similarly, `driverService` and `tripService` enforce:
1. `driver.status === DRIVER_STATUS.AVAILABLE`.
2. The driver's commercial license expiration date is checked; drivers with expired licenses cannot be assigned.

### 8. How does trip status affect vehicle/driver availability?
- When a trip becomes `Assigned` or `In Transit`, the assigned vehicle and driver status are updated to `Assigned` or `On Trip`, locking them from other dispatches.
- When a trip transitions to `Completed` or `Cancelled`, `tripService.updateStatus` automatically sets both the vehicle and driver back to `Available`, updates the vehicle odometer, and increments the driver's completed trips count.

### 9. How does your delivery tracking timeline work?
Each consignment contains an `events` array of chronological milestones (`Manifest Created`, `Picked Up`, `In Transit`, `Delivered`). As the delivery status updates, a new timestamped event is appended. Delivered shipments store electronic proof-of-delivery (e-POD) with consignee name and timestamp.

### 10. How do search, filters, sorting and pagination work?
1. **Search**: Controlled input passed through the `useDebounce` hook (300ms delay) to prevent UI lag.
2. **Filters**: Category dropdowns (status, vehicle type, fuel type) filter the in-memory array.
3. **Sorting**: Array `sort()` comparing strings (`localeCompare`) or numbers based on active `sortBy` and `sortOrder`.
4. **Pagination**: Computes total pages via `Math.ceil(total / pageSize)` and slices data using `useMemo` for smooth page transitions.

### 11. How do you calculate dashboard metrics?
Metrics are calculated dynamically from actual data records in `analyticsService.js`:
- Active vehicles, drivers on duty, active trips, and delayed deliveries are computed using array `.filter()`.
- Fleet Capacity Utilization is computed as: `((vehiclesOnTrip + vehiclesAssigned) / operableFleet) * 100`.
- Fuel and maintenance totals use `.reduce()`.

### 12. How do you handle loading, error and empty states?
- **Loading**: `TableSkeleton`, `CardSkeleton`, and `MetricSkeleton` animated pulse skeletons.
- **Error**: Try/catch blocks in services, form error banners, global `ErrorBoundary`, and a simulated API network failure toggle in admin settings.
- **Empty States**: Reusable `EmptyState` component displaying an icon, contextual description, and action button.

### 13. How would you replace the mock API with Spring Boot?
1. Change the base URL in `apiClient.js` to the Spring Boot host (e.g. `http://localhost:8080/api/v1`).
2. Replace `mockStorage.get/set` in service functions with native `fetch` or `axios` HTTP calls (`GET /api/v1/vehicles`, `POST /api/v1/trips`, etc.). No changes required in React components.

### 14. How would MySQL relationships map to the React data?
- `vehicles` table (1-to-many) -> `trips` table via `vehicle_id`.
- `drivers` table (1-to-many) -> `trips` table via `driver_id`.
- `trips` table (1-to-many) -> `deliveries` table via `trip_id`.
- `vehicles` table (1-to-many) -> `maintenance` and `fuel_records` via `vehicle_id`.

### 15. How would Spring Security/JWT change authentication?
`authService.login()` would send a POST request with credentials to `/api/v1/auth/login`. Spring Boot verifies credentials with BCrypt and returns a signed JWT containing user claims and roles. The React app stores the JWT in `localStorage` and includes it in the `Authorization: Bearer <token>` header for subsequent requests.

### 16. Where would you integrate AI in this platform?
On the backend (Spring Boot) connecting to Gemini API:
1. **AI Route & Delay Risk Predictor**: Analyze historical traffic, distance, and weather signals to predict delivery delay probability.
2. **AI Maintenance Assistant**: Recommend preventive service intervals based on vehicle odometer rate and historical service frequency.
3. **AI Dispatcher Assistant**: Automatically recommend optimal driver-vehicle pairs matching cargo weight to vehicle payload limits.

### 17. Why should AI/API keys not be exposed in React?
Client-side JavaScript code is fully inspectable in browser dev tools. Exposing private API keys in React allows malicious users to steal credentials, deplete quota, or gain unauthorized data access. AI and external service calls must always be proxied through a secure backend.

### 18. How would you scale FleetFlow for thousands of vehicles and active trips?
1. **Server-side Pagination & Filtering**: Move search, filter, and pagination logic to the Spring Boot REST endpoints with SQL `LIMIT` and `OFFSET` queries.
2. **Database Indexing**: Add database indexes on `registration_no`, `driver_id`, `status`, and `planned_start`.
3. **Caching**: Utilize Redis on the backend for frequently read dashboard KPI summaries.
4. **WebSocket Telemetry**: Use WebSockets (STOMP/MQTT) instead of polling to stream live vehicle GPS coordinates efficiently.
5. **Code Splitting**: Implement `React.lazy` and dynamic imports for role-specific routes to keep client bundle sizes low.

</details>

---

## 11. Git Commit History

The repository follows a clean, logical 16-stage commit history matching the project rubric:
1. `feat: initialize React project and architecture with Tailwind CSS and Vite`
2. `feat: add layout, routing and role-based structure with sidebar and header`
3. `feat: build authentication simulation and demo role switcher`
4. `feat: build vehicle management with CRUD, specs, and document tracking`
5. `feat: build driver management with CDL verification and availability tracking`
6. `feat: build trip planning, assignment validation and status workflow`
7. `feat: build delivery consignment tracking, timeline and electronic POD`
8. `feat: add preventive maintenance module with vehicle duty locking`
9. `feat: add fuel records, volume logs and energy consumption summaries`
10. `feat: build executive dashboard, KPI cards and utilization gauge`
11. `feat: add operational notifications center, alert badges and toast popups`
12. `feat: add debounced search, multi-criteria filters, sorting and pagination`
13. `feat: add loading skeletons, empty states, error boundary and API error simulator`
14. `feat: responsive design refinements, dark/light theme and accessibility`
15. `feat: add Kanban dispatch board, live route map simulation and vehicle comparison`
16. `docs: add comprehensive README with architecture, roadmap and viva guide`

---

## 12. Evaluation Summary & Definition of Done

- [x] **Full Role-Based Workflows**: Guest, Driver, Operations Dispatcher, Fleet Manager, and Platform Admin.
- [x] **Vehicle & Driver Management**: Complete CRUD, search, filter, sort, and pagination.
- [x] **Resource Availability Enforcement**: Prevents assigning in-maintenance or on-trip vehicles and busy drivers.
- [x] **Route Tracking Simulation**: Interactive SVG highway map with simulated movement and telemetry HUD.
- [x] **e-POD & Correction Flow**: Digital signature capture and supervisor-authorized status correction protocol.
- [x] **Maintenance & Fuel Modules**: Service work orders and fuel economy logs.
- [x] **Dynamic Dashboard & Analytics**: Computed fleet utilization %, on-time delivery rates, and charts.
- [x] **Architecture Decoupling**: 100% separated UI and Service/API layer ready for Spring Boot + MySQL.
- [x] **Code Quality**: Clean build, zero runtime errors, responsive layout, Dark/Light mode.

---

**FLEETFLOW — Move smarter. Operate better.**

