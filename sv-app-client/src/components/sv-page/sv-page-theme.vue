<template>
  <view
    class="sv-page-theme"
    :data-theme="theme"
    :prop="theme"
    :change:prop="htmltheme.themeObserver"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    // 获取状态栏高度
    statusBarHeight() {
      return uni.getSystemInfoSync().statusBarHeight + 'px'
    }
  },
  methods: {
    change(e) {
      this.$emit('changeTheme', e)
    }
  }
}
</script>

<script module="htmltheme" lang="wxs">
module.exports = {
  themeObserver: function(newValue, oldValue, ownerInstance, instance) {
    // #ifndef MP-WEIXIN
    if (newValue) {
      document.documentElement.setAttribute('data-theme', newValue)
      ownerInstance.callMethod('change', newValue)
    }
    // #endif
  }
}
</script>

<style lang="scss">
.sv-page-theme {
  // 页面视窗高度（顶部状态栏和底部安全距离除外）
  --page-height: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
  // 页面内容主高度（页面视窗高度 - navbar - tabbar）
  --page-main-height: calc(var(--page-height) - 88rpx - 100rpx);
  // 页面内容无tabbar高度（页面视窗高度 - tabbar）
  --page-notab-height: calc(var(--page-height) - 88rpx);
  // 页面内容无navbar高度（页面视窗高度 - navbar）
  --page-nonav-height: calc(var(--page-height) - 100rpx);

  min-height: 100vh;
  
  /* #ifdef MP-WEIXIN */
  // 微信小程序只能模拟根节点设置主题
  background-color: var(--bg-color);
  color: var(--text-color);
  /* #endif */
  
  // 其他全局变量
  --navbar-height: calc(88rpx + v-bind(statusBarHeight));
  --tabbar-height: calc(100rpx + env(safe-area-inset-bottom));
}
</style>
