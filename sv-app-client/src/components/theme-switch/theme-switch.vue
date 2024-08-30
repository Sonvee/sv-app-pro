<template>
  <switch
    class="theme-icons blue"
    :class="[isDark ? 'checked' : '']"
    :style="{ transform: 'scale(' + size + ')' }"
    :checked="isDark"
    @change="changeTheme"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  size: {
    type: [String, Number],
    default: 1
  }
})

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
