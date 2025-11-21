import { ApplicationSettings } from '@nativescript/core';

/**
 * Service for handling local data persistence
 */
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic methods
  set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      ApplicationSettings.setString(key, serialized);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const serialized = ApplicationSettings.getString(key);
      if (!serialized) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  remove(key: string): void {
    ApplicationSettings.remove(key);
  }

  clear(): void {
    ApplicationSettings.clear();
  }

  // Auth-specific methods
  setAuthToken(token: string): void {
    this.set('auth_token', token);
  }

  getAuthToken(): string | null {
    return this.get<string>('auth_token');
  }

  removeAuthToken(): void {
    this.remove('auth_token');
  }

  // User-specific methods
  setCurrentUser(user: any): void {
    this.set('current_user', user);
  }

  getCurrentUser<T>(): T | null {
    return this.get<T>('current_user');
  }

  removeCurrentUser(): void {
    this.remove('current_user');
  }

  // Ride cache methods
  cacheRides(rides: any[]): void {
    this.set('cached_rides', rides);
  }

  getCachedRides<T>(): T[] | null {
    return this.get<T[]>('cached_rides');
  }

  // Settings methods
  setSetting(key: string, value: any): void {
    this.set(`setting_${key}`, value);
  }

  getSetting<T>(key: string): T | null {
    return this.get<T>(`setting_${key}`);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getAuthToken() !== null && this.getCurrentUser() !== null;
  }

  // Logout - clear all auth data
  logout(): void {
    this.removeAuthToken();
    this.removeCurrentUser();
  }
}

export default StorageService.getInstance();
