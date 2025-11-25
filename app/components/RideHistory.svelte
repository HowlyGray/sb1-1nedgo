<script lang="ts">
  import { navigate } from 'svelte-native';
  import { onMount } from 'svelte';
  import RideService from '../services/ride.service';
  import { Ride, RideStatus } from '../models/types';

  let rides: Ride[] = [];
  let loading = true;

  onMount(async () => {
    await loadRides();
  });

  async function loadRides() {
    loading = true;
    const result = await RideService.getRideHistory();

    if (result.success && result.rides) {
      rides = result.rides;
    }

    loading = false;
  }

  function formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getStatusColor(status: RideStatus): string {
    switch (status) {
      case RideStatus.COMPLETED:
        return '#4cd964';
      case RideStatus.CANCELLED:
        return '#ff3b30';
      case RideStatus.IN_PROGRESS:
        return '#007aff';
      default:
        return '#666';
    }
  }

  function getStatusText(status: RideStatus): string {
    switch (status) {
      case RideStatus.REQUESTED:
        return 'Requested';
      case RideStatus.ACCEPTED:
        return 'Accepted';
      case RideStatus.DRIVER_ARRIVED:
        return 'Driver Arrived';
      case RideStatus.IN_PROGRESS:
        return 'In Progress';
      case RideStatus.COMPLETED:
        return 'Completed';
      case RideStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  }

  function goBack() {
    navigate({ page: null, backstackVisible: false });
  }
</script>

<page class="page">
  <actionBar title="Ride History" class="action-bar">
    <navigationButton text="Back" android.systemIcon="ic_menu_back" on:tap={goBack} />
  </actionBar>

  <scrollView>
    <stackLayout class="container">
      {#if loading}
        <activityIndicator busy={true} class="loader" />
        <label text="Loading ride history..." class="loading-text" />
      {:else if rides.length === 0}
        <stackLayout class="empty-state">
          <label text="📋" class="empty-icon" />
          <label text="No Rides Yet" class="empty-title" />
          <label text="Your ride history will appear here" class="empty-subtitle" />
        </stackLayout>
      {:else}
        {#each rides as ride (ride.id)}
          <stackLayout class="ride-card">
            <!-- Ride Header -->
            <stackLayout orientation="horizontal" class="ride-header">
              <label text={formatDate(ride.requestedAt)} class="ride-date" />
              <label
                text={getStatusText(ride.status)}
                class="ride-status"
                style="color: {getStatusColor(ride.status)}"
              />
            </stackLayout>

            <!-- Locations -->
            <stackLayout class="locations">
              <stackLayout orientation="horizontal" class="location-row">
                <label text="🟢" class="location-icon" />
                <label
                  text={ride.pickupLocation.address || `${ride.pickupLocation.latitude.toFixed(4)}, ${ride.pickupLocation.longitude.toFixed(4)}`}
                  class="location-text"
                  textWrap={true}
                />
              </stackLayout>

              <label text="⋮" class="location-divider" />

              <stackLayout orientation="horizontal" class="location-row">
                <label text="🔴" class="location-icon" />
                <label
                  text={ride.dropoffLocation.address || `${ride.dropoffLocation.latitude.toFixed(4)}, ${ride.dropoffLocation.longitude.toFixed(4)}`}
                  class="location-text"
                  textWrap={true}
                />
              </stackLayout>
            </stackLayout>

            <!-- Ride Details -->
            <stackLayout orientation="horizontal" class="ride-details">
              {#if ride.distance}
                <label text="{ride.distance.toFixed(1)} km" class="detail-item" />
              {/if}
              {#if ride.duration}
                <label text="{ride.duration} min" class="detail-item" />
              {/if}
              {#if ride.fare}
                <label text="${ride.fare.toFixed(2)}" class="detail-item fare" />
              {/if}
            </stackLayout>

            <!-- Rating -->
            {#if ride.rating}
              <stackLayout orientation="horizontal" class="rating">
                <label text="Rating: " class="rating-label" />
                <label text="⭐".repeat(ride.rating) class="stars" />
              </stackLayout>
            {/if}

            {#if ride.review}
              <label text={ride.review} class="review" textWrap={true} />
            {/if}
          </stackLayout>
        {/each}
      {/if}
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
    padding: 15;
  }

  .loader {
    width: 50;
    height: 50;
    margin: 50 auto 20 auto;
  }

  .loading-text {
    text-align: center;
    color: #666;
    font-size: 16;
  }

  .empty-state {
    margin-top: 100;
    horizontal-align: center;
  }

  .empty-icon {
    font-size: 60;
    text-align: center;
    margin-bottom: 20;
  }

  .empty-title {
    font-size: 22;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10;
    color: #333;
  }

  .empty-subtitle {
    font-size: 16;
    text-align: center;
    color: #666;
  }

  .ride-card {
    background-color: #fff;
    padding: 15;
    margin-bottom: 15;
    border-radius: 10;
  }

  .ride-header {
    margin-bottom: 15;
    horizontal-align: space-between;
  }

  .ride-date {
    font-size: 14;
    color: #666;
  }

  .ride-status {
    font-size: 14;
    font-weight: bold;
  }

  .locations {
    margin-bottom: 15;
  }

  .location-row {
    margin-bottom: 5;
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
    margin-bottom: -5;
  }

  .ride-details {
    margin-bottom: 10;
    horizontal-align: space-between;
  }

  .detail-item {
    font-size: 14;
    color: #666;
    padding: 5 10;
    background-color: #f8f8f8;
    border-radius: 5;
  }

  .detail-item.fare {
    font-weight: bold;
    color: #000;
  }

  .rating {
    margin-bottom: 10;
  }

  .rating-label {
    font-size: 14;
    color: #666;
  }

  .stars {
    font-size: 14;
  }

  .review {
    font-size: 14;
    color: #333;
    font-style: italic;
    padding: 10;
    background-color: #f8f8f8;
    border-radius: 5;
  }
</style>
