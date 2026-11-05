import { 
  ROLES, 
  VEHICLE_STATUS, 
  DRIVER_STATUS, 
  TRIP_STATUS, 
  DELIVERY_STATUS, 
  DELIVERY_PRIORITY, 
  MAINTENANCE_STATUS 
} from '../utils/constants';

export const INITIAL_USERS = [
  {
    id: 'USR-01',
    name: 'Rohit Sharma',
    email: 'manager@fleetflow.io',
    role: ROLES.MANAGER,
    title: 'Senior Fleet Director',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 492-1084',
    joinedDate: '2023-03-15'
  },
  {
    id: 'USR-02',
    name: 'Sarah Jenkins',
    email: 'dispatcher@fleetflow.io',
    role: ROLES.DISPATCHER,
    title: 'Operations Coordinator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 391-7721',
    joinedDate: '2023-06-20'
  },
  {
    id: 'USR-03',
    name: 'Ajay Kumar',
    email: 'driver@fleetflow.io',
    role: ROLES.DRIVER,
    title: 'Senior Commercial Fleet Driver',
    status: 'Active',
    driverId: 'DRV-1001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    joinedDate: '2022-11-01'
  },
  {
    id: 'USR-04',
    name: 'Vikram Mehta',
    email: 'admin@fleetflow.io',
    role: ROLES.ADMIN,
    title: 'Lead Systems & Security Administrator',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 883-2910',
    joinedDate: '2022-01-10'
  }
];

