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
		 * @description 需返回布尔类型决定是否正常返回，可接收异步函数
		 * @returns {Boolean} true：正常返回，false：拦截返回
		 */
		beforeIntercept: {
			type: Function,
			required: true
		},
		// 自定义返回操作
		customBack: {
			type: Function
		}
	},
	data() {
		return {
			showPageContainer: true
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
				invoke: async (res) => {
					const isBack = await this.beforeIntercept()
					if (isBack) {
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
						return false
					} else {
						// 拦截返回
						this.$emit('backCancel')
					}
				},
				complete: () => {}
			})
		},
		// 微信小程序拦截返回
		async beforeBack() {
			if (!this.show) return
			this.showPageContainer = false // 必须先隐藏page-container

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
				this.showPageContainer = true
			}
		}
	}
}
</script>

<style></style>
