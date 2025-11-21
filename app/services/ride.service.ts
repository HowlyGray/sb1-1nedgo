import ApiService from './api.service';
import AuthService from './auth.service';
import StorageService from './storage.service';
import { Ride, RideStatus, Location, Driver } from '../models/types';
import { Observable } from '@nativescript/core';

/**
 * Service for handling ride operations
 */
export class RideService extends Observable {
  private static instance: RideService;
  private currentRide: Ride | null = null;
  private nearbyDrivers: Driver[] = [];
  private rideUpdateInterval: any = null;

  private constructor() {
    super();
  }

  static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  /**
   * Request a new ride
   */
  async requestRide(pickupLocation: Location, dropoffLocation: Location): Promise<{ success: boolean; ride?: Ride; error?: string }> {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // In production, this would call the API
      // const response = await ApiService.post<Ride>('/rides', { pickupLocation, dropoffLocation });

      // Mock implementation - calculate fare and distance
      const distance = this.calculateDistance(pickupLocation, dropoffLocation);
      const fare = this.calculateFare(distance);
      const duration = this.estimateDuration(distance);

      const newRide: Ride = {
        id: 'ride_' + Date.now(),
        riderId: user.id,
        pickupLocation,
        dropoffLocation,
        status: RideStatus.REQUESTED,
        fare,
        distance,
        duration,
        requestedAt: new Date(),
      };

      this.currentRide = newRide;
      StorageService.set('current_ride', newRide);

      console.log('Ride requested:', newRide);

      // Simulate finding a driver
      this.simulateDriverMatching(newRide);

      return {
        success: true,
        ride: newRide,
      };
    } catch (error) {
      console.error('Ride request error:', error);
      return {
        success: false,
        error: error.message || 'Failed to request ride',
      };
    }
  }

  /**
   * Accept a ride (for drivers)
   */
  async acceptRide(rideId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const driver = AuthService.getCurrentUser();
      if (!driver || driver.userType !== 'driver') {
        return { success: false, error: 'Only drivers can accept rides' };
      }

      // In production, this would call the API
      // const response = await ApiService.put<Ride>(`/rides/${rideId}/accept`, {});

      // Mock implementation
      if (this.currentRide && this.currentRide.id === rideId) {
        this.currentRide.driverId = driver.id;
        this.currentRide.status = RideStatus.ACCEPTED;
        this.currentRide.acceptedAt = new Date();
        StorageService.set('current_ride', this.currentRide);

        this.notifyPropertyChange('currentRide', this.currentRide);
        console.log('Ride accepted:', this.currentRide);
      }

      return { success: true };
    } catch (error) {
      console.error('Accept ride error:', error);
      return {
        success: false,
        error: error.message || 'Failed to accept ride',
      };
    }
  }

  /**
   * Cancel a ride
   */
  async cancelRide(rideId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.put<Ride>(`/rides/${rideId}/cancel`, {});

      if (this.currentRide && this.currentRide.id === rideId) {
        this.currentRide.status = RideStatus.CANCELLED;
        this.currentRide.cancelledAt = new Date();
        StorageService.remove('current_ride');

        this.notifyPropertyChange('currentRide', null);
        console.log('Ride cancelled:', rideId);

        this.currentRide = null;
      }

      return { success: true };
    } catch (error) {
      console.error('Cancel ride error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel ride',
      };
    }
  }

  /**
   * Start a ride (driver arrives and starts trip)
   */
  async startRide(rideId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.currentRide && this.currentRide.id === rideId) {
        this.currentRide.status = RideStatus.IN_PROGRESS;
        this.currentRide.startedAt = new Date();
        StorageService.set('current_ride', this.currentRide);

        this.notifyPropertyChange('currentRide', this.currentRide);
        console.log('Ride started:', this.currentRide);
      }

      return { success: true };
    } catch (error) {
      console.error('Start ride error:', error);
      return {
        success: false,
        error: error.message || 'Failed to start ride',
      };
    }
  }

  /**
   * Complete a ride
   */
  async completeRide(rideId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.currentRide && this.currentRide.id === rideId) {
        this.currentRide.status = RideStatus.COMPLETED;
        this.currentRide.completedAt = new Date();

        // Save to ride history
        const rideHistory = StorageService.get<Ride[]>('ride_history') || [];
        rideHistory.unshift(this.currentRide);
        StorageService.set('ride_history', rideHistory);

        StorageService.remove('current_ride');
        this.notifyPropertyChange('currentRide', null);
        console.log('Ride completed:', this.currentRide);

        this.currentRide = null;
      }

      return { success: true };
    } catch (error) {
      console.error('Complete ride error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete ride',
      };
    }
  }

  /**
   * Get current active ride
   */
  getCurrentRide(): Ride | null {
    if (!this.currentRide) {
      this.currentRide = StorageService.get<Ride>('current_ride');
    }
    return this.currentRide;
  }

  /**
   * Get ride history
   */
  async getRideHistory(): Promise<{ success: boolean; rides?: Ride[]; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.get<Ride[]>('/rides/history');

      const rides = StorageService.get<Ride[]>('ride_history') || [];
      return {
        success: true,
        rides,
      };
    } catch (error) {
      console.error('Get ride history error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get ride history',
      };
    }
  }

  /**
   * Get nearby available drivers
   */
  async getNearbyDrivers(location: Location, radius: number = 5000): Promise<{ success: boolean; drivers?: Driver[]; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.post<Driver[]>('/drivers/nearby', { location, radius });

      // Mock implementation
      const mockDrivers: Driver[] = [
        {
          id: 'driver_1',
          email: 'driver1@uride.com',
          firstName: 'Mike',
          lastName: 'Johnson',
          phone: '+1234567891',
          userType: 'driver',
          carModel: 'Toyota Camry',
          licensePlate: 'ABC123',
          isAvailable: true,
          rating: 4.9,
          totalRides: 250,
          createdAt: new Date(),
          currentLocation: {
            latitude: location.latitude + 0.01,
            longitude: location.longitude + 0.01,
          },
        },
        {
          id: 'driver_2',
          email: 'driver2@uride.com',
          firstName: 'Sarah',
          lastName: 'Williams',
          phone: '+1234567892',
          userType: 'driver',
          carModel: 'Honda Accord',
          licensePlate: 'XYZ789',
          isAvailable: true,
          rating: 4.8,
          totalRides: 180,
          createdAt: new Date(),
          currentLocation: {
            latitude: location.latitude - 0.01,
            longitude: location.longitude - 0.01,
          },
        },
      ];

      this.nearbyDrivers = mockDrivers;
      return {
        success: true,
        drivers: mockDrivers,
      };
    } catch (error) {
      console.error('Get nearby drivers error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get nearby drivers',
      };
    }
  }

  /**
   * Calculate distance between two locations (in km)
   */
  private calculateDistance(from: Location, to: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(to.latitude - from.latitude);
    const dLon = this.toRad(to.longitude - from.longitude);
    const lat1 = this.toRad(from.latitude);
    const lat2 = this.toRad(to.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Calculate fare based on distance
   */
  private calculateFare(distance: number): number {
    const baseFare = 2.5;
    const perKmRate = 1.5;
    return baseFare + (distance * perKmRate);
  }

  /**
   * Estimate duration based on distance (in minutes)
   */
  private estimateDuration(distance: number): number {
    const avgSpeed = 40; // km/h
    return Math.round((distance / avgSpeed) * 60);
  }

  /**
   * Simulate driver matching (for development)
   */
  private simulateDriverMatching(ride: Ride): void {
    setTimeout(() => {
      if (this.currentRide && this.currentRide.id === ride.id && this.currentRide.status === RideStatus.REQUESTED) {
        console.log('Driver found! Waiting for acceptance...');
        // In a real app, this would be handled by push notifications
      }
    }, 3000);
  }

  /**
   * Update driver availability status
   */
  async updateDriverAvailability(isAvailable: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const driver = AuthService.getCurrentUser();
      if (!driver || driver.userType !== 'driver') {
        return { success: false, error: 'Only drivers can update availability' };
      }

      // In production, this would call the API
      // const response = await ApiService.put(`/drivers/${driver.id}/availability`, { isAvailable });

      await AuthService.updateProfile({ ...driver, isAvailable } as any);
      console.log('Driver availability updated:', isAvailable);

      return { success: true };
    } catch (error) {
      console.error('Update availability error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update availability',
      };
    }
  }
}

export default RideService.getInstance();
