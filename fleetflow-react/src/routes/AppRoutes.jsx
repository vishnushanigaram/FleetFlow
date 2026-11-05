import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ROLES } from '../utils/constants';

// Public pages
import { LandingPage } from '../pages/public/LandingPage';
import { PublicTrackingPage } from '../pages/public/PublicTrackingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Manager pages
import { ManagerDashboard } from '../pages/manager/ManagerDashboard';
import { VehiclesPage } from '../pages/manager/VehiclesPage';
import { DriversPage } from '../pages/manager/DriversPage';
import { MaintenancePage } from '../pages/manager/MaintenancePage';
import { FuelPage } from '../pages/manager/FuelPage';
import { AnalyticsPage } from '../pages/manager/AnalyticsPage';

// Operations pages
import { OperationsDashboard } from '../pages/operations/OperationsDashboard';
import { TripPlanningPage } from '../pages/operations/TripPlanningPage';
import { DispatchBoardPage } from '../pages/operations/DispatchBoardPage';
import { LiveTrackingPage } from '../pages/operations/LiveTrackingPage';
import { DeliveriesPage } from '../pages/operations/DeliveriesPage';

// Driver pages
import { DriverDashboard } from '../pages/driver/DriverDashboard';
import { DriverTripsPage } from '../pages/driver/DriverTripsPage';
import { DriverDeliveriesPage } from '../pages/driver/DriverDeliveriesPage';
import { DriverProfilePage } from '../pages/driver/DriverProfilePage';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { MasterDataPage } from '../pages/admin/MasterDataPage';
import { SystemSettingsPage } from '../pages/admin/SystemSettingsPage';

// Shared
import { NotFoundPage } from '../pages/shared/NotFoundPage';
import { UnauthorizedPage } from '../pages/shared/UnauthorizedPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/track-shipment" element={<PublicTrackingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Dashboard Core */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Executive & Common Routes */}
          <Route path="/dashboard" element={<ManagerDashboard />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/trips" element={<TripPlanningPage />} />
          <Route path="/dispatch" element={<DispatchBoardPage />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/fuel" element={<FuelPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Operations Dedicated Routes */}
          <Route path="/operations" element={<OperationsDashboard />} />
          <Route path="/operations/planning" element={<TripPlanningPage />} />

          {/* Driver Console Routes */}
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/trips" element={<DriverTripsPage />} />
          <Route path="/driver/deliveries" element={<DriverDeliveriesPage />} />
          <Route path="/driver/profile" element={<DriverProfilePage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/master-data" element={<MasterDataPage />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
          </Route>

          {/* Fallback internal routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
      </Route>

      {/* Global 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
