<script lang="ts">
  import { MapView, Marker } from '@nativescript/google-maps';
  import { getCurrentLocation } from '@nativescript/core/location';
  import { alert, Frame } from '@nativescript/core';
  import { navigate } from 'svelte-native';
  import { onMount } from 'svelte';
  import AuthService from '../services/auth.service';
  import RideService from '../services/ride.service';
  import NotificationService from '../services/notification.service';
  import Config from '../config/config';
  import { User, Ride } from '../models/types';
  import RideTracking from './RideTracking.svelte';
  import RideHistory from './RideHistory.svelte';
  import Profile from './Profile.svelte';
  import Login from './Login.svelte';

  let user: User | null = null;
  let userLocation = { latitude: 0, longitude: 0 };
  let destination = null;
  let mapView;
  let currentRide: Ride | null = null;
  let loading = false;
  let showMenu = false;

  onMount(async () => {
    // Check authentication
    user = AuthService.getCurrentUser();
    if (!user) {
      navigate({
        page: Login,
        clearHistory: true,
      });
      return;
    }

    // Check for active ride
    currentRide = RideService.getCurrentRide();
    if (currentRide) {
      // Navigate to ride tracking if there's an active ride
      navigate({
        page: RideTracking,
        props: { ride: currentRide },
        clearHistory: false,
      });
    }

    // Get user location
    await getUserLocation();
  });

  async function getUserLocation() {
    try {
      const location = await getCurrentLocation({
        desiredAccuracy: 3,
        updateDistance: 10,
        maximumAge: 20000,
      });
      userLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Error getting location. Please enable location services.');
    }
  }

  function onMapReady(event) {
    mapView = event.object;
  }

  async function bookRide() {
    if (!destination) {
      alert('Please select a destination first');
      return;
    }

    if (userLocation.latitude === 0 || userLocation.longitude === 0) {
      alert('Unable to get your current location. Please try again.');
      return;
    }

    loading = true;

    const result = await RideService.requestRide(userLocation, destination);

    loading = false;

    if (result.success && result.ride) {
      NotificationService.notifyRideRequested(result.ride.id);

      alert({
        title: 'Ride Requested',
        message: `Estimated fare: $${result.ride.fare?.toFixed(2)}\nDistance: ${result.ride.distance?.toFixed(1)} km\nDuration: ~${result.ride.duration} min`,
        okButtonText: 'OK',
      });

      // Navigate to ride tracking
      navigate({
        page: RideTracking,
        props: { ride: result.ride },
        clearHistory: false,
      });
    } else {
      alert(result.error || 'Failed to request ride');
    }
  }

  function onMapTap(args) {
    destination = {
      latitude: args.position.latitude,
      longitude: args.position.longitude,
    };
  }

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function goToProfile() {
    navigate({
      page: Profile,
      clearHistory: false,
    });
    showMenu = false;
  }

  function goToHistory() {
    navigate({
      page: RideHistory,
      clearHistory: false,
    });
    showMenu = false;
  }

  function clearDestination() {
    destination = null;
  }
</script>

