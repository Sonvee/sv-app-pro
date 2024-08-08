import axios from 'axios'
import { useUserStore } from '@/store/user'
import { checkStatus } from './checkStatus'
import { AxiosCanceler } from './axiosCancel'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/components/Loading/fullScreen'
import { LOGIN_URL } from '@/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL,
  // 设置超时时间
  timeout: 60000,
  // 跨域时候允许携带凭证
  withCredentials: true,
  // 请求头
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

const axiosCanceler = new AxiosCanceler()

/**
 * @description 请求拦截器
 * 客户端发送请求 -> [请求拦截器] -> 服务器
 * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
 */
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 重复请求若不需要取消，在 api 服务中通过指定参数 cancel: false 来控制
    config.cancel ??= true
    config.cancel && axiosCanceler.addPending(config)
    // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { loading: false } 来控制
    config.loading ??= true
    config.loading && showFullScreenLoading()

    config.headers.Authorization = 'Bearer ' + userStore.token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response

    const userStore = useUserStore()
    axiosCanceler.removePending(config)
    config.loading && tryHideFullScreenLoading()

    // 登录失效
    if (data.code == 401) {
      ElMessageBox.confirm(data.msg, '系统警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          userStore.setToken('')
          userStore.setUserInfo({})
          router.replace(LOGIN_URL)
        })
        .catch(() => {})
      return Promise.reject(data)
    }
    // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
    if (data.code && data.code !== 200) {
      ElMessage.error(data.msg)
      return Promise.reject(data)
    }

    // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
    return data
  },
  (error) => {
    const { response } = error
    tryHideFullScreenLoading()
    // 请求超时 && 网络错误单独判断，没有 response
    if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试')
    if (error.message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试')
    // 根据服务器响应的错误状态码，做不同的处理
    if (response) checkStatus(response.status)
    // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
    if (!window.navigator.onLine) router.replace('/500')
    return Promise.reject(error)
  }
)

// 导出 axios 实例
export default service
