<template>
	<view class="vip-card glass flex-vc" @click="skipPage('/pages/vip/vip', true)">
		<image src="@/assets/svgs/vip_bg.svg" class="bg-image" mode="aspectFill"></image>
		<view class="flex-sub">
			<view class="sv-text-streamer">
				<text class="cuIcon-choiceness"></text>
				{{ vipInfo?.vip ? '尊敬的' + vipInfo?.current.subscription_plan_detail.plan_name + '会员' : '还不是会员哦，点我订阅' }}
			</view>
			<view class="text-green mt-2">
				<text class="cuIcon-crownfill"></text>
				{{ vipInfo?.vip ? '查看我的会员特权' : '查看会员特权' }}
			</view>
		</view>
		<image src="@/assets/svgs/vip_text.svg" class="vip-text"></image>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { skipPage } from '@/utils/util'

const vipInfo = ref({})
onMounted(async () => {
	uni.$on('E_VIP_INFO', (e) => {
		vipInfo.value = e
	})
})
</script>

<style lang="scss">
.vip-card {
	margin: 0 30rpx;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	box-shadow: 0 0 20rpx var(--shadow-color-reverse);

	.vip-text {
		width: 120rpx;
		height: 60rpx;
	}
}
</style>
