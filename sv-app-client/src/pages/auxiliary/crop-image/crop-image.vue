<!-- 图片裁剪页 -->
<template>
	<sv-page>
		<limeClipper
			:width="options.width"
			:scale-ratio="2"
			:is-lock-width="false"
			:is-lock-height="false"
			:height="options.height"
			:image-url="path"
			@success="successFn"
			@cancel="cancel"
		/>
	</sv-page>
</template>

<script>
import limeClipper from './limeClipper/limeClipper.vue'
export default {
	components: { limeClipper },
	data() {
		return { path: '', options: { width: 600, height: 600 } }
	},
	onLoad({ path, options }) {
		this.path = path
		if (options) {
			this.options = JSON.parse(options)
		}
	},
	methods: {
		async successFn(e) {
			this.getOpenerEventChannel().emit('crop_image_success', e.url)
			uni.navigateBack()
		},
		cancel() {
			uni.navigateBack()
		}
	}
}
</script>

<style></style>
