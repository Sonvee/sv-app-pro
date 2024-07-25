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
 * @param {Function}   
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
  // 对响应成功做点什么
  // console.log('res 对响应成功做点什么 ==> ', response)
  const res = useResponse(response)
  console.log('对响应成功做点什么 ==> ', res);
  return response.data
}, (err) => {
  // 对响应错误做点什么
  console.log('res 对响应错误做点什么 ==> ', err)
  return Promise.reject(err)
})

/**
 * 响应处理
 * @param {Object} res 响应对象
 */
function useResponse(res) {
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

export default http