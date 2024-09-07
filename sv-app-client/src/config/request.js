/**
 * @tutorial https://www.quanzhan.co/luch-request/
 */

import Request from 'luch-request'
import config from '@/config/index.js';
import { useUserStore } from '@/store/user.js';
import { getPageRoute } from '@/utils/page-router';

const http = new Request();

/**
 * 全局配置修改setConfig
 * @description 修改全局默认配置
 * @param {Object} config.custom {notip:boolean 关闭错误提示, modal:boolean 以对话框提示错误}
 */
http.setConfig((conf) => {
	/**
	 * conf 为默认全局配置
	 * @tutorial https://www.quanzhan.co/luch-request/guide/3.x/#%E5%8F%AF%E9%85%8D%E7%BD%AE%E9%A1%B9
	 */
	conf.baseURL = config.api_url
	conf.method = 'POST'
	conf.header = {
		"Content-Type": "application/json;charset=UTF-8",
	}
	return conf
})

/**
 * HTTP状态码预提示信息
 */
const httpStatus = {
	200: 'request:ok',
	400: 'Bad Request',
	401: 'token过期或无效',
	403: '403 Forbidden',
	404: '404 Not Found',
	405: 'Method Not Allowed',
	429: 'Too Many Requests',
	500: '服务器错误',
	503: '服务不可用',
}

/**
 * 请求拦截器
 */
http.interceptors.request.use((conf) => {
	// 对请求参数做点什么
	conf.header['Authorization'] = 'Bearer ' + useUserStore().getToken() // 添加token
	return conf
}, (err) => {
	return Promise.reject(err)
})

/**
 * 响应拦截器
 */
http.interceptors.response.use((response) => {
	// console.log('对响应成功做点什么 ==> ', response)
	const res = useResponse(response)
	if (!res.success) {
		return Promise.reject(res.response)
	}
	return res.response
}, (err) => {
	// console.log('对响应错误做点什么 ==> ', err)
	const { statusCode = 400 } = err
	uni.showToast({
		title: httpStatus[statusCode],
		icon: 'none'
	})
	return Promise.reject(err)
})

/**
 * 响应处理
 * @param {Object} response 响应对象
 */
function useResponse(response) {
	let result = {
		success: false,
		response
	}

	/**
	 * 拦截 http层
	 * 状态码：response.statusCode
	 */
	switch (response.statusCode) {
		case 200:
			// 下载接口不做拦截处理
			if (response.config.method === 'DOWNLOAD') {
				result.success = true
				result.response = {
					code: response.statusCode,
					data: response.tempFilePath,
					msg: response.errMsg,
				}
				break
			}

			/**
			 * 拦截业务层
			 * 状态码：response.data.code
			 */

			// 鉴权失败处理
			if (response.data.code == 401) {
				// token校验失败，需要重新登录
				if (getPageRoute('/') !== '/pages/login/login') {
					uni.navigateTo({ url: '/pages/login/login' })
				}
				uni.showToast({
					title: response.data?.msg,
					icon: 'none',
					duration: 2000,
				})
			}
			/**
			 * 请求失败信息处理 默认以toast提示
			 * @param {Boolean} custom.notip 为true时关闭任何提示
			 * @param {Boolean} custom.modal 为true时以对话框提示
			 */
			if (!response.data.success) {
				// 消息提示模式判断
				if (response.config.custom?.notip) {
					// 关闭任何提示
				} else if (response.config.custom?.modal) {
					// 使用modal提示错误信息
					uni.showModal({
						title: '系统提示',
						content: response.data?.msg,
						showCancel: false,
					})
				} else {
					// 默认使用toast提示错误信息
					uni.showToast({
						title: response.data?.msg,
						icon: 'none',
						duration: 2000,
					})
				}
			}

			result.success = response.data.success
			result.response = response.data
			break

		case 401:
			// 鉴权失败处理
			if (getPageRoute('/') !== '/pages/login/login') {
				uni.navigateTo({ url: '/pages/login/login' })
			}
			uni.showToast({
				title: 'Unauthorized',
				icon: 'error',
				duration: 2000,
			})
			break

		default:
			// 失败信息
			break
	}

	return result
}

export default http