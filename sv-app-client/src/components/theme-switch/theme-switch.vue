<template>
  <switch
    class="theme-icons blue"
    :class="[isDark ? 'checked' : '']"
    :checked="isDark"
    @change="changeTheme"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSysStore } from '@/store/sys'

const sysStore = useSysStore()
const isDark = computed(() => sysStore.getTheme() == 'dark')
function changeTheme() {
  const themeType = isDark.value ? 'light' : 'dark'
  sysStore.setTheme(themeType)
}
</script>

<style lang="scss">
.theme-icons {
  &::before {
    font-family: 'sv-icons';
    content: '\e62d'; // ☀
  }
  &::after {
    font-family: 'sv-icons';
    content: '\e67c'; // 🌙
  }
}
</style>
