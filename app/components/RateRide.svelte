<script lang="ts">
  import { navigate } from 'svelte-native';
  import { alert } from '@nativescript/core';
  import RatingService from '../services/rating.service';
  import AuthService from '../services/auth.service';
  import { Ride } from '../models/types';

  export let ride: Ride;

  let selectedRating = 0;
  let review = '';
  let submitting = false;

  function selectRating(rating: number) {
    selectedRating = rating;
  }

  async function submitRating() {
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }

    submitting = true;

    const user = AuthService.getCurrentUser();
    if (!user) {
      alert('User not found');
      submitting = false;
      return;
    }

    // Determine who to rate (driver for rider, rider for driver)
    const toUserId = user.userType === 'rider' ? ride.driverId! : ride.riderId;

    const result = await RatingService.submitRating(
      ride.id,
      user.id,
      toUserId,
      selectedRating,
      review
    );

    submitting = false;

    if (result.success) {
      alert('Thank you for your rating!');
      goBack();
    } else {
      alert(result.error || 'Failed to submit rating');
    }
  }

  function skipRating() {
    goBack();
  }

  function goBack() {
    navigate({ page: null, backstackVisible: false });
  }
</script>

<page class="page">
  <actionBar title="Rate Your Ride" class="action-bar">
    <navigationButton text="Skip" android.systemIcon="ic_menu_close_clear_cancel" on:tap={skipRating} />
  </actionBar>

  <scrollView>
    <stackLayout class="container">
      <label text="How was your ride?" class="title" />
      <label text="Your feedback helps us improve" class="subtitle" />

      <!-- Rating Stars -->
      <stackLayout orientation="horizontal" class="stars-container">
        {#each [1, 2, 3, 4, 5] as rating}
          <label
            text={selectedRating >= rating ? '⭐' : '☆'}
            class="star"
            on:tap={() => selectRating(rating)}
          />
        {/each}
      </stackLayout>

      {#if selectedRating > 0}
        <label text={selectedRating === 5 ? 'Excellent!' : selectedRating === 4 ? 'Great!' : selectedRating === 3 ? 'Good' : selectedRating === 2 ? 'Fair' : 'Poor'} class="rating-text" />
      {/if}

      <!-- Review Text -->
      <label text="Add a review (optional)" class="section-label" />
      <textView
        bind:text={review}
        hint="Share your experience..."
        class="review-input"
        height="120"
      />

      <!-- Submit Button -->
      <button
        text={submitting ? 'Submitting...' : 'Submit Rating'}
        on:tap={submitRating}
        isEnabled={!submitting && selectedRating > 0}
        class="btn btn-primary"
      />

      <button
        text="Skip"
        on:tap={skipRating}
        class="btn btn-secondary"
      />
    </stackLayout>
  </scrollView>
</page>

<style>
  .page {
    background-color: #f5f5f5;
  }

  .action-bar {
    background-color: #000;
    color: #fff;
  }

  .container {
    padding: 30;
  }

  .title {
    font-size: 28;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10;
    color: #000;
  }

  .subtitle {
    font-size: 16;
    text-align: center;
    margin-bottom: 40;
    color: #666;
  }

  .stars-container {
    horizontal-align: center;
    margin-bottom: 20;
  }

  .star {
    font-size: 50;
    padding: 10;
    color: #ffd700;
  }

  .rating-text {
    font-size: 22;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30;
    color: #000;
  }

  .section-label {
    font-size: 16;
    font-weight: bold;
    margin-bottom: 10;
    color: #333;
  }

  .review-input {
    font-size: 16;
    padding: 15;
    margin-bottom: 30;
    background-color: #fff;
    border-radius: 10;
    border-width: 1;
    border-color: #ddd;
  }

  .btn {
    font-size: 16;
    font-weight: bold;
    padding: 15;
    border-radius: 8;
    margin-bottom: 10;
  }

  .btn-primary {
    background-color: #000;
    color: #fff;
  }

  .btn-secondary {
    background-color: #666;
    color: #fff;
  }
</style>