export const INITIAL_VEHICLES = [
  {
    id: 'VEH-101',
    registrationNo: 'DL 1L AB 1234',
    type: 'Heavy Truck',
    model: 'Volvo FH16 540',
    capacity: 24000, // kg
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.ON_TRIP,
    odometer: 48250,
    year: 2023,
    fuelCapacity: 600,
    currentFuelLevel: 75,
    assignedDriverId: 'DRV-1001',
    assignedDriverName: 'Ajay Kumar',
    currentTripId: 'TRP-5001',
    documents: [
      { id: 'DOC-101', type: 'Commercial Insurance', number: 'POL-9923812', expiryDate: '2027-03-15' },
      { id: 'DOC-102', type: 'Fitness Certificate', number: 'FIT-2024-88', expiryDate: '2026-11-12' }, // Expiring soon!
      { id: 'DOC-103', type: 'PUC Certificate', number: 'PUC-88124', expiryDate: '2027-04-10' }
    ]
  },
  {
    id: 'VEH-102',
    registrationNo: 'HR 55 CD 5678',
    type: 'Medium Duty Truck',
    model: 'Mercedes-Benz Atego',
    capacity: 12000,
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.AVAILABLE,
    odometer: 62100,
    year: 2022,
    fuelCapacity: 320,
    currentFuelLevel: 88,
    assignedDriverId: null,
    assignedDriverName: null,
    currentTripId: null,
    documents: [
      { id: 'DOC-104', type: 'Commercial Insurance', number: 'POL-110928', expiryDate: '2027-06-20' },
      { id: 'DOC-105', type: 'Fitness Certificate', number: 'FIT-2024-34', expiryDate: '2027-08-14' }
    ]
  },
  {
    id: 'VEH-103',
    registrationNo: 'KA 03 EF 9012',
    type: 'Delivery Van',
    model: 'Ford Transit High Roof',
    capacity: 3500,
    fuelType: 'CNG',
    status: VEHICLE_STATUS.ON_TRIP,
    odometer: 31400,
    year: 2023,
    fuelCapacity: 120,
    currentFuelLevel: 62,
    assignedDriverId: 'DRV-1002',
    assignedDriverName: 'Priya Sharma',
    currentTripId: 'TRP-5002',
    documents: [
      { id: 'DOC-106', type: 'Commercial Insurance', number: 'POL-449102', expiryDate: '2026-11-04' }, // Expiring soon!
      { id: 'DOC-107', type: 'Fitness Certificate', number: 'FIT-2023-99', expiryDate: '2027-01-18' }
    ]
  },
  {
    id: 'VEH-104',
    registrationNo: 'MH 12 GH 3456',
    type: 'Heavy Truck',
    model: 'Scania R500 V8',
    capacity: 26000,
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.MAINTENANCE,
    odometer: 89300,
    year: 2021,
    fuelCapacity: 650,
    currentFuelLevel: 45,
    assignedDriverId: null,
    assignedDriverName: null,
    currentTripId: null,
    documents: [
      { id: 'DOC-108', type: 'Commercial Insurance', number: 'POL-782193', expiryDate: '2027-09-30' },
      { id: 'DOC-109', type: 'Fitness Certificate', number: 'FIT-2024-51', expiryDate: '2026-10-20' } // Past expiry!
    ]
  },
  {
    id: 'VEH-105',
    registrationNo: 'TN 09 IJ 7890',
    type: 'Electric Van',
    model: 'Rivian Commercial Delivery 700',
    capacity: 4500,
    fuelType: 'Electric',
    status: VEHICLE_STATUS.AVAILABLE,
    odometer: 14500,
    year: 2024,
    fuelCapacity: 135, // kWh
    currentFuelLevel: 94,
    assignedDriverId: null,
    assignedDriverName: null,
    currentTripId: null,
    documents: [
      { id: 'DOC-110', type: 'Commercial Insurance', number: 'POL-332910', expiryDate: '2027-12-01' },
      { id: 'DOC-111', type: 'EV Battery Warranty', number: 'BAT-2024-10', expiryDate: '2032-05-10' }
    ]
  },
  {
    id: 'VEH-106',
    registrationNo: 'UP 16 KL 2345',
    type: 'Refrigerated Van',
    model: 'Mercedes-Benz Sprinter 314',
    capacity: 4000,
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.ASSIGNED,
    odometer: 42150,
    year: 2023,
    fuelCapacity: 95,
    currentFuelLevel: 70,
    assignedDriverId: 'DRV-1003',
    assignedDriverName: 'Sunil Verma',
    currentTripId: 'TRP-5003',
    documents: [
      { id: 'DOC-112', type: 'Commercial Insurance', number: 'POL-883912', expiryDate: '2027-02-15' },
      { id: 'DOC-113', type: 'Cold Chain Cert', number: 'CC-901-2024', expiryDate: '2027-05-22' }
    ]
  },
  {
    id: 'VEH-107',
    registrationNo: 'WB 02 MN 6789',
    type: 'Flatbed Trailer',
    model: 'Tata Signa 4825.TK',
    capacity: 28000,
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.AVAILABLE,
    odometer: 57400,
    year: 2022,
    fuelCapacity: 400,
    currentFuelLevel: 80,
    assignedDriverId: null,
    assignedDriverName: null,
    currentTripId: null,
    documents: [
      { id: 'DOC-114', type: 'Commercial Insurance', number: 'POL-294019', expiryDate: '2027-04-14' }
    ]
  },
  {
    id: 'VEH-108',
    registrationNo: 'GJ 01 OP 1234',
    type: 'Delivery Van',
    model: 'Isuzu Reach Cargo',
    capacity: 3200,
    fuelType: 'Diesel',
    status: VEHICLE_STATUS.INACTIVE,
    odometer: 142000,
    year: 2019,
    fuelCapacity: 80,
    currentFuelLevel: 25,
    assignedDriverId: null,
    assignedDriverName: null,
    currentTripId: null,
    documents: [
      { id: 'DOC-115', type: 'Commercial Insurance', number: 'POL-100293', expiryDate: '2026-08-10' }
    ]
  }
];

