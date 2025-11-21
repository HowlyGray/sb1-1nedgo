import ApiService from './api.service';
import StorageService from './storage.service';
import { Rating, Ride } from '../models/types';

/**
 * Service for handling ratings and reviews
 */
export class RatingService {
  private static instance: RatingService;

  private constructor() {}

  static getInstance(): RatingService {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  /**
   * Submit a rating for a completed ride
   */
  async submitRating(
    rideId: string,
    fromUserId: string,
    toUserId: string,
    rating: number,
    review?: string
  ): Promise<{ success: boolean; rating?: Rating; error?: string }> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        return { success: false, error: 'Rating must be between 1 and 5' };
      }

      // In production, this would call the API
      // const response = await ApiService.post<Rating>('/ratings', {
      //   rideId,
      //   fromUserId,
      //   toUserId,
      //   rating,
      //   review,
      // });

      // Mock implementation
      const newRating: Rating = {
        id: 'rating_' + Date.now(),
        rideId,
        fromUserId,
        toUserId,
        rating,
        review,
        createdAt: new Date(),
      };

      // Save to storage
      const ratings = StorageService.get<Rating[]>('ratings') || [];
      ratings.unshift(newRating);
      StorageService.set('ratings', ratings);

      // Update the ride with the rating
      const rideHistory = StorageService.get<Ride[]>('ride_history') || [];
      const ride = rideHistory.find(r => r.id === rideId);
      if (ride) {
        ride.rating = rating;
        ride.review = review;
        StorageService.set('ride_history', rideHistory);
      }

      console.log('Rating submitted:', newRating);

      return {
        success: true,
        rating: newRating,
      };
    } catch (error) {
      console.error('Submit rating error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit rating',
      };
    }
  }

  /**
   * Get ratings for a user
   */
  async getUserRatings(userId: string): Promise<{ success: boolean; ratings?: Rating[]; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.get<Rating[]>(`/users/${userId}/ratings`);

      const allRatings = StorageService.get<Rating[]>('ratings') || [];
      const userRatings = allRatings.filter(r => r.toUserId === userId);

      return {
        success: true,
        ratings: userRatings,
      };
    } catch (error) {
      console.error('Get user ratings error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get ratings',
      };
    }
  }

  /**
   * Calculate average rating for a user
   */
  async calculateAverageRating(userId: string): Promise<{ success: boolean; average?: number; count?: number; error?: string }> {
    try {
      const result = await this.getUserRatings(userId);

      if (!result.success || !result.ratings) {
        return { success: false, error: result.error };
      }

      const ratings = result.ratings;
      if (ratings.length === 0) {
        return { success: true, average: 0, count: 0 };
      }

      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      const average = sum / ratings.length;

      return {
        success: true,
        average: Math.round(average * 10) / 10, // Round to 1 decimal place
        count: ratings.length,
      };
    } catch (error) {
      console.error('Calculate average rating error:', error);
      return {
        success: false,
        error: error.message || 'Failed to calculate average rating',
      };
    }
  }

  /**
   * Get rating breakdown (number of 1-star, 2-star, etc.)
   */
  async getRatingBreakdown(userId: string): Promise<{
    success: boolean;
    breakdown?: { [key: number]: number };
    error?: string;
  }> {
    try {
      const result = await this.getUserRatings(userId);

      if (!result.success || !result.ratings) {
        return { success: false, error: result.error };
      }

      const breakdown: { [key: number]: number } = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      result.ratings.forEach(r => {
        breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
      });

      return {
        success: true,
        breakdown,
      };
    } catch (error) {
      console.error('Get rating breakdown error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get rating breakdown',
      };
    }
  }

  /**
   * Check if a ride has been rated
   */
  async hasRatedRide(rideId: string, userId: string): Promise<boolean> {
    const allRatings = StorageService.get<Rating[]>('ratings') || [];
    return allRatings.some(r => r.rideId === rideId && r.fromUserId === userId);
  }

  /**
   * Get reviews for a user (ratings with text reviews)
   */
  async getUserReviews(userId: string): Promise<{ success: boolean; reviews?: Rating[]; error?: string }> {
    try {
      const result = await this.getUserRatings(userId);

      if (!result.success || !result.ratings) {
        return { success: false, error: result.error };
      }

      // Filter to only include ratings with reviews
      const reviews = result.ratings.filter(r => r.review && r.review.trim() !== '');

      return {
        success: true,
        reviews,
      };
    } catch (error) {
      console.error('Get user reviews error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get reviews',
      };
    }
  }

  /**
   * Report a rating/review
   */
  async reportRating(ratingId: string, reason: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would call the API
      // const response = await ApiService.post(`/ratings/${ratingId}/report`, { reason });

      console.log('Rating reported:', ratingId, reason);

      return { success: true };
    } catch (error) {
      console.error('Report rating error:', error);
      return {
        success: false,
        error: error.message || 'Failed to report rating',
      };
    }
  }
}

export default RatingService.getInstance();