<page class="page">
  <actionBar title="URide" class="action-bar">
    <actionItem
      text="☰"
      ios.position="left"
      android.position="actionBar"
      on:tap={toggleMenu}
    />
  </actionBar>

  <gridLayout rows="*, auto">
    <!-- Map View -->
    <mapView
      row="0"
      apiKey={Config.GOOGLE_MAPS_API_KEY}
      on:mapReady={onMapReady}
      on:coordinateTapped={onMapTap}
      latitude={userLocation.latitude}
      longitude={userLocation.longitude}
      zoom={Config.DEFAULT_ZOOM_LEVEL}
      bearing={0}
      tilt={0}
      padding="50"
    >
      {#if userLocation.latitude !== 0}
        <marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          title="You are here"
          color="#4cd964"
        />
      {/if}
      {#if destination}
        <marker
          latitude={destination.latitude}
          longitude={destination.longitude}
          title="Destination"
          color="#ff3b30"
        />
      {/if}
    </mapView>

    <!-- Bottom Panel -->
    <stackLayout row="1" class="bottom-panel">
      {#if user}
        <!-- User Info Header -->
        <stackLayout orientation="horizontal" class="user-header">
          <label text="{user.firstName} {user.lastName}" class="user-name" />
          <label text="⭐ {user.rating?.toFixed(1) || '5.0'}" class="user-rating" />
        </stackLayout>

        <!-- Destination Info -->
        {#if destination}
          <stackLayout class="destination-info">
            <stackLayout orientation="horizontal" class="destination-header">
              <label text="📍 Destination Selected" class="destination-label" />
              <label text="✕" on:tap={clearDestination} class="clear-button" />
            </stackLayout>
            <label
              text="Lat: {destination.latitude.toFixed(4)}, Lng: {destination.longitude.toFixed(4)}"
              class="destination-coords"
            />
          </stackLayout>
        {:else}
          <label text="👆 Tap on map to set destination" class="instruction" />
        {/if}

        <!-- Book Ride Button -->
        <button
          text={loading ? 'Requesting Ride...' : 'Book Ride'}
          class="btn btn-book"
          on:tap={bookRide}
          isEnabled={!loading && destination !== null}
        />
      {/if}
    </stackLayout>

    <!-- Side Menu Overlay -->
    {#if showMenu}
      <stackLayout row="0" rowSpan="2" class="menu-overlay" on:tap={toggleMenu}>
        <stackLayout class="menu-panel" on:tap={(e) => e.stopPropagation()}>
          <stackLayout class="menu-header">
            <label text="Menu" class="menu-title" />
            <label text="✕" on:tap={toggleMenu} class="menu-close" />
          </stackLayout>

          <stackLayout class="menu-items">
            <stackLayout class="menu-item" on:tap={goToProfile}>
              <label text="👤 Profile" class="menu-item-text" />
            </stackLayout>

            <stackLayout class="menu-item" on:tap={goToHistory}>
              <label text="📋 Ride History" class="menu-item-text" />
            </stackLayout>

            <stackLayout class="menu-item">
              <label text="💳 Payment Methods" class="menu-item-text" />
            </stackLayout>

            <stackLayout class="menu-item">
              <label text="⚙️ Settings" class="menu-item-text" />
            </stackLayout>

            <stackLayout class="menu-item">
              <label text="❓ Help & Support" class="menu-item-text" />
            </stackLayout>
          </stackLayout>
        </stackLayout>
      </stackLayout>
    {/if}
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

  .bottom-panel {
    background-color: #fff;
    padding: 15;
    border-top-left-radius: 20;
    border-top-right-radius: 20;
  }

  .user-header {
    horizontal-align: space-between;
    margin-bottom: 15;
    padding: 10;
    background-color: #f8f8f8;
    border-radius: 10;
  }

  .user-name {
    font-size: 16;
    font-weight: bold;
    color: #000;
  }

  .user-rating {
    font-size: 14;
    color: #666;
  }

  .instruction {
    font-size: 14;
    text-align: center;
    color: #666;
    margin: 15 0;
  }

  .destination-info {
    background-color: #e8f5e9;
    padding: 12;
    border-radius: 10;
    margin-bottom: 15;
  }

  .destination-header {
    horizontal-align: space-between;
    margin-bottom: 5;
  }

  .destination-label {
    font-size: 14;
    font-weight: bold;
    color: #2e7d32;
  }

  .clear-button {
    font-size: 18;
    color: #666;
    padding: 5;
  }

  .destination-coords {
    font-size: 12;
    color: #666;
  }

  .btn {
    font-size: 16;
    font-weight: bold;
    padding: 15;
    border-radius: 10;
  }

  .btn-book {
    background-color: #000;
    color: #fff;
  }

  .menu-overlay {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .menu-panel {
    width: 280;
    height: 100%;
    background-color: #fff;
    horizontal-align: left;
  }

  .menu-header {
    background-color: #000;
    padding: 20;
    color: #fff;
  }

  .menu-title {
    font-size: 24;
    font-weight: bold;
    color: #fff;
  }

  .menu-close {
    font-size: 24;
    color: #fff;
    position: absolute;
    right: 20;
    top: 20;
  }

  .menu-items {
    padding: 10;
  }

  .menu-item {
    padding: 15;
    margin-bottom: 5;
    border-radius: 8;
    background-color: #f8f8f8;
  }

  .menu-item-text {
    font-size: 16;
    color: #333;
  }
</style>
