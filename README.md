# URide - Ride-Sharing Mobile Application

A complete, production-ready ride-sharing mobile application built with NativeScript and Svelte Native for iOS and Android.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/HowlyGray/sb1-1nedgo)

## Overview

URide is a comprehensive ride-sharing platform similar to Uber/Lyft that connects riders with drivers. The application includes authentication, real-time ride tracking, payments, ratings, and notifications.

## Features

### 🚗 For Riders
- Book rides with interactive map
- Real-time ride tracking
- Multiple payment methods
- Ride history and receipts
- Rate drivers and leave reviews
- Profile management

### 🚕 For Drivers
- Accept/reject ride requests
- Real-time earnings tracking
- Availability toggle
- Rider ratings
- Vehicle management

### 🔐 Authentication
- Secure login and registration
- User profile management
- Session persistence

### 💳 Payments
- Multiple payment methods (Card, Cash, Wallet)
- Automatic fare calculation
- Payment history
- Driver earnings

### ⭐ Rating System
- 5-star rating system
- Written reviews
- Average rating calculation

### 🔔 Notifications
- Local notifications
- Ride status updates
- Payment confirmations
- Push notification framework

## Technology Stack

- **Framework:** NativeScript 8.6
- **UI Library:** Svelte Native
- **Language:** TypeScript 5.2
- **Maps:** Google Maps
- **Notifications:** Local Notifications
- **Platforms:** iOS & Android

## Project Structure

```
app/
├── app.ts                 # Application entry point
├── config/                # Configuration files
├── models/                # TypeScript types and interfaces
├── services/              # Business logic services
│   ├── api.service.ts
│   ├── auth.service.ts
│   ├── ride.service.ts
│   ├── payment.service.ts
│   ├── rating.service.ts
│   └── notification.service.ts
└── components/            # Svelte components
    ├── Login.svelte
    ├── Register.svelte
    ├── Home.svelte
    ├── RideTracking.svelte
    ├── RideHistory.svelte
    ├── Profile.svelte
    └── RateRide.svelte
```

## Quick Start

### Prerequisites
- Node.js 14 or higher
- NativeScript CLI (`npm install -g nativescript`)
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sb1-1nedgo
```

2. Install dependencies:
```bash
npm install
```

3. Configure API keys in `app/config/config.ts`:
   - Google Maps API key
   - Stripe key (optional)
   - Firebase config (optional)

4. Run the application:

**Android:**
```bash
ns run android
```

**iOS:**
```bash
ns run ios
```

## Configuration

Edit `app/config/config.ts` to configure:
- API base URL
- Google Maps API key
- Payment gateway keys
- Firebase configuration
- Feature flags

## Development Mode

The app currently runs in **mock mode** with simulated backend responses. This allows full testing without a backend server.

To connect to a real backend:
1. Update `API_BASE_URL` in config
2. Uncomment API calls in service files
3. Implement backend endpoints

## Key Components

### Home Screen
- Interactive Google Maps
- Location selection
- Ride booking
- Navigation menu

### Ride Tracking
- Real-time ride status
- Driver information
- ETA calculation
- Status-specific actions

### Profile Management
- Edit user information
- View ratings and statistics
- Logout functionality

### Ride History
- List of past rides
- Ride details
- Ratings and reviews

## Services Architecture

### API Service
HTTP client with automatic token injection and error handling.

### Auth Service
User authentication, registration, and profile management.

### Ride Service
Ride creation, tracking, and management with distance/fare calculation.

### Payment Service
Payment method management and transaction processing.

### Rating Service
Rating and review submission with statistics calculation.

### Notification Service
Local and push notification handling.

## Data Persistence

Uses NativeScript ApplicationSettings for local storage:
- User session
- Authentication token
- Ride history
- Payment methods
- Settings

## Documentation

For detailed documentation, see [DEVELOPMENT.md](./DEVELOPMENT.md) which includes:
- Complete API reference
- Service documentation
- Component details
- Data model specifications
- Setup instructions
- Production deployment guide

## Testing

### Mock Users
The app accepts any email/password in mock mode. Suggested test credentials:
- `rider@uride.com` / `password`
- `driver@uride.com` / `password`

## Security Notes

Current implementation uses mock authentication. For production:
- Implement JWT tokens
- Add input validation
- Enable HTTPS
- Implement rate limiting
- Add security headers

## Future Enhancements

- [ ] Backend API integration
- [ ] WebSocket for real-time updates
- [ ] In-app chat
- [ ] Driver dashboard
- [ ] Advanced analytics
- [ ] Promo codes
- [ ] Schedule rides
- [ ] Emergency features

## Performance

- Optimized for 60fps
- Lazy component loading
- Efficient map rendering
- Minimal bundle size

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

Private - All rights reserved

## Support

For support, email support@uride.com or open an issue.

## Acknowledgments

- NativeScript team
- Svelte Native community
- Google Maps Platform
- All contributors

---

Built with ❤️ using NativeScript and Svelte Native