export const INITIAL_DRIVERS = [
  {
    id: 'DRV-1001',
    name: 'Ajay Kumar',
    contact: '+1 (555) 234-5678',
    email: 'driver@fleetflow.io',
    licenseNumber: 'DL-908234-HMV',
    licenseCategory: 'Heavy Commercial (HMV)',
    licenseExpiry: '2027-08-15',
    experienceYears: 8,
    status: DRIVER_STATUS.ON_TRIP,
    rating: 4.9,
    safetyScore: 98,
    completedTrips: 142,
    delayedTrips: 3,
    totalDistance: 64200,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentTripId: 'TRP-5001',
    currentVehicleId: 'VEH-101'
  },
  {
    id: 'DRV-1002',
    name: 'Priya Sharma',
    contact: '+1 (555) 345-6789',
    email: 'priya.sharma@fleetflow.io',
    licenseNumber: 'DL-481920-LCV',
    licenseCategory: 'Light Commercial (LCV)',
    licenseExpiry: '2026-11-18', // Expiring soon!
    experienceYears: 5,
    status: DRIVER_STATUS.ON_TRIP,
    rating: 4.8,
    safetyScore: 96,
    completedTrips: 89,
    delayedTrips: 1,
    totalDistance: 38100,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    currentTripId: 'TRP-5002',
    currentVehicleId: 'VEH-103'
  },
  {
    id: 'DRV-1003',
    name: 'Sunil Verma',
    contact: '+1 (555) 456-7890',
    email: 'sunil.verma@fleetflow.io',
    licenseNumber: 'DL-339102-HMV',
    licenseCategory: 'Heavy Commercial (HMV)',
    licenseExpiry: '2027-11-30',
    experienceYears: 11,
    status: DRIVER_STATUS.ASSIGNED,
    rating: 4.7,
    safetyScore: 94,
    completedTrips: 215,
    delayedTrips: 6,
    totalDistance: 95400,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    currentTripId: 'TRP-5003',
    currentVehicleId: 'VEH-106'
  },
  {
    id: 'DRV-1004',
    name: 'Marcus Vance',
    contact: '+1 (555) 567-8901',
    email: 'marcus.v@fleetflow.io',
    licenseNumber: 'DL-119283-LCV',
    licenseCategory: 'Light Commercial (LCV)',
    licenseExpiry: '2028-01-25',
    experienceYears: 4,
    status: DRIVER_STATUS.AVAILABLE,
    rating: 4.6,
    safetyScore: 95,
    completedTrips: 76,
    delayedTrips: 2,
    totalDistance: 29800,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    currentTripId: null,
    currentVehicleId: null
  },
  {
    id: 'DRV-1005',
    name: 'Elena Rostova',
    contact: '+1 (555) 678-9012',
    email: 'elena.r@fleetflow.io',
    licenseNumber: 'DL-882736-HMV',
    licenseCategory: 'Heavy Commercial (HMV)',
    licenseExpiry: '2026-11-05', // Expiring soon!
    experienceYears: 7,
    status: DRIVER_STATUS.AVAILABLE,
    rating: 4.9,
    safetyScore: 99,
    completedTrips: 118,
    delayedTrips: 0,
    totalDistance: 54100,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    currentTripId: null,
    currentVehicleId: null
  },
  {
    id: 'DRV-1006',
    name: 'David Chen',
    contact: '+1 (555) 789-0123',
    email: 'david.chen@fleetflow.io',
    licenseNumber: 'DL-552199-LCV',
    licenseCategory: 'Light Commercial (LCV)',
    licenseExpiry: '2026-10-15', // Past expiry!
    experienceYears: 3,
    status: DRIVER_STATUS.LEAVE,
    rating: 4.2,
    safetyScore: 89,
    completedTrips: 42,
    delayedTrips: 5,
    totalDistance: 16800,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    currentTripId: null,
    currentVehicleId: null
  }
];

