<template>
	<sv-page :showNavbar="false">
		<sv-navbar :placeholder="false" :border="false" :effect="false" pageTitle=""></sv-navbar>
		<view class="user-center">
			<info-card></info-card>
			<tabs-swiper></tabs-swiper>
		</view>
	</sv-page>
</template>

<script setup>
import InfoCard from './components/info-card.vue'
import TabsSwiper from './components/tabs-swiper.vue'
</script>

<style lang="scss"></style>
