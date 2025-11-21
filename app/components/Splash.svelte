<script lang="ts">
  import { navigate } from 'svelte-native';
  import { onMount } from 'svelte';
  import Login from './Login.svelte';

  onMount(() => {
    setTimeout(() => {
      navigate({
        page: Login,
        clearHistory: true
      });
    }, 2000);
  });
</script>

<page>
  <gridLayout rows="*" class="splash">
    <stackLayout horizontalAlignment="center" verticalAlignment="center">
      <image src="~/images/logo.png" width="150" height="150" />
      <label text="URide" class="logo-text" />
    </stackLayout>
  </gridLayout>
</page>

<style>
  .splash {
    background-color: #000;
  }
  .logo-text {
    color: #fff;
    font-size: 40;
    font-weight: bold;
    margin-top: 20;
  }
</style>