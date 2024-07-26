<template>
	<sv-page>
		<view class="user-info">
			<uv-cell-group>
				<uv-cell title="头像">
					<template #value>
						<avatar-upload :file="userInfo.avatar" width="120rpx" height="120rpx"></avatar-upload>
					</template>
				</uv-cell>
				<uv-cell title="用户名" isLink @click="onEdit('username')">
					<template #value>
						<text class="value-text text-line-1">
							{{ userInfo.username }}
						</text>
					</template>
				</uv-cell>
				<uv-cell title="昵称" isLink @click="onEdit('nickname')">
					<template #value>
						<text class="value-text text-line-1">
							{{ userInfo.nickname || '起个昵称吧' }}
						</text>
					</template>
				</uv-cell>
				<uv-cell title="性别" isLink @click="openPicker">
					<template #value>
						<view class="value-text text-line-1">
							<dict-tag
								:isTag="false"
								:dictList="dictStore.getDict('dict_sys_user_gender')"
								:value="userInfo.gender"
							></dict-tag>
						</view>
					</template>
				</uv-cell>
				<uv-cell title="生日" isLink @click="openCalendar">
					<template #value>
						<text class="value-text text-line-1">
							{{ timeFormat(userInfo.birthday, 'YYYY-MM-DD') }}
						</text>
					</template>
				</uv-cell>
				<uv-cell title="个性签名" isLink @click="onEdit('comment')">
					<template #value>
						<text class="value-text text-line-1">
							{{ userInfo.comment || '写点什么吧 🖉' }}
						</text>
					</template>
				</uv-cell>
			</uv-cell-group>
			<view class="margin-top"></view>
			<uv-cell-group>
				<uv-cell title="UID" clickable @click="onCopy(userInfo._id)">
					<template #value>
						<text class="value-text text-line-1 text-cyan">
							{{ userInfo._id }}
						</text>
					</template>
				</uv-cell>
				<uv-cell title="邀请码" clickable @click="onCopy(userInfo.my_invite_code)">
					<template #value>
						<text class="value-text text-line-1 text-tyblue">
							{{ userInfo.my_invite_code }}
						</text>
					</template>
				</uv-cell>
				<uv-cell title="二维码名片" clickable @click="onQRcode">
					<template #right-icon>
						<text class="cuIcon-qrcode"></text>
					</template>
				</uv-cell>
			</uv-cell-group>
			<!-- 子页面 -->
			<sv-sub-page ref="subPageRef" :pageTitle="subPageTitle">
				<view class="margin sv-uv-textarea">
					<uv-textarea v-model="editValue" count :maxlength="maxlength" placeholder="请输入内容"></uv-textarea>
					<view class="flex justify-around margin-tb">
						<button class="cu-btn round bg-red" style="width: 30%" @click="clearEdit">
							<text class="cuIcon-delete margin-right-xs"></text>
							清空
						</button>
						<button class="cu-btn round bg-blue" style="width: 30%" @click="confirmEdit">
							<text class="cuIcon-check margin-right-xs"></text>
							确认
						</button>
					</view>
				</view>
			</sv-sub-page>
			<!-- 日历 -->
			<uni-calendar
				ref="calendarRef"
				lunar
				:date="timeFormat(userInfo.birthday, 'YYYY-MM-DD')"
				:insert="false"
				@confirm="confirmCalendar"
			/>
			<!-- 选择器 -->
			<uv-picker
				ref="pickerRef"
				:columns="[dictStore.getDict('dict_sys_user_gender')]"
				keyName="label"
				@confirm="confirmPicker"
			></uv-picker>
			<!-- 二维码 -->
			<uv-qrcode
				ref="qrcodeRef"
				hide
				:start="false"
				:auto="false"
				:size="300"
				:value="qrcodeValue"
				:options="{
					margin: 10,
					foregroundImageSrc: '/static/logo.png',
					foregroundImagePadding: 4
				}"
				@complete="renderOver"
			></uv-qrcode>
		</view>
	</sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import avatarUpload from '@/components/file-upload/avatar-upload.vue'
import dictTag from '@/components/dict-type/dict-tag.vue'
import { useUserStore } from '@/store/user.js'
import { timeFormat, isTruthy } from '@/utils/util'
import { userUpdateSimple } from '@/api/user/user'
import { useDictStroe } from '@/store/dict'

const userStore = useUserStore()
const dictStore = useDictStroe()
const userInfo = computed(() => userStore.getUserInfo())
dictStore.initDict(['dict_sys_user_gender']) // 初始化字典

function onCopy(text) {
	uni.setClipboardData({
		data: text,
		success: () => {
			uni.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000
			})
		}
	})
}

// 二维码
const qrcodeRef = ref()
const qrcodeValue = computed(() => `${userInfo.value._id}_${userInfo.value.my_invite_code}`)

function onQRcode() {
	qrcodeRef.value.make()
}
function renderOver() {
	qrcodeRef.value.save({
		success: () => {
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		}
	})
}

/**
 * 更新用户信息
 * @param {Object} data 更新参数
 */
async function updateUserInfo(data) {
	const params = Object.assign({ _id: userInfo.value._id }, data)
	// 更新用户信息
	const upRes = await userUpdateSimple(params)
	if (upRes.success) {
		uni.showToast({
			title: upRes.msg,
			icon: 'none',
			duration: 2000
		})
		for (let key in data) {
			userStore.userInfo[key] = data[key]
		}
		// 当修改username时，无感刷新token
		if (data['username']) {
			console.log('当修改username时，无感刷新token');
			userStore.reToken()
		}

		// 关闭相关页面或弹窗
		subPageRef.value.close()
		calendarRef.value.close()
		pickerRef.value.close()
	}
}

// 子页面
const subPageRef = ref()
const subPageTitle = ref()
const subPageType = ref()
const subPageTitleMap = {
	username: '用户名修改',
	nickname: '昵称修改',
	comment: '个性签名修改'
}
// 输入框
const editValue = ref()
const maxlength = ref(20)

function onEdit(type) {
	subPageType.value = type // 保存当前编辑类型
	subPageTitle.value = subPageTitleMap[type]
	editValue.value = userInfo.value[type]
	// 打开子页面
	subPageRef.value.open()
}

async function confirmEdit() {
	if (!isTruthy(editValue.value)) {
		uni.showToast({
			title: '内容不能为空',
			icon: 'none'
		})
		return
	}
	// 更新用户信息
	updateUserInfo({ [subPageType.value]: editValue.value })
}

function clearEdit() {
	editValue.value = ''
}

// 日历
const calendarRef = ref()

function openCalendar() {
	calendarRef.value.open()
}

async function confirmCalendar(e) {
	const birthdayTime = timeFormat(e.fulldate, 'timestamp')
	// 更新用户信息
	updateUserInfo({ birthday: birthdayTime })
}

// 选择器
const pickerRef = ref()

function openPicker() {
	pickerRef.value.open()
	pickerRef.value.setIndexs([+userInfo.value.gender], true)
}

async function confirmPicker(e) {
	const updateValue = e.value[0].value
	// 更新用户信息
	updateUserInfo({ gender: updateValue })
}
</script>

<style lang="scss">
.user-info {
	min-height: var(--page-notab-height);
	padding: 30rpx 0;

	.value-text {
		max-width: 66%;
		color: var(--text-sub-color);
	}
}
</style>
