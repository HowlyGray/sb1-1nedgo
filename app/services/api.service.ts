import { Http } from '@nativescript/core';
import Config from '../config/config';
import StorageService from './storage.service';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Service for handling API calls to backend
 */
export class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private timeout: number;

  private constructor() {
    this.baseUrl = Config.API_BASE_URL;
    this.timeout = Config.API_TIMEOUT;
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private getHeaders(): any {
    const headers: any = {
      'Content-Type': 'application/json',
    };

    const token = StorageService.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await Http.request({
        url: `${this.baseUrl}${endpoint}`,
        method: 'GET',
        headers: this.getHeaders(),
        timeout: this.timeout,
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          success: true,
          data: response.content?.toJSON() as T,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.statusCode}: ${response.content?.toString()}`,
        };
      }
    } catch (error) {
      console.error('API GET Error:', error);
      return {
        success: false,
        error: error.message || 'Network request failed',
      };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await Http.request({
        url: `${this.baseUrl}${endpoint}`,
        method: 'POST',
        headers: this.getHeaders(),
        content: JSON.stringify(data),
        timeout: this.timeout,
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          success: true,
          data: response.content?.toJSON() as T,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.statusCode}: ${response.content?.toString()}`,
        };
      }
    } catch (error) {
      console.error('API POST Error:', error);
      return {
        success: false,
        error: error.message || 'Network request failed',
      };
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await Http.request({
        url: `${this.baseUrl}${endpoint}`,
        method: 'PUT',
        headers: this.getHeaders(),
        content: JSON.stringify(data),
        timeout: this.timeout,
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          success: true,
          data: response.content?.toJSON() as T,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.statusCode}: ${response.content?.toString()}`,
        };
      }
    } catch (error) {
      console.error('API PUT Error:', error);
      return {
        success: false,
        error: error.message || 'Network request failed',
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await Http.request({
        url: `${this.baseUrl}${endpoint}`,
        method: 'DELETE',
        headers: this.getHeaders(),
        timeout: this.timeout,
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return {
          success: true,
          data: response.content?.toJSON() as T,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.statusCode}: ${response.content?.toString()}`,
        };
      }
    } catch (error) {
      console.error('API DELETE Error:', error);
      return {
        success: false,
        error: error.message || 'Network request failed',
      };
    }
  }

  // Mock mode for development (when backend is not available)
  setMockMode(enabled: boolean): void {
    if (enabled) {
      console.log('API Mock Mode Enabled - Using local data');
    }
  }
}

export default ApiService.getInstance();
