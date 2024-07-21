import config from './index.js'
import { useUserStore } from '../store/user.js'
import { getPageRoute } from '../utils/page-router.js'

/**
 * 封装一个基础路径的 request 请求，并导出
 * @param {Object} options: {
 *    url: 请求路径
 *    method: 请求方式,
 *    data: 请求参数,
 *    header,
 *    responseType,
 *    timeout,
 *    notip: 关闭任何提示,
 *    modal: 使用modal提示错误信息
 * }
 */
const request = (options) => {
	const ic = new Interceptor(options) // 拦截器

	// 用 Promise 做链式调用封装
	return new Promise((resolve, reject) => {
		// 此处可以做加载 loading 或提示动画等操作
		uni.request({
			// 参数
			...ic.useRequest(),
			// 响应
			success(res) {
				const icRes = ic.useResponse(res)
				if (icRes.success) {
					resolve(icRes.response)
				} else {
					reject(icRes.response)
				}
			},
			fail(res) {
				reject(res);
			}
		})
	})
}

// 拦截器
class Interceptor {
	/**
	 * 请求参数
	 * @param {Object} options {
	 *   url: 请求路径
	 *   method: 请求方式,
	 *   data: 请求参数,
	 *   header,
	 *   responseType,
	 *   timeout,
	 *   notip: 关闭任何提示,
	 *   modal: 使用modal提示错误信息
	 * }
	 */
	constructor(options) {
		this.options = options
	}

	/**
	 * 请求拦截器
	 * @returns {Object} { url, method, data, header, responseType, timeout }
	 */
	useRequest() {
		let result = {
			url: '',
			method: 'POST',
			data: {},
			header: {},
			responseType: '',
			timeout: 60000,
		}

		// 处理url，以http开头则用http全路径
		if (this.options.url.toLowerCase().startsWith("http")) {
			result.url = this.options.url
		} else {
			// 以/开头则正常拼接
			if (this.options.url.startsWith("/")) {
				result.url = config.api_url + this.options.url
			} else {
				// 不以/开头则自动拼接上/
				result.url = config.api_url + '/' + this.options.url
			}
		}

		result.method = this.options.method.toUpperCase() || 'POST'

		result.data = this.options.data || {}

		result.header = Object.assign({
			"Authorization": 'Bearer ' + useUserStore().getToken(), // 添加token
			"Content-Type": "application/json;charset=UTF-8",
		}, this.options.header)

		result.responseType = this.options.responseType || ''

		result.timeout = this.options.timeout || 60000

		return result
	}

	/**
	 * 响应拦截器
	 * @param {Object} res 响应对象
	 */
	useResponse(res) {
		let result = {
			success: false,
			response: res
		}

		/**
		 * 拦截 http层
		 * 状态码：res.statusCode
		 */
		switch (res.statusCode) {
			case 200:
				/**
				 * 拦截业务层
				 * 状态码：res.data.code
				 */

				// 鉴权失败处理
				if (res.data.code == 401) {
					// token校验失败，需要重新登录
					if (getPageRoute('/') !== '/pages/login/login') {
						uni.navigateTo({ url: '/pages/login/login' })
					}
					uni.showToast({
						title: res.data?.msg,
						icon: 'none',
						duration: 2000,
					})
				}

				// 请求失败处理
				if (!res.data.success) {
					if (this.options.notip) {
						// 关闭任何提示
					} else if (this.options.modal) {
						// 使用modal提示错误信息
						uni.showModal({
							title: '系统提示',
							content: res.data?.msg,
							showCancel: false,
						})
					} else {
						// 默认使用toast提示错误信息
						uni.showToast({
							title: res.data?.msg,
							icon: 'none',
							duration: 2000,
						})
					}
				}

				result.success = res.data.success
				result.response = res.data
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

}

export default request