<template>
  <!-- #ifdef MP-WEIXIN -->
  <!-- 微信小程序使用page-container方式拦截返回 -->
  <page-container
    :show="showPageContainer"
    :duration="false"
    :overlay="false"
    @beforeleave="beforeLeave"
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
     * @description 需返回布尔类型决定是否正常返回，可接收异步函数
     * @returns {Boolean} true：正常返回，false：拦截返回
     * @example 示例
     * 		async function beforeIntercept() {
     * 			const isBack = await new Promise((callback) => {
     * 				uni.showModal({
     * 					title: '系统提示',
     * 					content: '是否退出当前页面',
     * 					success: ({ confirm }) => {
     * 						callback(confirm)
     * 					}
     * 				})
     * 			})
     * 			return isBack
     *		}
     */
    beforeIntercept: {
      type: Function,
      required: true
    },
    /**
     * 自定义返回操作
     * @description 当启用自定义返回操作时，取消默认的返回行为
     */
    customBack: {
      type: Function
    }
  },
  data() {
    return {
      showPageContainer: true // 是否显示微信小程序拦截器
    }
  },
  watch: {
    show: {
      handler(newVal) {
        // #ifndef MP-WEIXIN
        if (newVal) {
          this.createIntercept()
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
    createIntercept() {
      uni.addInterceptor('navigateBack', {
        invoke: async () => {
          const isBack = await this.beforeIntercept()
          if (isBack) {
            // 需要先卸载拦截器再安全返回
            uni.removeInterceptor('navigateBack')
            // 正常返回
            this.$emit('backConfirm')
            // 判断返回事件
            if (this.customBack) {
              // 自定义返回事件
              this.customBack()
            } else {
              // 默认正常返回
              uni.navigateBack({ delta: 1 })
            }
            throw 'back:confirm' // 利用抛出异常来终止后续操作，该行代码不可移除
          } else {
            // 拦截返回
            this.$emit('backCancel')
            throw 'back:cancel' // 利用抛出异常来终止后续操作，该行代码不可移除
          }
        }
      })
    },
    // 微信小程序拦截返回
    async beforeLeave() {
      if (!this.show) return
      this.showPageContainer = false // 必须先隐藏 page-container

      const isBack = await this.beforeIntercept()

      if (isBack) {
        this.$emit('backConfirm')
        // 判断返回事件
        if (this.customBack) {
          // 自定义返回事件
          this.customBack()
        } else {
          // 默认正常返回
          uni.navigateBack({ delta: 1 })
        }
      } else {
        this.$emit('backCancel')
        this.showPageContainer = true // 取消返回则重新显示 page-container
      }
    }
  }
}
</script>

<style lang="scss">
/* #ifdef MP-WEIXIN */
// 微信小程序端使用page-container会导致页面page自动添加 fixed 定位导致无法滑动
page {
  position: relative !important;
}
/* #endif */
</style>
