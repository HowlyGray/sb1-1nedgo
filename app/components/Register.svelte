<script lang="ts">
  import { navigate } from 'svelte-native'
  
  let userType = ''
  let firstName = ''
  let lastName = ''
  let email = ''
  let phone = ''
  let carModel = ''
  let licensePlate = ''
  
  function onRegister() {
    if (!validateForm()) {
      alert('Please fill all required fields')
      return
    }
    
    // In a real app, you'd send this to a backend
    const userData = {
      userType,
      firstName,
      lastName,
      email,
      phone,
      ...(userType === 'driver' && { carModel, licensePlate })
    }
    
    console.log('User registered:', userData)
    navigate({
      page: './Home.svelte',
      clearHistory: true
    })
  }
  
  function validateForm() {
    if (!userType || !firstName || !lastName || !email || !phone) return false
    if (userType === 'driver' && (!carModel || !licensePlate)) return false
    return true
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
        
        <button text="Register" class="-primary" on:tap={onRegister} />
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
</style>