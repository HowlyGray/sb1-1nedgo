<script lang="ts">
  import { navigate } from 'svelte-native';
  import { alert } from '@nativescript/core';
  import AuthService from '../services/auth.service';
  import Register from './Register.svelte';
  import Home from './Home.svelte';

  let email = '';
  let password = '';
  let loading = false;

  async function handleLogin() {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    loading = true;

    try {
      const result = await AuthService.login({ email, password });

      if (result.success && result.user) {
        console.log('Login successful:', result.user);

        // Navigate to Home screen based on user type
        navigate({
          page: Home,
          clearHistory: true,
        });
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    } finally {
      loading = false;
    }
  }

  function goToRegister() {
    navigate({
      page: Register,
      clearHistory: false,
    });
  }
</script>

<page class="page">
  <actionBar title="Login to URide" class="action-bar" />

  <scrollView>
    <stackLayout class="container">
      <image src="~/images/logo.png" class="logo" />

      <label text="Welcome Back!" class="title" />
      <label text="Login to continue" class="subtitle" />

      <stackLayout class="form">
        <label text="Email" class="label" />
        <textField
          bind:text={email}
          hint="Enter your email"
          keyboardType="email"
          autocorrect={false}
          autocapitalizationType="none"
          class="input"
        />

        <label text="Password" class="label" />
        <textField
          bind:text={password}
          hint="Enter your password"
          secure={true}
          class="input"
        />

        <button
          text={loading ? 'Logging in...' : 'Login'}
          on:tap={handleLogin}
          isEnabled={!loading}
          class="btn btn-primary"
        />

        <stackLayout orientation="horizontal" class="register-link">
          <label text="Don't have an account? " class="text-gray" />
          <label text="Register" on:tap={goToRegister} class="text-link" />
        </stackLayout>

        <label text="Forgot Password?" class="forgot-password" />
      </stackLayout>
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

  .logo {
    width: 120;
    height: 120;
    margin: 20 auto 30 auto;
  }

  .title {
    font-size: 28;
    font-weight: bold;
    text-align: center;
    margin-bottom: 8;
    color: #000;
  }

  .subtitle {
    font-size: 16;
    text-align: center;
    margin-bottom: 40;
    color: #666;
  }

  .form {
    padding: 20;
    background-color: #fff;
    border-radius: 10;
    margin: 0 10;
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
    margin-bottom: 20;
    background-color: #f8f8f8;
    border-radius: 8;
    border-width: 1;
    border-color: #ddd;
  }

  .btn {
    font-size: 16;
    font-weight: bold;
    padding: 15;
    border-radius: 8;
    margin-top: 10;
  }

  .btn-primary {
    background-color: #000;
    color: #fff;
  }

  .register-link {
    horizontal-align: center;
    margin-top: 20;
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

  .forgot-password {
    font-size: 14;
    color: #007aff;
    text-align: center;
    margin-top: 15;
  }
</style>
