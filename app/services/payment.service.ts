import ApiService from './api.service';
import StorageService from './storage.service';
import { Payment, PaymentMethod, Ride } from '../models/types';

/**
 * Service for handling payments
 */
export class PaymentService {
  private static instance: PaymentService;
  private paymentMethods: PaymentMethod[] = [];

  private constructor() {
    // Load payment methods from storage
    this.loadPaymentMethods();
  }

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private loadPaymentMethods(): void {
    const methods = StorageService.get<PaymentMethod[]>('payment_methods');
    if (methods) {
      this.paymentMethods = methods;
    }
  }

  private savePaymentMethods(): void {
    StorageService.set('payment_methods', this.paymentMethods);
  }

  /**
   * Get all payment methods
   */
  async getPaymentMethods(): Promise<{ success: boolean; methods?: PaymentMethod[]; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.get<PaymentMethod[]>('/payment-methods');

      return {
        success: true,
        methods: this.paymentMethods,
      };
    } catch (error) {
      console.error('Get payment methods error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment methods',
      };
    }
  }

  /**
   * Add a new payment method
   */
  async addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<{ success: boolean; method?: PaymentMethod; error?: string }> {
    try {
      // In production, this would call the API to tokenize the card with Stripe
      // const response = await ApiService.post<PaymentMethod>('/payment-methods', method);

      // Mock implementation
      const newMethod: PaymentMethod = {
        ...method,
        id: 'pm_' + Date.now(),
      };

      // If this is the first method or marked as default, make it default
      if (this.paymentMethods.length === 0 || method.isDefault) {
        this.paymentMethods.forEach(m => m.isDefault = false);
        newMethod.isDefault = true;
      }

      this.paymentMethods.push(newMethod);
      this.savePaymentMethods();

      console.log('Payment method added:', newMethod);

      return {
        success: true,
        method: newMethod,
      };
    } catch (error) {
      console.error('Add payment method error:', error);
      return {
        success: false,
        error: error.message || 'Failed to add payment method',
      };
    }
  }

  /**
   * Remove a payment method
   */
  async removePaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.delete(`/payment-methods/${methodId}`);

      const index = this.paymentMethods.findIndex(m => m.id === methodId);
      if (index !== -1) {
        const wasDefault = this.paymentMethods[index].isDefault;
        this.paymentMethods.splice(index, 1);

        // If removed method was default, make first available method default
        if (wasDefault && this.paymentMethods.length > 0) {
          this.paymentMethods[0].isDefault = true;
        }

        this.savePaymentMethods();
        console.log('Payment method removed:', methodId);
      }

      return { success: true };
    } catch (error) {
      console.error('Remove payment method error:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove payment method',
      };
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(methodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.put(`/payment-methods/${methodId}/default`, {});

      this.paymentMethods.forEach(m => {
        m.isDefault = m.id === methodId;
      });

      this.savePaymentMethods();
      console.log('Default payment method set:', methodId);

      return { success: true };
    } catch (error) {
      console.error('Set default payment method error:', error);
      return {
        success: false,
        error: error.message || 'Failed to set default payment method',
      };
    }
  }

  /**
   * Process payment for a ride
   */
  async processPayment(ride: Ride, methodId?: string): Promise<{ success: boolean; payment?: Payment; error?: string }> {
    try {
      // Get payment method
      const method = methodId
        ? this.paymentMethods.find(m => m.id === methodId)
        : this.paymentMethods.find(m => m.isDefault);

      if (!method) {
        return { success: false, error: 'No payment method available' };
      }

      if (!ride.fare) {
        return { success: false, error: 'Ride fare not calculated' };
      }

      // In production, this would call the API to process payment with Stripe
      // const response = await ApiService.post<Payment>('/payments', {
      //   rideId: ride.id,
      //   amount: ride.fare,
      //   methodId: method.id,
      // });

      // Mock implementation
      const payment: Payment = {
        id: 'pay_' + Date.now(),
        rideId: ride.id,
        amount: ride.fare,
        method: method,
        status: 'completed',
        createdAt: new Date(),
      };

      // Save payment history
      const paymentHistory = StorageService.get<Payment[]>('payment_history') || [];
      paymentHistory.unshift(payment);
      StorageService.set('payment_history', paymentHistory);

      console.log('Payment processed:', payment);

      return {
        success: true,
        payment,
      };
    } catch (error) {
      console.error('Process payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<{ success: boolean; payments?: Payment[]; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.get<Payment[]>('/payments/history');

      const payments = StorageService.get<Payment[]>('payment_history') || [];

      return {
        success: true,
        payments,
      };
    } catch (error) {
      console.error('Get payment history error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  }

  /**
   * Calculate driver earnings
   */
  calculateDriverEarnings(ride: Ride): number {
    if (!ride.fare) return 0;

    // Driver gets 80% of the fare
    const driverPercentage = 0.8;
    return ride.fare * driverPercentage;
  }

  /**
   * Get default payment method
   */
  getDefaultPaymentMethod(): PaymentMethod | null {
    return this.paymentMethods.find(m => m.isDefault) || null;
  }
}

export default PaymentService.getInstance();
