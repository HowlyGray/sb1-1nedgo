<script lang="ts">
  import { navigate } from 'svelte-native';
  import { alert, confirm } from '@nativescript/core';
  import { onMount, onDestroy } from 'svelte';
  import RideService from '../services/ride.service';
  import AuthService from '../services/auth.service';
  import PaymentService from '../services/payment.service';
  import NotificationService from '../services/notification.service';
  import { Ride, RideStatus, User } from '../models/types';
  import RateRide from './RateRide.svelte';
  import Home from './Home.svelte';

  export let ride: Ride;

  let currentUser: User | null = null;
  let isDriver = false;
  let updateInterval: any;
  let estimatedArrival = '';

  onMount(() => {
    currentUser = AuthService.getCurrentUser();
    isDriver = currentUser?.userType === 'driver';

    // Update estimated arrival time
    updateEstimatedArrival();

    // Poll for ride updates every 5 seconds
    updateInterval = setInterval(() => {
      updateRideStatus();
      updateEstimatedArrival();
    }, 5000);
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  async function updateRideStatus() {
    const currentRide = RideService.getCurrentRide();
    if (currentRide) {
      ride = currentRide;
    }
  }

  function updateEstimatedArrival() {
    if (ride.duration) {
      const now = new Date();
      const eta = new Date(now.getTime() + ride.duration * 60000);
      estimatedArrival = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  async function handleDriverArrived() {
    const result = await RideService.startRide(ride.id);
    if (result.success) {
      ride.status = RideStatus.DRIVER_ARRIVED;
      NotificationService.notifyDriverArrived(currentUser?.firstName || 'Driver');
    } else {
      alert(result.error || 'Failed to update ride status');
    }
  }

  async function handleStartRide() {
    const result = await RideService.startRide(ride.id);
    if (result.success) {
      ride.status = RideStatus.IN_PROGRESS;
      NotificationService.notifyRideStarted();
    } else {
      alert(result.error || 'Failed to start ride');
    }
  }

  async function handleCompleteRide() {
    const result = await RideService.completeRide(ride.id);

    if (result.success) {
      // Process payment
      const paymentResult = await PaymentService.processPayment(ride);

      if (paymentResult.success) {
        NotificationService.notifyRideCompleted(ride.fare || 0);
        NotificationService.notifyPaymentProcessed(ride.fare || 0);

        // Navigate to rating screen
        navigate({
          page: RateRide,
          props: { ride },
          clearHistory: false,
        });
      } else {
        alert('Ride completed but payment failed: ' + paymentResult.error);
      }
    } else {
      alert(result.error || 'Failed to complete ride');
    }
  }

  async function handleCancelRide() {
    const result = await confirm({
      title: 'Cancel Ride',
      message: 'Are you sure you want to cancel this ride?',
      okButtonText: 'Yes, Cancel',
      cancelButtonText: 'No',
    });

    if (result) {
      const cancelResult = await RideService.cancelRide(ride.id);

      if (cancelResult.success) {
        alert('Ride cancelled');
        navigate({
          page: Home,
          clearHistory: true,
        });
      } else {
        alert(cancelResult.error || 'Failed to cancel ride');
      }
    }
  }

  function getStatusMessage(): string {
    switch (ride.status) {
      case RideStatus.REQUESTED:
        return isDriver ? 'New ride request received' : 'Looking for a driver...';
      case RideStatus.ACCEPTED:
        return isDriver ? 'Ride accepted - Navigate to pickup' : 'Driver is on the way!';
      case RideStatus.DRIVER_ARRIVED:
        return isDriver ? 'Waiting for passenger' : 'Driver has arrived';
      case RideStatus.IN_PROGRESS:
        return 'Ride in progress';
      default:
        return 'Unknown status';
    }
  }

  function getStatusIcon(): string {
    switch (ride.status) {
      case RideStatus.REQUESTED:
        return '🔍';
      case RideStatus.ACCEPTED:
        return '🚗';
      case RideStatus.DRIVER_ARRIVED:
        return '📍';
      case RideStatus.IN_PROGRESS:
        return '🛣️';
      default:
        return '📱';
    }
  }
</script>

<page class="page">
  <actionBar title="Active Ride" class="action-bar" />

  <gridLayout rows="*, auto">
    <!-- Map Area (placeholder) -->
    <stackLayout row="0" class="map-container">
      <label text="🗺️" class="map-placeholder-icon" />
      <label text="Map View" class="map-placeholder-text" />
      <label text="(Real-time tracking)" class="map-placeholder-subtext" />
    </stackLayout>

    <!-- Ride Info Panel -->
    <scrollView row="1">
      <stackLayout class="info-panel">
        <!-- Status -->
        <stackLayout class="status-container">
          <label text={getStatusIcon()} class="status-icon" />
          <label text={getStatusMessage()} class="status-text" />
        </stackLayout>

        <!-- Ride Details -->
        <stackLayout class="details-card">
          <stackLayout orientation="horizontal" class="detail-row">
            <label text="🟢" class="location-icon" />
            <label
              text={ride.pickupLocation.address || `${ride.pickupLocation.latitude.toFixed(4)}, ${ride.pickupLocation.longitude.toFixed(4)}`}
              class="location-text"
              textWrap={true}
            />
          </stackLayout>

          <label text="⋮" class="location-divider" />

          <stackLayout orientation="horizontal" class="detail-row">
            <label text="🔴" class="location-icon" />
            <label
              text={ride.dropoffLocation.address || `${ride.dropoffLocation.latitude.toFixed(4)}, ${ride.dropoffLocation.longitude.toFixed(4)}`}
              class="location-text"
              textWrap={true}
            />
          </stackLayout>

          {#if estimatedArrival}
            <stackLayout orientation="horizontal" class="eta-row">
              <label text="⏱️" class="eta-icon" />
              <label text="Estimated Arrival: {estimatedArrival}" class="eta-text" />
            </stackLayout>
          {/if}

          {#if ride.fare}
            <stackLayout orientation="horizontal" class="fare-row">
              <label text="💵" class="fare-icon" />
              <label text="Fare: ${ride.fare.toFixed(2)}" class="fare-text" />
            </stackLayout>
          {/if}
        </stackLayout>

        <!-- Driver Actions -->
        {#if isDriver}
          <stackLayout class="actions">
            {#if ride.status === RideStatus.ACCEPTED}
              <button
                text="I've Arrived"
                on:tap={handleDriverArrived}
                class="btn btn-primary"
              />
            {/if}

            {#if ride.status === RideStatus.DRIVER_ARRIVED}
              <button
                text="Start Ride"
                on:tap={handleStartRide}
                class="btn btn-primary"
              />
            {/if}

            {#if ride.status === RideStatus.IN_PROGRESS}
              <button
                text="Complete Ride"
                on:tap={handleCompleteRide}
                class="btn btn-success"
              />
            {/if}

            {#if ride.status !== RideStatus.IN_PROGRESS}
              <button
                text="Cancel Ride"
                on:tap={handleCancelRide}
                class="btn btn-danger"
              />
            {/if}
          </stackLayout>
        {:else}
          <!-- Rider Actions -->
          <stackLayout class="actions">
            {#if ride.status === RideStatus.REQUESTED || ride.status === RideStatus.ACCEPTED}
              <button
                text="Cancel Ride"
                on:tap={handleCancelRide}
                class="btn btn-danger"
              />
            {/if}

            {#if ride.status === RideStatus.DRIVER_ARRIVED}
              <label text="Your driver is waiting for you!" class="alert-text" />
            {/if}
          </stackLayout>
        {/if}

        <!-- Contact Driver/Rider Button (placeholder) -->
        <button text="📞 Contact {isDriver ? 'Rider' : 'Driver'}" class="btn btn-secondary" />
      </stackLayout>
    </scrollView>
  </gridLayout>
</page>

<style>
  .page {
    background-color: #f5f5f5;
  }

  .action-bar {
    background-color: #000;
    color: #fff;
  }

  .map-container {
    background-color: #e0e0e0;
    vertical-align: center;
    horizontal-align: center;
  }

  .map-placeholder-icon {
    font-size: 80;
    text-align: center;
    margin-bottom: 20;
  }

  .map-placeholder-text {
    font-size: 24;
    text-align: center;
    color: #666;
    margin-bottom: 10;
  }

  .map-placeholder-subtext {
    font-size: 14;
    text-align: center;
    color: #999;
  }

  .info-panel {
    background-color: #fff;
    padding: 20;
    border-top-left-radius: 20;
    border-top-right-radius: 20;
  }

  .status-container {
    margin-bottom: 20;
    horizontal-align: center;
  }

  .status-icon {
    font-size: 40;
    text-align: center;
    margin-bottom: 10;
  }

  .status-text {
    font-size: 18;
    font-weight: bold;
    text-align: center;
    color: #000;
  }

  .details-card {
    background-color: #f8f8f8;
    padding: 15;
    border-radius: 10;
    margin-bottom: 20;
  }

  .detail-row {
    margin-bottom: 10;
  }

  .location-icon {
    font-size: 16;
    margin-right: 10;
    width: 20;
  }

  .location-text {
    font-size: 14;
    color: #333;
    flex-grow: 1;
  }

  .location-divider {
    font-size: 12;
    color: #ccc;
    margin-left: 10;
    margin-top: -5;
    margin-bottom: 5;
  }

  .eta-row, .fare-row {
    margin-top: 10;
    padding-top: 10;
    border-top-width: 1;
    border-top-color: #e0e0e0;
  }

  .eta-icon, .fare-icon {
    font-size: 16;
    margin-right: 10;
  }

  .eta-text, .fare-text {
    font-size: 14;
    font-weight: bold;
    color: #333;
  }

  .actions {
    margin-bottom: 10;
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

  .btn-success {
    background-color: #4cd964;
    color: #fff;
  }

  .btn-danger {
    background-color: #ff3b30;
    color: #fff;
  }

  .alert-text {
    font-size: 16;
    font-weight: bold;
    text-align: center;
    color: #ff9500;
    margin: 10 0;
  }
</style>
