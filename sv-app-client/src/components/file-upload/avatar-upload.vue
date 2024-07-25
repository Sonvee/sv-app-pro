<template>
	<uni-file-picker
		v-bind="$attrs"
		class="sv-avatar-upload"
		v-model="avatar"
		:limit="1"
		mode="grid"
		fileMediatype="image"
		:auto-upload="false"
		@select="selectFile"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'
import config from '@/config/index.js'
import { useUserStore } from '@/store/user'
import { avatarUpload } from '@/api/file/upload'

const userStore = useUserStore()

const props = defineProps({
	file: {
		type: Object
	}
})

const avatar = ref(props.file)

async function selectFile(e) {
	const { file } = e.tempFiles[0]
	const path = file.path
	const crop = {
		quality: 100,
		width: 600,
		height: 600,
		resize: true
	}
	uni.navigateTo({
		url: `/pages/auxiliary/crop-image/crop-image?path=${path}&options=${JSON.stringify(crop)}`,
		events: {
			crop_image_success: async (url) => {
				const fileRes = await avatarUpload({ filePath: path })
				if (fileRes.success) {
					userStore.userInfo.avatar = fileRes.data
				}
			}
		}
	})
}
</script>

<style lang="scss">
.sv-avatar-upload {
	width: auto !important;
	flex: unset !important;

	:deep(.uni-file-picker__container) {
		margin: 0;

		.file-picker__box {
			.file-picker__box-content {
				margin: 0;
				border-color: var(--border-tint-color) !important;

				.is-add {
					.icon-add {
						width: 60rpx;
						height: 4rpx;
						background-color: var(--border-tint-color) !important;
					}
				}

				.icon-del-box {
					top: -4px;
					right: -4px;
					height: 20px;
					width: 20px;

					.icon-del {
						width: 10px;
					}
				}
			}
		}
	}
}
</style>
