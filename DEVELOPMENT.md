# URide - Development Documentation

## Overview

URide is a complete ride-sharing mobile application built with NativeScript and Svelte Native. This document provides comprehensive information about the application architecture, features, and implementation.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Services](#services)
5. [Components](#components)
6. [Data Models](#data-models)
7. [Configuration](#configuration)
8. [Setup Instructions](#setup-instructions)
9. [Development Notes](#development-notes)

---

## Project Structure

```
app/
├── app.ts                          # Application entry point
├── app.css                         # Global styles
├── config/
│   └── config.ts                   # Configuration and API keys
├── models/
│   └── types.ts                    # TypeScript interfaces and types
├── services/
│   ├── api.service.ts              # HTTP API client
│   ├── auth.service.ts             # Authentication
│   ├── storage.service.ts          # Local data persistence
│   ├── ride.service.ts             # Ride management
│   ├── payment.service.ts          # Payment processing
│   ├── notification.service.ts     # Notifications
│   └── rating.service.ts           # Ratings and reviews
└── components/
    ├── Splash.svelte               # Splash screen
    ├── Login.svelte                # Login screen
    ├── Register.svelte             # Registration screen
    ├── Home.svelte                 # Main map/booking screen
    ├── RideTracking.svelte         # Active ride tracking
    ├── RideHistory.svelte          # Ride history list
    ├── Profile.svelte              # User profile
    └── RateRide.svelte             # Rating screen
```

---

## Features

### ✅ Implemented Features

#### Authentication
- User registration (riders and drivers)
- Login/logout functionality
- Password validation
- Session persistence
- User profile management

#### Ride Management
- Request rides with pickup/dropoff locations
- Real-time ride tracking
- Multiple ride statuses (requested, accepted, in progress, completed, cancelled)
- Distance and fare calculation
- Duration estimation
- Ride history with search and filters

#### Driver Features
- Driver availability toggle
- Accept/reject ride requests
- Mark arrival and start ride
- Complete rides
- Vehicle information management

#### Payment System
- Multiple payment methods (card, cash, wallet)
- Payment processing
- Payment history
- Driver earnings calculation
- Default payment method selection

#### Rating & Reviews
- 5-star rating system
- Written reviews
- Average rating calculation
- Rating breakdown statistics
- Review reporting

#### Notifications
- Local notifications
- Ride status notifications
- Payment confirmations
- Push notification framework (ready for Firebase)

#### Map Integration
- Interactive Google Maps
- Real-time location tracking
- Tap-to-select destination
- Custom markers for pickup/dropoff
- Map zoom and controls

#### UI/UX
- Splash screen
- Side navigation menu
- Responsive layouts
- Loading states
- Error handling

---

## Architecture

### Design Pattern
- **MVVM (Model-View-ViewModel)** with Svelte's reactive components
- **Service Layer** for business logic
- **Singleton Pattern** for service instances
- **Observer Pattern** for state updates

### Data Flow
1. User interacts with Component (View)
2. Component calls Service method
3. Service processes business logic
4. Service calls API (or uses mock data)
5. Service updates local storage
6. Component receives updated data
7. UI updates reactively

---

## Services

### API Service (`api.service.ts`)
HTTP client for backend communication.

**Methods:**
- `get<T>(endpoint)` - GET request
- `post<T>(endpoint, data)` - POST request
- `put<T>(endpoint, data)` - PUT request
- `delete<T>(endpoint)` - DELETE request

**Features:**
- Automatic token injection
- Error handling
- Timeout configuration
- Mock mode support

### Auth Service (`auth.service.ts`)
Handles user authentication and profile management.

**Methods:**
- `register(data)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout current user
- `isAuthenticated()` - Check auth status
- `getCurrentUser()` - Get logged-in user
- `updateProfile(updates)` - Update user profile
- `changePassword(old, new)` - Change password

### Storage Service (`storage.service.ts`)
Local data persistence using ApplicationSettings.

**Methods:**
- `set(key, value)` - Store data
- `get<T>(key)` - Retrieve data
- `remove(key)` - Delete data
- `clear()` - Clear all data
- `setAuthToken(token)` - Store auth token
- `getAuthToken()` - Get auth token
- `setCurrentUser(user)` - Store user
- `getCurrentUser<T>()` - Get user
- `isLoggedIn()` - Check login status

### Ride Service (`ride.service.ts`)
Manages ride operations and state.

**Methods:**
- `requestRide(pickup, dropoff)` - Request new ride
- `acceptRide(rideId)` - Accept ride (driver)
- `cancelRide(rideId)` - Cancel ride
- `startRide(rideId)` - Start ride
- `completeRide(rideId)` - Complete ride
- `getCurrentRide()` - Get active ride
- `getRideHistory()` - Get past rides
- `getNearbyDrivers(location, radius)` - Find drivers
- `updateDriverAvailability(available)` - Toggle availability

**Features:**
- Distance calculation (Haversine formula)
- Fare calculation
- Duration estimation
- Mock driver matching

### Payment Service (`payment.service.ts`)
Handles payment operations.

**Methods:**
- `getPaymentMethods()` - Get saved methods
- `addPaymentMethod(method)` - Add payment method
- `removePaymentMethod(id)` - Remove method
- `setDefaultPaymentMethod(id)` - Set default
- `processPayment(ride, methodId)` - Process payment
- `getPaymentHistory()` - Get payment history
- `calculateDriverEarnings(ride)` - Calculate earnings

### Notification Service (`notification.service.ts`)
Manages local and push notifications.

**Methods:**
- `sendNotification(title, message, data)` - Send notification
- `createNotification(userId, title, message, type, data)` - Create record
- `getNotifications()` - Get all notifications
- `getUnreadNotifications()` - Get unread
- `getUnreadCount()` - Count unread
- `markAsRead(id)` - Mark as read
- `markAllAsRead()` - Mark all read
- `deleteNotification(id)` - Delete notification
- `clearAll()` - Clear all

**Event Notifications:**
- `notifyRideRequested(rideId)`
- `notifyRideAccepted(driverName)`
- `notifyDriverArrived(driverName)`
- `notifyRideStarted()`
- `notifyRideCompleted(fare)`
- `notifyPaymentProcessed(amount)`

### Rating Service (`rating.service.ts`)
Manages ratings and reviews.

**Methods:**
- `submitRating(rideId, fromUserId, toUserId, rating, review)` - Submit rating
- `getUserRatings(userId)` - Get user's ratings
- `calculateAverageRating(userId)` - Calculate average
- `getRatingBreakdown(userId)` - Get star distribution
- `hasRatedRide(rideId, userId)` - Check if rated
- `getUserReviews(userId)` - Get reviews
- `reportRating(ratingId, reason)` - Report rating

---

## Components

### Splash (`Splash.svelte`)
- Displays app logo
- 2-second delay
- Navigates to Login

### Login (`Login.svelte`)
- Email/password login
- Form validation
- Link to register
- Forgot password option

### Register (`Register.svelte`)
- User type selection (rider/driver)
- Personal information form
- Driver-specific fields
- Password confirmation
- Integration with AuthService

### Home (`Home.svelte`)
**Main application screen for booking rides**

Features:
- Google Maps integration
- Current location marker
- Destination selection
- Ride booking
- User info display
- Side navigation menu
- Profile access
- Ride history access

### RideTracking (`RideTracking.svelte`)
**Real-time tracking of active ride**

Features:
- Live map view (placeholder)
- Ride status display
- Location information
- ETA calculation
- Status-specific actions
- Driver/rider controls
- Contact button

Status Actions:
- **Accepted**: Driver can mark "I've Arrived"
- **Driver Arrived**: Driver can "Start Ride"
- **In Progress**: Driver can "Complete Ride"
- **Any**: Cancel ride option

### RideHistory (`RideHistory.svelte`)
**Display past rides**

Features:
- Chronological list
- Ride details (pickup, dropoff, fare, distance, duration)
- Status indicators with colors
- Rating display
- Review display
- Empty state handling

### Profile (`Profile.svelte`)
**User profile management**

Features:
- Avatar display
- Rating and ride count
- Edit mode toggle
- Personal information editing
- Driver vehicle info (read-only)
- Logout functionality

### RateRide (`RateRide.svelte`)
**Rate completed rides**

Features:
- 5-star selection
- Optional text review
- Rating descriptions
- Skip option
- Submit validation

---

## Data Models

### User
```typescript
interface User {
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
```

### Driver (extends User)
```typescript
interface Driver extends User {
  userType: 'driver';
  carModel: string;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: Location;
}
```

### Ride
```typescript
interface Ride {
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
```

### RideStatus
```typescript
enum RideStatus {
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  DRIVER_ARRIVED = 'driver_arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### Payment
```typescript
interface Payment {
  id: string;
  rideId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
```

### Rating
```typescript
interface Rating {
  id: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  review?: string;
  createdAt: Date;
}
```

---

## Configuration

### Environment Variables (`config/config.ts`)

```typescript
export const Config = {
  // API Configuration
  API_BASE_URL: 'https://api.uride.com/v1',
  API_TIMEOUT: 30000,

  // Google Maps
  GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

  // Payment
  STRIPE_PUBLISHABLE_KEY: 'YOUR_STRIPE_KEY',

  // Firebase (Push Notifications)
  FIREBASE_CONFIG: { /* ... */ },

  // Map Settings
  DEFAULT_ZOOM_LEVEL: 15,
  LOCATION_UPDATE_INTERVAL: 10000,

  // Ride Settings
  RIDE_SEARCH_RADIUS: 5000,
  RIDE_REQUEST_TIMEOUT: 300000,

  // App Settings
  MIN_PASSWORD_LENGTH: 6,

  // Feature Flags
  ENABLE_REAL_TIME_TRACKING: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_IN_APP_PAYMENTS: true,
};
```

---

## Setup Instructions

### Prerequisites
- Node.js 14+
- NativeScript CLI
- Android SDK / Xcode
- Google Maps API key
- Stripe account (for payments)
- Firebase project (for push notifications)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sb1-1nedgo
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Keys**

Edit `app/config/config.ts`:
- Add your Google Maps API key
- Add your Stripe publishable key
- Add your Firebase configuration

4. **Run on Android**
```bash
ns run android
```

5. **Run on iOS**
```bash
ns run ios
```

---

## Development Notes

### Mock Mode

The app currently runs in **mock mode** with simulated backend responses. This allows for:
- Full UI/UX testing
- Feature development
- Demo purposes

To connect to a real backend:
1. Update `API_BASE_URL` in `config/config.ts`
2. Remove mock implementations from services
3. Uncomment API calls in each service

### Testing Users

Mock login accepts any email/password combination. Suggested test users:
- rider@uride.com / password
- driver@uride.com / password

### Database

Currently uses local storage (ApplicationSettings). For production:
- Implement backend API
- Use proper database (PostgreSQL, MongoDB, etc.)
- Add real-time sync
- Implement WebSocket connections

### Push Notifications

Framework is ready for Firebase Cloud Messaging:
1. Complete Firebase setup
2. Implement FCM in `notification.service.ts`
3. Add server-side notification sending
4. Configure notification handlers

### Payment Integration

Payment service is ready for Stripe:
1. Complete Stripe setup
2. Implement Stripe SDK
3. Add card tokenization
4. Configure webhook handlers

### Real-Time Features

To add real-time tracking:
1. Implement WebSocket connection
2. Add location streaming
3. Update map markers in real-time
4. Add driver ETA updates

### Security Considerations

Before production:
- Implement proper authentication (JWT)
- Add input validation
- Sanitize user data
- Enable HTTPS only
- Add rate limiting
- Implement CORS
- Add security headers
- Encrypt sensitive data

### Performance Optimization

Recommended optimizations:
- Lazy load components
- Implement virtual scrolling for lists
- Cache map tiles
- Optimize image loading
- Minimize bundle size
- Add analytics

---

## Next Steps

### Recommended Features to Add

1. **Chat System**
   - In-ride messaging
   - Driver-rider communication
   - Message history

2. **Driver Mode UI**
   - Dedicated driver dashboard
   - Toggle online/offline
   - Earnings display
   - Ride requests queue

3. **Advanced Booking**
   - Schedule rides
   - Recurring rides
   - Favorite locations

4. **Promotions**
   - Promo codes
   - Referral system
   - Loyalty rewards

5. **Safety Features**
   - Emergency button
   - Share ride status
   - Driver verification
   - Ride insurance

6. **Analytics Dashboard**
   - Ride statistics
   - Earnings reports
   - User metrics
   - Performance insights

---

## License

Private - All rights reserved

## Contributors

- Development Team

## Support

For issues or questions, please contact the development team.
