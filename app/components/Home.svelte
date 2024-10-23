<script lang="ts">
  import { MapView, Marker } from '@nativescript/google-maps'
  import { getCurrentLocation } from '@nativescript/core/location'
  import { alert } from '@nativescript/core'
  
  let userLocation = { latitude: 0, longitude: 0 }
  let destination = null
  let mapView
  
  async function getUserLocation() {
    try {
      const location = await getCurrentLocation({
        desiredAccuracy: 3,
        updateDistance: 10,
        maximumAge: 20000,
      })
      userLocation = {
        latitude: location.latitude,
        longitude: location.longitude
      }
    } catch (error) {
      alert('Error getting location: ' + error)
    }
  }
  
  function onMapReady(event) {
    mapView = event.object
    getUserLocation()
  }
  
  function bookRide() {
    if (!destination) {
      alert('Please select a destination first')
      return
    }
    alert('Booking ride...\nFrom: ' + JSON.stringify(userLocation) + '\nTo: ' + JSON.stringify(destination))
  }
  
  function onMapTap(args) {
    destination = {
      latitude: args.position.latitude,
      longitude: args.position.longitude
    }
  }
</script>

<page>
  <actionBar title="URide" />
  <gridLayout rows="*, auto">
    <mapView
      row="0"
      apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      on:mapReady={onMapReady}
      on:coordinateTapped={onMapTap}
      latitude={userLocation.latitude}
      longitude={userLocation.longitude}
      zoom={15}
      bearing={0}
      tilt={0}
      padding="50"
    >
      {#if userLocation.latitude !== 0}
        <marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          title="You are here"
        />
      {/if}
      {#if destination}
        <marker
          latitude={destination.latitude}
          longitude={destination.longitude}
          title="Destination"
        />
      {/if}
    </mapView>
    
    <stackLayout row="1" class="p-4 bg-white">
      <label text="Tap on map to set destination" class="text-center p-2" />
      <button text="Book Ride" class="-primary p-3" on:tap={bookRide} />
    </stackLayout>
  </gridLayout>
</page>

<style>
  actionBar {
    background-color: #000;
    color: #fff;
  }
  
  button {
    background-color: #000;
    color: #fff;
    border-radius: 5;
  }
</style>