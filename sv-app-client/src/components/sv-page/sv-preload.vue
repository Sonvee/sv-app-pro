<template>
  <text :prop="theme" :change:prop="preload.themeObserver"></text>
</template>

<script>
import { useSysStore } from '@/store/sys'
export default {
  data() {
    return {}
  },
  watch: {},
  computed: {
    theme() {
      return useSysStore().getTheme()
    }
  },
  // #ifdef APP-PLUS
  watch: {
    theme(newVal) {
      plus.nativeUI.setUIStyle(newVal)
    }
  },
  // #endif
  methods: {
    change(e) {
      useSysStore().setTheme(e)
    }
  }
}
</script>

<script module="preload" lang="wxs">
module.exports = {
  themeObserver: function(newValue, oldValue, ownerInstance, instance) {
    if (newValue) {
      // #ifndef MP-WEIXIN
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newValue);
      ownerInstance.callMethod('change', newValue)
      // #endif
    }
  }
}
</script>

<style lang="scss"></style>
