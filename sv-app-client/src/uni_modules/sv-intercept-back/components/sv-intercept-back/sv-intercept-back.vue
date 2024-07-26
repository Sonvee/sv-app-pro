<template>
  <!-- #ifdef MP-WEIXIN -->
  <!-- 微信小程序使用page-container方式拦截返回 -->
  <page-container
    :show="showPageContainer"
    :duration="false"
    :overlay="false"
    @beforeleave="beforeBack"
  ></page-container>
  <!-- #endif -->
</template>

<script>
export default {
  props: {
    // 是否开启拦截
    show: {
      type: Boolean,
      default: true
    },
    /**
     * 拦截前操作
     * @description 需返回布尔类型决定是否正常返回，可接受异步函数
     * @returns {Boolean} true：正常返回，false：拦截返回
     */
    beforeIntercept: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showPageContainer: true,
      quitFlag: true
    }
  },
  watch: {
    show: {
      handler(newVal) {
        // #ifndef MP-WEIXIN
        if (newVal) {
          this.interceptBack()
        } else {
          uni.removeInterceptor('navigateBack')
        }
        // #endif

        // #ifdef MP-WEIXIN
        this.showPageContainer = newVal
        // #endif
      },
      immediate: true
    }
  },
  methods: {
    // APP、H5拦截返回
    interceptBack() {
      uni.addInterceptor('navigateBack', {
        invoke: async () => {
          if (this.quitFlag) {
            const isBack = await this.beforeIntercept()
            if (isBack) {
              // 正常返回
              this.quitFlag = false
              this.$emit('backConfirm')
              uni.navigateBack({ delta: 1 })
              return false
            } else {
              // 拦截返回
              this.$emit('backCancel')
            }
            return false
          }
        },
        complete: () => {
          // 删除拦截器
          uni.removeInterceptor('navigateBack')
        }
      })
    },
    // 微信小程序拦截返回
    async beforeBack() {
      if (!this.show) return
      this.showPageContainer = false // 必须先隐藏page-container

      const isBack = await this.beforeIntercept()
      if (isBack) {
        this.$emit('backConfirm')
        uni.navigateBack({ delta: 1 })
      } else {
        this.$emit('backCancel')
        this.showPageContainer = true
      }
    }
  }
}
</script>

<style></style>
