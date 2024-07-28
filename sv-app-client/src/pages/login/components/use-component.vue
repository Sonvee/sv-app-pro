<template>
	<view class="use-component">
		<!-- #ifdef H5 -->
		<keep-alive>
			<component :is="curComp"></component>
		</keep-alive>
		<!-- #endif -->

		<!-- #ifndef H5 -->
		<accountLogin v-show="was == 'accountLogin'"></accountLogin>
		<accountRegister v-show="was == 'accountRegister'"></accountRegister>
		<phoneLogin v-show="was == 'phoneLogin'"></phoneLogin>
		<emailLogin v-show="was == 'emailLogin'"></emailLogin>
		<wechatLogin v-show="was == 'wechatLogin'"></wechatLogin>
		<!-- #endif -->
	</view>
</template>

<script setup>
import { computed } from 'vue'
import accountLogin from './account-login.vue'
import accountRegister from './account-register.vue'
import phoneLogin from './phone-login.vue'
import emailLogin from './email-login.vue'
import wechatLogin from './wechat-login.vue'

const props = defineProps({
	was: {
		type: String,
		required: true
	}
})

const compMap = {
	accountLogin,
	accountRegister,
	phoneLogin,
	emailLogin,
	wechatLogin
}

const curComp = computed(() => {
	return compMap[props.was]
})
</script>

<style lang="scss">
.use-component {
	width: 100%;
	height: 100%;
}
</style>
