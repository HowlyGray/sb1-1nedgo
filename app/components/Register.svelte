<script lang="ts">
  import { navigate } from 'svelte-native';
  import { alert } from '@nativescript/core';
  import AuthService from '../services/auth.service';
  import Config from '../config/config';
  import Home from './Home.svelte';
  import Login from './Login.svelte';

  let userType = '';
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let password = '';
  let confirmPassword = '';
  let carModel = '';
  let licensePlate = '';
  let loading = false;

  async function onRegister() {
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    if (password.length < Config.MIN_PASSWORD_LENGTH) {
      alert(`Password must be at least ${Config.MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    loading = true;

    const result = await AuthService.register({
      userType: userType as 'rider' | 'driver',
      firstName,
      lastName,
      email,
      phone,
      password,
      ...(userType === 'driver' && { carModel, licensePlate })
    });

    loading = false;

    if (result.success && result.user) {
      console.log('User registered successfully:', result.user);
      navigate({
        page: Home,
        clearHistory: true
      });
    } else {
      alert(result.error || 'Registration failed');
    }
  }

  function validateForm() {
    if (!userType || !firstName || !lastName || !email || !phone || !password || !confirmPassword) return false;
    if (userType === 'driver' && (!carModel || !licensePlate)) return false;
    return true;
  }

  function goToLogin() {
    navigate({
      page: Login,
      clearHistory: false,
    });
  }
</script>

<page>
  <actionBar title="Register" />
  <scrollView>
    <stackLayout class="p-4">
      <label text="Join URide" class="h1 text-center" />
      
      <stackLayout class="form">
        <label text="I want to:" class="label" />
        <gridLayout columns="*, *" class="m-b-20">
          <button
            col="0"
            text="Ride"
            class:active={userType === 'rider'}
            on:tap={() => userType = 'rider'}
          />
          <button
            col="1"
            text="Drive"
            class:active={userType === 'driver'}
            on:tap={() => userType = 'driver'}
          />
        </gridLayout>
        
        <label text="First Name" class="label" />
        <textField
          bind:text={firstName}
          hint="Enter your first name"
          class="input"
        />
        
        <label text="Last Name" class="label" />
        <textField
          bind:text={lastName}
          hint="Enter your last name"
          class="input"
        />
        
        <label text="Email" class="label" />
        <textField
          bind:text={email}
          hint="Enter your email"
          keyboardType="email"
          autocorrect="false"
          autocapitalizationType="none"
          class="input"
        />
        
        <label text="Phone" class="label" />
        <textField
          bind:text={phone}
          hint="Enter your phone number"
          keyboardType="phone"
          class="input"
        />

        <label text="Password" class="label" />
        <textField
          bind:text={password}
          hint="Enter your password"
          secure={true}
          class="input"
        />

        <label text="Confirm Password" class="label" />
        <textField
          bind:text={confirmPassword}
          hint="Confirm your password"
          secure={true}
          class="input"
        />

        {#if userType === 'driver'}
          <label text="Car Model" class="label" />
          <textField
            bind:text={carModel}
            hint="Enter your car model"
            class="input"
          />
          
          <label text="License Plate" class="label" />
          <textField
            bind:text={licensePlate}
            hint="Enter your license plate"
            autocapitalizationType="allCharacters"
            class="input"
          />
        {/if}
        
        <button
          text={loading ? 'Registering...' : 'Register'}
          class="-primary"
          on:tap={onRegister}
          isEnabled={!loading}
        />

        <stackLayout orientation="horizontal" class="login-link">
          <label text="Already have an account? " class="text-gray" />
          <label text="Login" on:tap={goToLogin} class="text-link" />
        </stackLayout>
      </stackLayout>
    </stackLayout>
  </scrollView>
</page>

<style>
  .h1 {
    font-size: 24;
    font-weight: bold;
    margin: 20 0;
  }
  
  .form {
    margin: 20 0;
  }
  
  .label {
    margin: 10 0 5 0;
    color: #666;
  }
  
  .input {
    margin-bottom: 15;
    padding: 10;
    border-width: 1;
    border-color: #ccc;
    border-radius: 5;
  }
  
  button {
    margin: 5;
    padding: 15 10;
  }
  
  button.active {
    background-color: #000;
    color: #fff;
  }
  
  .-primary {
    margin-top: 20;
    background-color: #000;
    color: #fff;
  }

  .login-link {
    horizontal-align: center;
    margin-top: 15;
  }

  .text-gray {
    font-size: 14;
    color: #666;
  }

  .text-link {
    font-size: 14;
    color: #007aff;
    font-weight: bold;
  }
</style>