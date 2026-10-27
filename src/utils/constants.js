export const ROLES = {
  GUEST: 'guest',
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  ON_TRIP: 'On Trip',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive'
};

export const VEHICLE_TYPES = [
  'Heavy Truck',
  'Medium Duty Truck',
  'Delivery Van',
  'Refrigerated Van',
  'Electric Van',
  'Flatbed Trailer'
];

export const FUEL_TYPES = [
  'Diesel',
  'Electric',
  'CNG',
  'Petrol'
];

export const DRIVER_STATUS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  ON_TRIP: 'On Trip',
  LEAVE: 'Leave',
  INACTIVE: 'Inactive'
};

export const TRIP_STATUS = {
  PLANNED: 'Planned',
  ASSIGNED: 'Assigned',
  IN_TRANSIT: 'In Transit',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed'
};

export const DELIVERY_STATUS = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  DELAYED: 'Delayed'
};

export const DELIVERY_PRIORITY = {
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent'
};

export const MAINTENANCE_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

export const SERVICE_TYPES = [
  'Oil Change',
  'Tire Replacement',
  'Brake Inspection',
  'General Service',
  'Engine Diagnostic',
  'Battery & Electrical',
  'Transmission Flush'
];

export const DEMO_ACCOUNTS = [
  {
    role: ROLES.MANAGER,
    name: 'Rohit Sharma',
    email: 'manager@fleetflow.io',
    password: 'password123',
    title: 'Senior Fleet Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: ROLES.DISPATCHER,
    name: 'Sarah Jenkins',
    email: 'dispatcher@fleetflow.io',
    password: 'password123',
    title: 'Operations Coordinator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: ROLES.DRIVER,
    name: 'Ajay Kumar',
    email: 'driver@fleetflow.io',
    password: 'password123',
    title: 'Senior Fleet Driver (Heavy Commercial)',
    driverId: 'DRV-1001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: ROLES.ADMIN,
    name: 'Vikram Mehta',
    email: 'admin@fleetflow.io',
    password: 'password123',
    title: 'Systems & Master Data Admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const STATUS_COLORS = {
  // Common
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',

  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  'On Trip': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
  'Picked Up': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',

  Assigned: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
  Planned: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  Scheduled: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  Paused: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',

  Delayed: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
  Maintenance: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
  Failed: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
  Cancelled: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  Inactive: 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
  Leave: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',

  // Priorities
  Normal: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  High: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300',
  Urgent: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300'
};
