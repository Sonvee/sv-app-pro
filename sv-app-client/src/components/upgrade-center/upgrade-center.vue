<template>
	<uv-transition mode="fade" :show="showUpgrade">
		<view class="upgrade-center">
			<view class="uc-card">
				<image class="uc-top" src="@/assets/images/upgrade.png" mode="widthFix"></image>
				<view class="uc-title">{{ title }}</view>
				<view class="uc-content" v-if="hasUpgrade">
					<view class="uc-sub-title text-blue">更新内容</view>
					<view class="uc-detail">
						<mp-html :content="latest?.upgrade" />
					</view>
				</view>
				<view class="uc-content" v-else>
					<view class="uc-detail flex-vhc">该版本已是最新版本</view>
				</view>
				<view class="uc-btn-group">
					<template v-if="!downloading">
						<button v-if="!mandatory" class="cu-btn round bg-gray flex-sub margin-right" @click="close">取消</button>
						<button v-if="hasUpgrade" class="cu-btn round bg-gradual-blue flex-sub" @click="confirm">升级</button>
					</template>
					<view v-else class="cu-progress round striped active">
						<view class="bg-blue" :style="{ width: downloadPercent + '%' }">
							{{ downloadPercent ? downloadPercent + '%' : '' }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</uv-transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { releaseLatest } from '@/api/release/index.js'
import { useDownloadFile } from '@/hooks/useDownloadFile'

const props = defineProps({
	// 是否自动检测，静默请求，不做提示
	auto: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['update:show'])

// 是否显示升级中心弹窗
const showUpgrade = ref(false)

const latest = ref()
const mandatory = ref(false) // 是否强制更新
const downloading = ref(false) // 是否正在下载
const downloadPercent = ref(0) // 下载进度
const hasUpgrade = ref(false) // 是否有更新
const title = computed(() => {
	return hasUpgrade.value ? '发现新版本' : '已是最新版'
})

onMounted(() => {
	if (props.auto) {
		checkUpgrade()
	}
})

function open() {
	showUpgrade.value = true
}
function close() {
	showUpgrade.value = false
}

// 确认更新
function confirm() {
	// #ifdef APP
	downloadResource()
	// #endif
	// #ifndef APP
	uni.showToast({
		title: '请在APP中更新升级',
		icon: 'none'
	})
	// #endif
}

// 资源下载
async function downloadResource() {
	const resource = latest.value?.file?.url || latest.value?.link

	// 初始化下载进度
	downloadPercent.value = 0
	downloading.value = false
	const dfile = useDownloadFile()

	const downloadTask = await dfile.appDownload(resource, 'upgrade/', (filepath) => {
		setTimeout(() => {
			plus.runtime.install(
				filepath,
				{ force: false }, // 是否强制安装 true表示强制安装，不进行版本号的校验；false则需要版本号校验，如果将要安装应用的版本号不高于现有应用的版本号则终止安装，并返回安装失败。 仅安装wgt和wgtu时生效，默认值 false。
				(res) => {
					if (!mandatory.value) close()
				},
				(err) => {}
			)
			downloading.value = false // 结束下载进度
		}, 1000)
	})

	downloading.value = true

	dfile.appDownloadProgress(downloadTask, (download, status) => {
		console.log(download, status)
		if (status === null) {
			uni.showToast({ title: '准备下载', icon: 'none' })
		} else if (status === 200) {
			downloadPercent.value = parseInt((parseFloat(download.downloadedSize) / parseFloat(download.totalSize)) * 100)
		} else {
			uni.showToast({ title: '下载失败', icon: 'none', duration: 2000 })
			downloadTask.abort() // 取消下载任务
			downloadPercent.value = 0
			downloading.value = false
			mandatory.value = false // 改为非强制更新 - 可选操作
		}
	})
}

// 请求线上最新版本信息
async function checkUpgrade() {
	const { auto } = props
	if (!auto) uni.showLoading({ title: '检查更新中' })
	const sysInfo = uni.getSystemInfoSync()
	const curVersion = sysInfo.appWgtVersion || sysInfo.appVersion
	try {
		let releaseRes = await releaseLatest({ type: 'android' })
		if (!auto) uni.hideLoading() // 请求结束关闭loading
		if (releaseRes.success) {
			latest.value = releaseRes.data
			mandatory.value = releaseRes.data?.mandatory
			const latestVersion = releaseRes.data?.version
			// 线上版本号大于本地版本号时，需要升级
			if (compareVersion(latestVersion, curVersion) == 1) {
				hasUpgrade.value = true
				open()
			} else {
				hasUpgrade.value = false
				if (auto) close()
				else open()
			}
		}
	} catch (e) {
		if (!auto) uni.showToast({ title: e.msg, icon: 'none' })
	}
}

/**
 * 比较版本号
 * @param {Object} target 线上最新版本号
 * @param {Object} source 当前本地版本号
 * @returns {Number} 1:线上版本号大于本地版本号；-1:线上版本号小于本地版本号；0:版本号相等
 */
function compareVersion(target, source) {
	if (!target || !source) return console.warn('版本号无效')
	const match = target.match(/^(\d+\.\d+\.\d+)/)
	const v1 = match[1]
	const v2 = source

	// 将版本号字符串转换为数组
	const parts1 = v1.split('.').map(Number)
	const parts2 = v2.split('.').map(Number)

	// 确保两个数组长度相同
	const maxLength = Math.max(parts1.length, parts2.length)
	while (parts1.length < maxLength) parts1.push(0)
	while (parts2.length < maxLength) parts2.push(0)

	// 逐位比较
	for (let i = 0; i < maxLength; i++) {
		if (parts1[i] > parts2[i]) return 1
		if (parts1[i] < parts2[i]) return -1
	}

	// 如果所有位都相等，则版本号相等
	return 0
}

defineExpose({
	checkUpgrade
})
</script>

<style lang="scss">
.upgrade-center {
	--uc-card-bg-color: #ffffff;
	--uc-title-color: #ffffff;
	--uc-content-color: #333333;

	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	background-color: rgba(0, 0, 0, 0.2);

	.uc-card {
		width: 500rpx;
		height: 600rpx;
		background-color: var(--uc-card-bg-color);
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		position: relative;

		.uc-top {
			width: 100%;
			position: absolute;
			top: -12%;
		}

		.uc-title,
		.uc-content {
			z-index: 1;
		}

		.uc-title {
			font-size: 40rpx;
			font-weight: bold;
			color: var(--uc-title-color);
			height: 100rpx;
			line-height: 100rpx;
			padding-left: 40rpx;
		}

		.uc-content {
			color: var(--uc-content-color);
			margin: 70rpx 40rpx 0 40rpx;

			.uc-sub-title {
				height: 40rpx;
				font-weight: bold;
			}

			.uc-detail {
				height: calc(600rpx - 100rpx - 70rpx - 40rpx - 124rpx);
				overflow: auto;
			}
		}

		.uc-btn-group {
			height: 124rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			margin-top: auto;

			.uc-progress {
				color: var(--uc-content-color);
			}
		}
	}
}
</style>
