import http from '@/config/request'

// 获取验证码
export function getCaptcha(data) {
	return http.request({
		url: '/auth/getCaptcha',
		method: 'post',
		data,
		custom: {
			loading: false,
		}
	})
}

// 获取邮箱验证码
export function emailCaptcha(data) {
	return http.request({
		url: '/auth/emailCaptcha',
		method: 'post',
		data,
		custom: {
			loading: false,
		}
	})
}

// 获取短信验证码
export function smsCaptcha(data) {
	return http.request({
		url: '/auth/smsCaptcha',
		method: 'post',
		data,
		custom: {
			loading: false,
		}
	})
}