export const INITIAL_TRIPS = [
  {
    id: 'TRP-5001',
    vehicleId: 'VEH-101',
    vehicleReg: 'DL 1L AB 1234',
    driverId: 'DRV-1001',
    driverName: 'Ajay Kumar',
    origin: 'Chicago Central Fulfillment Hub (IL)',
    destination: 'Detroit Automotive Logistics Center (MI)',
    plannedStart: '2026-10-26T08:00:00',
    actualStart: '2026-10-26T08:15:00',
    estimatedArrival: '2026-10-26T16:30:00',
    distanceKm: 460,
    currentSpeed: 62,
    cargoLoad: 'Precision Powertrain Assemblies (18,500 kg)',
    notes: 'Urgent tier-1 automotive manufacturing delivery.',
    status: TRIP_STATUS.IN_TRANSIT,
    isDelayed: false,
    progressPercent: 68,
    originCoords: { lat: 41.8781, lng: -87.6298, city: 'Chicago, IL' },
    destCoords: { lat: 42.3314, lng: -83.0458, city: 'Detroit, MI' },
    currentCoords: { lat: 42.152, lng: -84.551 },
    statusHistory: [
      { id: 'SH-1', status: 'Planned', timestamp: '2026-10-25T14:00:00Z', note: 'Trip route planned and approved', updatedBy: 'Sarah Jenkins (Dispatcher)' },
      { id: 'SH-2', status: 'Assigned', timestamp: '2026-10-25T16:30:00Z', note: 'Driver Ajay Kumar and Vehicle DL 1L AB 1234 assigned', updatedBy: 'Sarah Jenkins (Dispatcher)' },
      { id: 'SH-3', status: 'In Transit', timestamp: '2026-10-26T08:15:00Z', note: 'Pre-trip inspection passed. Departed Chicago Hub.', updatedBy: 'Ajay Kumar (Driver)' }
    ]
  },
  {
    id: 'TRP-5002',
    vehicleId: 'VEH-103',
    vehicleReg: 'KA 03 EF 9012',
    driverId: 'DRV-1002',
    driverName: 'Priya Sharma',
    origin: 'Seattle Metro Hub (WA)',
    destination: 'Portland Express Center (OR)',
    plannedStart: '2026-10-26T07:30:00',
    actualStart: '2026-10-26T07:40:00',
    estimatedArrival: '2026-10-26T12:45:00',
    distanceKm: 280,
    currentSpeed: 55,
    cargoLoad: 'Medical Devices & Diagnostics (2,100 kg)',
    notes: 'Requires temperature-controlled handling.',
    status: TRIP_STATUS.DELAYED,
    isDelayed: true,
    progressPercent: 45,
    originCoords: { lat: 47.6062, lng: -122.3321, city: 'Seattle, WA' },
    destCoords: { lat: 45.5152, lng: -122.6784, city: 'Portland, OR' },
    currentCoords: { lat: 46.501, lng: -122.880 },
    statusHistory: [
      { id: 'SH-4', status: 'Planned', timestamp: '2026-10-25T18:00:00Z', note: 'Planned morning express dispatch', updatedBy: 'Sarah Jenkins (Dispatcher)' },
      { id: 'SH-5', status: 'Assigned', timestamp: '2026-10-25T19:00:00Z', note: 'Vehicle and Driver paired', updatedBy: 'Sarah Jenkins (Dispatcher)' },
      { id: 'SH-6', status: 'In Transit', timestamp: '2026-10-26T07:40:00Z', note: 'Departed Seattle facility', updatedBy: 'Priya Sharma (Driver)' },
      { id: 'SH-7', status: 'Delayed', timestamp: '2026-10-26T10:15:00Z', note: 'Heavy Interstate-5 congestion due to weather condition', updatedBy: 'Priya Sharma (Driver)' }
    ]
  },
  {
    id: 'TRP-5003',
    vehicleId: 'VEH-106',
    vehicleReg: 'UP 16 KL 2345',
    driverId: 'DRV-1003',
    driverName: 'Sunil Verma',
    origin: 'Dallas Cold Storage Terminal (TX)',
    destination: 'Austin Grocery Hub (TX)',
    plannedStart: '2026-10-26T14:00:00',
    actualStart: null,
    estimatedArrival: '2026-10-26T18:30:00',
    distanceKm: 315,
    currentSpeed: 0,
    cargoLoad: 'Fresh Organic Dairy & Produce (3,400 kg)',
    notes: 'Maintain refrigeration chamber at 2-4°C.',
    status: TRIP_STATUS.ASSIGNED,
    isDelayed: false,
    progressPercent: 0,
    originCoords: { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX' },
    destCoords: { lat: 30.2672, lng: -97.7431, city: 'Austin, TX' },
    currentCoords: { lat: 32.7767, lng: -96.7970 },
    statusHistory: [
      { id: 'SH-8', status: 'Planned', timestamp: '2026-10-26T09:00:00Z', note: 'Scheduled afternoon refrigerated transport', updatedBy: 'Sarah Jenkins (Dispatcher)' },
      { id: 'SH-9', status: 'Assigned', timestamp: '2026-10-26T09:45:00Z', note: 'Driver Sunil Verma assigned to UP 16 KL 2345', updatedBy: 'Sarah Jenkins (Dispatcher)' }
    ]
  },
  {
    id: 'TRP-5004',
    vehicleId: 'VEH-102',
    vehicleReg: 'HR 55 CD 5678',
    driverId: 'DRV-1004',
    driverName: 'Marcus Vance',
    origin: 'Philadelphia Logistics Yard (PA)',
    destination: 'Boston Distribution Center (MA)',
    plannedStart: '2026-10-24T06:00:00',
    actualStart: '2026-10-24T06:10:00',
    estimatedArrival: '2026-10-24T14:30:00',
    distanceKm: 510,
    currentSpeed: 0,
    cargoLoad: 'Retail Apparel & Footwear (8,200 kg)',
    notes: 'Completed ahead of schedule.',
    status: TRIP_STATUS.COMPLETED,
    isDelayed: false,
    progressPercent: 100,
    originCoords: { lat: 39.9526, lng: -75.1652, city: 'Philadelphia, PA' },
    destCoords: { lat: 42.3601, lng: -71.0589, city: 'Boston, MA' },
    currentCoords: { lat: 42.3601, lng: -71.0589 },
    statusHistory: [
      { id: 'SH-10', status: 'Planned', timestamp: '2026-10-23T11:00:00Z', note: 'Trip planned', updatedBy: 'Sarah Jenkins' },
      { id: 'SH-11', status: 'Assigned', timestamp: '2026-10-23T15:00:00Z', note: 'Driver assigned', updatedBy: 'Sarah Jenkins' },
      { id: 'SH-12', status: 'In Transit', timestamp: '2026-10-24T06:10:00Z', note: 'Departed Philadelphia', updatedBy: 'Marcus Vance' },
      { id: 'SH-13', status: 'Completed', timestamp: '2026-10-24T14:15:00Z', note: 'Safely delivered and verified at Boston Center', updatedBy: 'Marcus Vance' }
    ]
  },
  {
    id: 'TRP-5005',
    vehicleId: 'VEH-105',
    vehicleReg: 'TN 09 IJ 7890',
    driverId: 'DRV-1005',
    driverName: 'Elena Rostova',
    origin: 'Atlanta Distribution Annex (GA)',
    destination: 'Charlotte Sorting Facility (NC)',
    plannedStart: '2026-10-25T05:30:00',
    actualStart: '2026-10-25T05:45:00',
    estimatedArrival: '2026-10-25T11:30:00',
    distanceKm: 395,
    currentSpeed: 0,
    cargoLoad: 'Consumer Electronics & Tablets (3,800 kg)',
    notes: 'Zero emission EV transport route.',
    status: TRIP_STATUS.COMPLETED,
    isDelayed: false,
    progressPercent: 100,
    originCoords: { lat: 33.7490, lng: -84.3880, city: 'Atlanta, GA' },
    destCoords: { lat: 35.2271, lng: -80.8431, city: 'Charlotte, NC' },
    currentCoords: { lat: 35.2271, lng: -80.8431 },
    statusHistory: [
      { id: 'SH-14', status: 'Planned', timestamp: '2026-10-24T16:00:00Z', note: 'EV route calculated with fast charge stop', updatedBy: 'Sarah Jenkins' },
      { id: 'SH-15', status: 'In Transit', timestamp: '2026-10-25T05:45:00Z', note: 'In transit', updatedBy: 'Elena Rostova' },
      { id: 'SH-16', status: 'Completed', timestamp: '2026-10-25T11:20:00Z', note: 'Delivered in full', updatedBy: 'Elena Rostova' }
    ]
  }
];

export const INITIAL_DELIVERIES = [
  {
    id: 'DEL-8001',
    trackingId: 'FL-TRK-8921',
    tripId: 'TRP-5001',
    recipient: 'Apex Precision Automotive Works',
    recipientContact: 'Receiving Dock Gate 4, +1 313-555-0199',
    origin: 'Chicago Central Fulfillment Hub (IL)',
    destination: 'Detroit Automotive Logistics Center (MI)',
    itemsDescription: '4 Heavy Pallets Precision Gearboxes & Axle Assemblies',
    weightKg: 4200,
    priority: DELIVERY_PRIORITY.URGENT,
    status: DELIVERY_STATUS.IN_TRANSIT,
    eta: '2026-10-26T16:30:00',
    proofOfDelivery: null,
    delayReason: null,
    events: [
      { time: '2026-10-25 14:00', title: 'Manifest Created', desc: 'Electronic booking confirmed', status: 'Pending' },
      { time: '2026-10-26 07:45', title: 'Picked Up & Inspected', desc: 'Loaded into trailer DL 1L AB 1234', status: 'Picked Up' },
      { time: '2026-10-26 08:15', title: 'Departed Facility', desc: 'En route via I-94 East corridor', status: 'In Transit' }
    ]
  },
  {
    id: 'DEL-8002',
    trackingId: 'FL-TRK-7412',
    tripId: 'TRP-5002',
    recipient: 'Pacific Northwest Health Systems',
    recipientContact: 'Laboratory Services Bld, +1 503-555-0182',
    origin: 'Seattle Metro Hub (WA)',
    destination: 'Portland Express Center (OR)',
    itemsDescription: '6 Crates Cryogenic Diagnostic Kits',
    weightKg: 850,
    priority: DELIVERY_PRIORITY.HIGH,
    status: DELIVERY_STATUS.DELAYED,
    eta: '2026-10-26T14:15:00', // Pushed back due to delay
    proofOfDelivery: null,
    delayReason: 'Severe I-5 interstate accident closure and winter rainfall slowdown.',
    events: [
      { time: '2026-10-25 18:30', title: 'Consignment Staged', desc: 'Staged at cold bay A4', status: 'Pending' },
      { time: '2026-10-26 07:15', title: 'Picked Up', desc: 'Securely loaded in van KA 03 EF 9012', status: 'Picked Up' },
      { time: '2026-10-26 07:40', title: 'In Transit', desc: 'Departed Seattle South', status: 'In Transit' },
      { time: '2026-10-26 10:15', title: 'Traffic Exception Reported', desc: 'Driver reported standstill congestion at Centralia, WA', status: 'Delayed' }
    ]
  },
  {
    id: 'DEL-8003',
    trackingId: 'FL-TRK-6309',
    tripId: 'TRP-5003',
    recipient: 'Central Texas Natural Grocers Co-op',
    recipientContact: 'Back Warehouse Entrance, +1 512-555-0144',
    origin: 'Dallas Cold Storage Terminal (TX)',
    destination: 'Austin Grocery Hub (TX)',
    itemsDescription: '8 Pallets Artisan Farm Dairy & Greek Yogurt',
    weightKg: 3400,
    priority: DELIVERY_PRIORITY.NORMAL,
    status: DELIVERY_STATUS.PENDING,
    eta: '2026-10-26T18:30:00',
    proofOfDelivery: null,
    delayReason: null,
    events: [
      { time: '2026-10-26 09:00', title: 'Order Registered', desc: 'Assigned to Trip TRP-5003', status: 'Pending' }
    ]
  },
  {
    id: 'DEL-8004',
    trackingId: 'FL-TRK-5100',
    tripId: 'TRP-5004',
    recipient: 'Beacon Hill Apparel Warehouse',
    recipientContact: 'Receiving Dock 12, +1 617-555-0133',
    origin: 'Philadelphia Logistics Yard (PA)',
    destination: 'Boston Distribution Center (MA)',
    itemsDescription: '25 Cartons Premium Winter Outerwear',
    weightKg: 2800,
    priority: DELIVERY_PRIORITY.NORMAL,
    status: DELIVERY_STATUS.DELIVERED,
    eta: '2026-10-24T14:30:00',
    proofOfDelivery: {
      signeeName: 'Arthur Pendelton',
      timestamp: '2026-10-24T14:12:00Z',
      notes: 'All cartons counted and received in immaculate condition. Seal intact.'
    },
    delayReason: null,
    events: [
      { time: '2026-10-23 11:30', title: 'Manifest Approved', desc: 'Dock reserved', status: 'Pending' },
      { time: '2026-10-24 06:10', title: 'Dispatched', desc: 'En route to Boston', status: 'In Transit' },
      { time: '2026-10-24 13:30', title: 'Out for Delivery', desc: 'Entering metropolitan delivery sector', status: 'Out for Delivery' },
      { time: '2026-10-24 14:12', title: 'Delivered', desc: 'Signed by Arthur Pendelton', status: 'Delivered' }
    ]
  },
  {
    id: 'DEL-8005',
    trackingId: 'FL-TRK-4911',
    tripId: 'TRP-5005',
    recipient: 'Carolina Tech Supply Depo',
    recipientContact: 'Security Desk Gate 1, +1 704-555-0177',
    origin: 'Atlanta Distribution Annex (GA)',
    destination: 'Charlotte Sorting Facility (NC)',
    itemsDescription: '15 Pallets 4K Ultra Displays & Laptops',
    weightKg: 3800,
    priority: DELIVERY_PRIORITY.HIGH,
    status: DELIVERY_STATUS.DELIVERED,
    eta: '2026-10-25T11:30:00',
    proofOfDelivery: {
      signeeName: 'Marcus Bennett',
      timestamp: '2026-10-25T11:18:00Z',
      notes: 'Delivered on time via EV fleet, signatures verified.'
    },
    delayReason: null,
    events: [
      { time: '2026-10-24 16:30', title: 'Order Processed', desc: 'Picked and verified', status: 'Pending' },
      { time: '2026-10-25 05:45', title: 'Dispatched', desc: 'EV Transport initiated', status: 'In Transit' },
      { time: '2026-10-25 11:18', title: 'Delivered', desc: 'Consignee accepted shipment', status: 'Delivered' }
    ]
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'MNT-301',
    vehicleId: 'VEH-104',
    vehicleReg: 'MH 12 GH 3456',
    serviceType: 'Brake Inspection',
    status: MAINTENANCE_STATUS.IN_PROGRESS,
    scheduledDate: '2026-10-25',
    completedDate: null,
    odometer: 89300,
    cost: 580,
    notes: 'Driver reported front axle vibration during braking. Rotor replacement in progress.',
    serviceProvider: 'Continental Fleet Tech Services',
    technicianName: 'Dave Miller'
  },
  {
    id: 'MNT-302',
    vehicleId: 'VEH-103',
    vehicleReg: 'KA 03 EF 9012',
    serviceType: 'Oil Change',
    status: MAINTENANCE_STATUS.OVERDUE,
    scheduledDate: '2026-10-23',
    completedDate: null,
    odometer: 31400,
    cost: 160,
    notes: 'Scheduled 30,000 km standard synthetic oil & filter interval.',
    serviceProvider: 'Express QuickLube Hub',
    technicianName: 'Pending'
  },
  {
    id: 'MNT-303',
    vehicleId: 'VEH-101',
    vehicleReg: 'DL 1L AB 1234',
    serviceType: 'Tire Replacement',
    status: MAINTENANCE_STATUS.SCHEDULED,
    scheduledDate: '2026-10-30',
    completedDate: null,
    odometer: 48250,
    cost: 1250,
    notes: 'Rotate rear steer tires and fit new Michelin long-haul treads.',
    serviceProvider: 'Goodyear Commercial Tire Center',
    technicianName: 'Scheduled'
  },
  {
    id: 'MNT-304',
    vehicleId: 'VEH-102',
    vehicleReg: 'HR 55 CD 5678',
    serviceType: 'General Service',
    status: MAINTENANCE_STATUS.COMPLETED,
    scheduledDate: '2026-10-18',
    completedDate: '2026-10-19',
    odometer: 61500,
    cost: 420,
    notes: 'Comprehensive multi-point vehicle inspection. AC filter renewed.',
    serviceProvider: 'Mercedes Commercial Care',
    technicianName: 'Robert Vance'
  }
];

export const INITIAL_FUEL_RECORDS = [
  {
    id: 'FUL-401',
    vehicleId: 'VEH-101',
    vehicleReg: 'DL 1L AB 1234',
    date: '2026-10-25',
    quantity: 320, // liters
    cost: 448.00,
    odometer: 47900,
    fuelType: 'Diesel',
    station: 'Pilot Flying J Travel Plaza #41',
    driverName: 'Ajay Kumar'
  },
  {
    id: 'FUL-402',
    vehicleId: 'VEH-102',
    vehicleReg: 'HR 55 CD 5678',
    date: '2026-10-22',
    quantity: 190,
    cost: 266.00,
    odometer: 61800,
    fuelType: 'Diesel',
    station: 'Love’s Travel Stop #182',
    driverName: 'Marcus Vance'
  },
  {
    id: 'FUL-403',
    vehicleId: 'VEH-103',
    vehicleReg: 'KA 03 EF 9012',
    date: '2026-10-24',
    quantity: 65,
    cost: 84.50,
    odometer: 31100,
    fuelType: 'CNG',
    station: 'Clean Energy Fuels CNG Hub',
    driverName: 'Priya Sharma'
  },
  {
    id: 'FUL-404',
    vehicleId: 'VEH-105',
    vehicleReg: 'TN 09 IJ 7890',
    date: '2026-10-23',
    quantity: 110, // kWh
    cost: 44.00,
    odometer: 14100,
    fuelType: 'Electric',
    station: 'Electrify America Supercharger Terminal',
    driverName: 'Elena Rostova'
  },
  {
    id: 'FUL-405',
    vehicleId: 'VEH-106',
    vehicleReg: 'UP 16 KL 2345',
    date: '2026-10-25',
    quantity: 75,
    cost: 105.00,
    odometer: 41900,
    fuelType: 'Diesel',
    station: 'TA Express Travel Center',
    driverName: 'Sunil Verma'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    type: 'MAINTENANCE_OVERDUE',
    title: 'Maintenance Overdue',
    message: 'Scheduled Oil Change for KA 03 EF 9012 is overdue since 23 Oct 2026.',
    severity: 'error',
    read: false,
    createdAt: '2026-10-26T07:15:00Z',
    link: '/maintenance'
  },
  {
    id: 'NOTIF-02',
    type: 'DOCUMENT_EXPIRY',
    title: 'Vehicle Document Expiring Soon',
    message: 'Fitness Certificate for DL 1L AB 1234 expires in 17 days (12 Nov 2026).',
    severity: 'warning',
    read: false,
    createdAt: '2026-10-26T08:00:00Z',
    link: '/vehicles'
  },
  {
    id: 'NOTIF-03',
    type: 'TRIP_DELAYED',
    title: 'Trip TRP-5002 Delayed',
    message: 'Trip to Portland is delayed due to severe interstate traffic.',
    severity: 'warning',
    read: false,
    createdAt: '2026-10-26T10:15:00Z',
    link: '/operations/tracking'
  },
  {
    id: 'NOTIF-04',
    type: 'LICENSE_EXPIRY',
    title: 'Driver License Expiry Notice',
    message: 'Driver Elena Rostova’s commercial license expires in 10 days (05 Nov 2026).',
    severity: 'warning',
    read: true,
    createdAt: '2026-10-25T11:00:00Z',
    link: '/drivers'
  },
  {
    id: 'NOTIF-05',
    type: 'HIGH_PRIORITY_DELIVERY',
    title: 'Urgent Delivery En Route',
    message: 'FL-TRK-8921 (Precision Gearboxes) is in transit to Detroit. ETA: 16:30.',
    severity: 'info',
    read: true,
    createdAt: '2026-10-26T08:15:00Z',
    link: '/operations'
  }
];
