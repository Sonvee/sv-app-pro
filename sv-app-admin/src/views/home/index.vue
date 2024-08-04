<template>
  <div class="home page-container card" v-waterMarker="{ text: 'SV-Admin', textColor: 'rgba(180, 180, 180, 0.6)' }">
    <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" />
  </div>
</template>

<script setup name="home">
import { useAuthStore } from '@/store/auth'

</script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: center;
  justify-content: center;

  .home-bg {
    width: 80%;
    max-width: 1400px;
  }
}
</style>
