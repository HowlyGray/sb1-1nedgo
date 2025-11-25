<script lang="ts">
  import { navigate } from 'svelte-native';
  import { alert, confirm } from '@nativescript/core';
  import { onMount } from 'svelte';
  import AuthService from '../services/auth.service';
  import RatingService from '../services/rating.service';
  import { User } from '../models/types';
  import Login from './Login.svelte';

  let user: User | null = null;
  let averageRating = 0;
  let totalRatings = 0;
  let editing = false;

  // Editable fields
  let firstName = '';
  let lastName = '';
  let phone = '';
  let email = '';

  onMount(async () => {
    user = AuthService.getCurrentUser();
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      phone = user.phone;
      email = user.email;

      // Load rating info
      const ratingResult = await RatingService.calculateAverageRating(user.id);
      if (ratingResult.success) {
        averageRating = ratingResult.average || 0;
        totalRatings = ratingResult.count || 0;
      }
    }
  });

  async function handleSave() {
    if (!firstName || !lastName || !phone) {
      alert('Please fill in all required fields');
      return;
    }

    const result = await AuthService.updateProfile({
      firstName,
      lastName,
      phone,
    });

    if (result.success) {
      alert('Profile updated successfully');
      editing = false;
      user = AuthService.getCurrentUser();
    } else {
      alert(result.error || 'Failed to update profile');
    }
  }

  function toggleEdit() {
    editing = !editing;
    if (!editing && user) {
      // Reset fields if canceling
      firstName = user.firstName;
      lastName = user.lastName;
      phone = user.phone;
    }
  }

  async function handleLogout() {
    const result = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result) {
      AuthService.logout();
      navigate({
        page: Login,
        clearHistory: true,
      });
    }
  }

  function goBack() {
    navigate({ page: null, backstackVisible: false });
  }
</script>

<page class="page">
  <actionBar title="Profile" class="action-bar">
    <navigationButton text="Back" android.systemIcon="ic_menu_back" on:tap={goBack} />
  </actionBar>

  <scrollView>
    <stackLayout class="container">
      {#if user}
        <!-- Profile Header -->
        <stackLayout class="profile-header">
          <label text={user.firstName.charAt(0) + user.lastName.charAt(0)} class="avatar" />
          <label text="{user.firstName} {user.lastName}" class="name" />
          <label text={user.userType === 'driver' ? 'Driver' : 'Rider'} class="user-type" />

          <!-- Rating Display -->
          <stackLayout orientation="horizontal" class="rating-display">
            <label text="⭐" class="star-icon" />
            <label text="{averageRating.toFixed(1)}" class="rating-value" />
            <label text="({totalRatings} ratings)" class="rating-count" />
          </stackLayout>

          <label text="{user.totalRides || 0} Total Rides" class="stats" />
        </stackLayout>

        <!-- Profile Information -->
        <stackLayout class="profile-info">
          <label text="Personal Information" class="section-title" />

          <stackLayout class="info-section">
            <label text="First Name" class="label" />
            <textField
              bind:text={firstName}
              isEnabled={editing}
              class="input"
              class:disabled={!editing}
            />

            <label text="Last Name" class="label" />
            <textField
              bind:text={lastName}
              isEnabled={editing}
              class="input"
              class:disabled={!editing}
            />

            <label text="Email" class="label" />
            <textField
              bind:text={email}
              isEnabled={false}
              class="input disabled"
              hint="Email cannot be changed"
            />

            <label text="Phone" class="label" />
            <textField
              bind:text={phone}
              isEnabled={editing}
              keyboardType="phone"
              class="input"
              class:disabled={!editing}
            />
          </stackLayout>

          <!-- Driver Specific Info -->
          {#if user.userType === 'driver'}
            <label text="Vehicle Information" class="section-title" />
            <stackLayout class="info-section">
              <label text="Car Model" class="label" />
              <label text={user.carModel || 'N/A'} class="info-value" />

              <label text="License Plate" class="label" />
              <label text={user.licensePlate || 'N/A'} class="info-value" />
            </stackLayout>
          {/if}

          <!-- Action Buttons -->
          <stackLayout class="actions">
            {#if editing}
              <button text="Save Changes" on:tap={handleSave} class="btn btn-primary" />
              <button text="Cancel" on:tap={toggleEdit} class="btn btn-secondary" />
            {:else}
              <button text="Edit Profile" on:tap={toggleEdit} class="btn btn-primary" />
            {/if}

            <button text="Logout" on:tap={handleLogout} class="btn btn-danger" />
          </stackLayout>
        </stackLayout>
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
    padding: 20;
  }

  .profile-header {
    background-color: #fff;
    padding: 30;
    margin-bottom: 20;
    border-radius: 10;
    horizontal-align: center;
  }

  .avatar {
    width: 80;
    height: 80;
    border-radius: 40;
    background-color: #000;
    color: #fff;
    font-size: 32;
    font-weight: bold;
    text-align: center;
    vertical-align: center;
    margin-bottom: 15;
  }

  .name {
    font-size: 24;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5;
  }

  .user-type {
    font-size: 14;
    color: #666;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 10;
  }

  .rating-display {
    horizontal-align: center;
    margin-bottom: 10;
  }

  .star-icon {
    font-size: 20;
    margin-right: 5;
  }

  .rating-value {
    font-size: 18;
    font-weight: bold;
    margin-right: 5;
  }

  .rating-count {
    font-size: 14;
    color: #666;
  }

  .stats {
    font-size: 14;
    color: #666;
    text-align: center;
  }

  .profile-info {
    background-color: #fff;
    padding: 20;
    border-radius: 10;
  }

  .section-title {
    font-size: 18;
    font-weight: bold;
    margin-bottom: 15;
    margin-top: 10;
    color: #000;
  }

  .info-section {
    margin-bottom: 20;
  }

  .label {
    font-size: 14;
    font-weight: bold;
    margin-bottom: 8;
    color: #333;
  }

  .input {
    font-size: 16;
    padding: 12;
    margin-bottom: 15;
    background-color: #f8f8f8;
    border-radius: 8;
    border-width: 1;
    border-color: #ddd;
  }

  .input.disabled {
    color: #999;
    background-color: #f0f0f0;
  }

  .info-value {
    font-size: 16;
    padding: 12;
    margin-bottom: 15;
    color: #333;
  }

  .actions {
    margin-top: 20;
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

  .btn-danger {
    background-color: #ff3b30;
    color: #fff;
  }
</style>
