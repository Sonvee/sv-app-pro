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

// 获取验证码
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