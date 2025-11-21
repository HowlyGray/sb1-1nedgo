import { LocalNotifications } from '@nativescript/local-notifications';
import { Observable } from '@nativescript/core';
import StorageService from './storage.service';
import { Notification } from '../models/types';

/**
 * Service for handling notifications (local and push)
 */
export class NotificationService extends Observable {
  private static instance: NotificationService;
  private notifications: Notification[] = [];

  private constructor() {
    super();
    this.loadNotifications();
    this.requestPermissions();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async requestPermissions(): Promise<void> {
    try {
      const hasPermission = await LocalNotifications.hasPermission();
      if (!hasPermission) {
        await LocalNotifications.requestPermission();
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  }

  private loadNotifications(): void {
    const stored = StorageService.get<Notification[]>('notifications');
    if (stored) {
      this.notifications = stored;
    }
  }

  private saveNotifications(): void {
    StorageService.set('notifications', this.notifications);
  }

  /**
   * Send a local notification
   */
  async sendNotification(
    title: string,
    message: string,
    data?: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await LocalNotifications.schedule([
        {
          id: Date.now(),
          title,
          body: message,
          badge: 1,
          sound: 'default',
          data,
        },
      ]);

      console.log('Notification sent:', title);
      return { success: true };
    } catch (error) {
      console.error('Send notification error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send notification',
      };
    }
  }

  /**
   * Create and store a notification record
   */
  createNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    data?: any
  ): Notification {
    const notification: Notification = {
      id: 'notif_' + Date.now(),
      userId,
      title,
      message,
      type,
      isRead: false,
      data,
      createdAt: new Date(),
    };

    this.notifications.unshift(notification);
    this.saveNotifications();
    this.notifyPropertyChange('notifications', this.notifications);

    // Also send as local notification
    this.sendNotification(title, message, data);

    return notification;
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return this.notifications;
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyPropertyChange('notifications', this.notifications);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => (n.isRead = true));
    this.saveNotifications();
    this.notifyPropertyChange('notifications', this.notifications);
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
      this.notifyPropertyChange('notifications', this.notifications);
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyPropertyChange('notifications', this.notifications);
    LocalNotifications.cancel([]);
  }

  /**
   * Notification handlers for different ride events
   */
  notifyRideRequested(rideId: string): void {
    this.createNotification(
      'driver',
      'New Ride Request',
      'A passenger is looking for a ride nearby',
      'ride_request',
      { rideId }
    );
  }

  notifyRideAccepted(driverName: string): void {
    this.createNotification(
      'rider',
      'Ride Accepted',
      `${driverName} is on the way to pick you up`,
      'ride_accepted'
    );
  }

  notifyDriverArrived(driverName: string): void {
    this.createNotification(
      'rider',
      'Driver Arrived',
      `${driverName} has arrived at your location`,
      'ride_started'
    );
  }

  notifyRideStarted(): void {
    this.createNotification(
      'rider',
      'Ride Started',
      'Your ride has started. Enjoy your trip!',
      'ride_started'
    );
  }

  notifyRideCompleted(fare: number): void {
    this.createNotification(
      'rider',
      'Ride Completed',
      `Your ride is complete. Total fare: $${fare.toFixed(2)}`,
      'ride_completed'
    );
  }

  notifyPaymentProcessed(amount: number): void {
    this.createNotification(
      'rider',
      'Payment Processed',
      `Payment of $${amount.toFixed(2)} has been processed`,
      'payment'
    );
  }

  /**
   * Setup push notification handlers (for production with Firebase)
   */
  setupPushNotifications(): void {
    // In production, this would integrate with Firebase Cloud Messaging
    // For now, we'll just log
    console.log('Push notifications setup (mock mode)');

    // Example of what would be implemented:
    // firebase.messaging().onMessage((payload) => {
    //   this.createNotification(
    //     payload.data.userId,
    //     payload.notification.title,
    //     payload.notification.body,
    //     payload.data.type,
    //     payload.data
    //   );
    // });
  }
}

export default NotificationService.getInstance();
