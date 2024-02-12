<template>
  <div class="container mx-auto place-content-center">
    <img alt="logo" src="./assets/evalogo.png">
  </div>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
img {
  width: 30rem;
  height: 8rem;
}

@media screen and (max-width: 500px) {
  img {
    width: 20rem;
    height: 5rem;
  }
}
</style>
