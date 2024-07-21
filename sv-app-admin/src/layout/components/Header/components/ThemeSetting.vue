<template>
  <div class="theme-setting">
    <i class="sv-icons-skin toolBar-icon" @click="openDrawer"></i>
  </div>
</template>

<script setup>
import mittBus from '@/utils/mittBus'

const openDrawer = () => {
  mittBus.emit('openThemeDrawer')
}
</script>
