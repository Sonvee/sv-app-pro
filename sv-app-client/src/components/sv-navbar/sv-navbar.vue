<template>
  <view class="sv-navbar" :style="[navStyle, scrollOpacity ? opacityStyle : '']">
    <view class="navbar-left">
      <slot name="left">
        <text v-if="!isTabbar" class="cuIcon-back text-xxl padding-lr-sm" @click="onBack"></text>
      </slot>
    </view>
    <view class="navbar-center text-line-1">
      <slot>{{ pageTitle ?? routeTitle }}</slot>
    </view>
    <view class="navbar-right">
      <slot name="right"></slot>
    </view>
  </view>
  <view class="sv-navbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { computed } from 'vue'
import { useSysStore } from '@/store/sys'
import { getPageRoute } from '@/utils/page-router'

const props = defineProps({
  // 自定义页面标题 - 不设默认值将会自动根据页面路由查找标题
  pageTitle: {
    type: String
  },
  placeholder: {
    type: Boolean,
    default: true
  },
  bgColor: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: true
  },
  effect: {
    type: [Object, Boolean],
    default: () => {
      return {
        frosted: true, // 磨砂特效
        glass: true // 毛玻璃特效
      }
    }
  },
  // 是否开启滚动透明度
  scrollOpacity: {
    type: Boolean,
    default: false
  },
  // 距离顶部多少时才开始显示navbar
  scrollY: {
    type: Number,
    default: 0
  },
  // 当前页面距离顶部位置px，由页面监听onPageScroll传入
  scrollTop: {
    type: Number,
    default: 0
  }
})

const sysStore = useSysStore()

const navStyle = computed(() => {
  let { effect, bgColor, border } = props
  if (effect === true) effect = { frosted: true, glass: true } // 如果 effect 为 true，则默认开启全特效
  return {
    '--navbar-color': bgColor, // 背景颜色
    'boxShadow': border ? 'var(--navbar-border)' : '', // 边框
    'backgroundImage': effect?.frosted ? 'var(--frosted-effect)' : '', // 磨砂特效
    'backdropFilter': effect?.glass ? 'var(--glass-effect)' : '' // 毛玻璃特效
  }
})

const opacityStyle = computed(() => {
  const { scrollY, scrollTop } = props
  let opacityVal = 0
  if (scrollTop >= scrollY) {
    opacityVal = (1 / 80) * (scrollTop - scrollY)
  } else {
    // 当未超过阈值时，需隐藏且事件穿透
    return { opacity: 0, pointerEvents: 'none' }
  }
  opacityVal = opacityVal > 1 ? 1 : opacityVal
  return { opacity: opacityVal }
})

const pageRoute = computed(() => getPageRoute())
const isTabbar = computed(() => sysStore.tabBarList?.includes(pageRoute.value))

const routeTitle = computed(() => {
  const findPage = sysStore.routeTable?.find((item) => item.url == pageRoute.value)
  return findPage?.name
})

const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight + 'px'
})

function onBack() {
  if (!isTabbar.value) {
    uni.navigateBack()
  }
}
</script>

<style lang="scss">
$sv-navbar-height: calc(88rpx + v-bind(statusBarHeight));

.sv-navbar-placeholder {
  width: 0;
  height: $sv-navbar-height;
  background: transparent;
}

.sv-navbar {
  width: 100%;
  height: $sv-navbar-height;
  position: fixed;
  top: 0;
  padding-top: v-bind(statusBarHeight);
  z-index: 988;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  // 下边框
  --navbar-border: 0 1px var(--shadow-color);
  // box-shadow: var(--navbar-border); // 以动态style方式设置

  // 模糊特效
  --navbar-color: var(--bg-color);
  --frosted-effect: radial-gradient(transparent 2rpx, var(--navbar-color) 8rpx);
  // background-image: var(--frosted-effect); // 以动态style方式设置
  background-size: 8rpx 8rpx;

  --glass-effect: saturate(50%) blur(8rpx);
  // backdrop-filter: var(--glass-effect);

  .navbar-left,
  .navbar-right {
    min-width: 25%;
  }
  .navbar-right {
    text-align: right;
  }

  .navbar-center {
    flex: 1;
    font-size: 28rpx;
    text-align: center;
  }
}
</style>
