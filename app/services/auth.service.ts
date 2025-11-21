import ApiService from './api.service';
import StorageService from './storage.service';
import { AuthCredentials, AuthResponse, RegisterData, User } from '../models/types';

/**
 * Service for handling authentication
 */
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    // Load user from storage on initialization
    this.currentUser = StorageService.getCurrentUser<User>();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.post<AuthResponse>('/auth/register', data);

      // Mock implementation for development
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        userType: data.userType,
        rating: 5.0,
        totalRides: 0,
        createdAt: new Date(),
      };

      // Add driver-specific fields if user is a driver
      if (data.userType === 'driver' && data.carModel && data.licensePlate) {
        (mockUser as any).carModel = data.carModel;
        (mockUser as any).licensePlate = data.licensePlate;
        (mockUser as any).isAvailable = true;
      }

      const mockToken = 'mock_token_' + Date.now();

      // Save to storage
      StorageService.setAuthToken(mockToken);
      StorageService.setCurrentUser(mockUser);
      this.currentUser = mockUser;

      console.log('User registered successfully:', mockUser);

      return {
        success: true,
        user: mockUser,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Login user
   */
  async login(credentials: AuthCredentials): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.post<AuthResponse>('/auth/login', credentials);

      // Mock implementation for development
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        userType: 'rider',
        rating: 4.8,
        totalRides: 25,
        createdAt: new Date(),
      };

      const mockToken = 'mock_token_' + Date.now();

      // Save to storage
      StorageService.setAuthToken(mockToken);
      StorageService.setCurrentUser(mockUser);
      this.currentUser = mockUser;

      console.log('User logged in successfully:', mockUser);

      return {
        success: true,
        user: mockUser,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    StorageService.logout();
    this.currentUser = null;
    console.log('User logged out');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return StorageService.isLoggedIn();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    if (!this.currentUser) {
      this.currentUser = StorageService.getCurrentUser<User>();
    }
    return this.currentUser;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No user logged in' };
      }

      // In production, this would call the API
      // const response = await ApiService.put<User>(`/users/${this.currentUser.id}`, updates);

      // Mock implementation
      const updatedUser = { ...this.currentUser, ...updates };
      StorageService.setCurrentUser(updatedUser);
      this.currentUser = updatedUser;

      console.log('Profile updated:', updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Profile update failed',
      };
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.post('/auth/change-password', { oldPassword, newPassword });

      // Mock implementation
      console.log('Password changed successfully');
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.message || 'Password change failed',
      };
    }
  }
}

export default AuthService.getInstance();
