import { Application } from '@nativescript/core';
import AuthService from './services/auth.service';
import Splash from './components/Splash.svelte';
import Login from './components/Login.svelte';
import Home from './components/Home.svelte';

// Check if user is already logged in
const isLoggedIn = AuthService.isAuthenticated();

// Start with appropriate screen
if (isLoggedIn) {
  Application.run({ create: () => new Home({ target: document.createElement('frame') }) });
} else {
  Application.run({ create: () => new Splash({ target: document.createElement('frame') }) });
}