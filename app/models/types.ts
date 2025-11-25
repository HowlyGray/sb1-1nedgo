// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'rider' | 'driver';
  profileImage?: string;
  rating?: number;
  totalRides?: number;
  createdAt: Date;
}

export interface Driver extends User {
  userType: 'driver';
  carModel: string;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: Location;
}

export interface Rider extends User {
  userType: 'rider';
  paymentMethods?: PaymentMethod[];
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Ride types
export enum RideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: RideStatus;
  fare?: number;
  distance?: number;
  duration?: number;
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  rating?: number;
  review?: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  last4?: string;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  rideId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Rating types
export interface Rating {
  id: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ride_request' | 'ride_accepted' | 'ride_started' | 'ride_completed' | 'payment' | 'general';
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

// Auth types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'rider' | 'driver';
  carModel?: string;
  licensePlate?: string;
}
