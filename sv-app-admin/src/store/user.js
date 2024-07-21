import { defineStore } from 'pinia'
import { assignOverride } from '@/utils'
import { refreshToken, verifyToken } from '@/api/user/login'

export const useUserStore = defineStore({
  id: 'sv-user',
  state: () => ({
    token: '',
    userInfo: {},
    rememberLoginForm: {
      username: '',
      password: '',
      rememberme: false
    },
    permission: []
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token) {
      this.token = token
    },
    // 刷新token
    async refreshToken() {
      // 只在token还有效时刷新，token无效时会直接拦截，前往登录
      if (this.userInfo.username && this.token) {
        const { token } = await refreshToken({ username: this.userInfo.username })
        this.token = token
        await this.verifyToken()
      }
    },
    /**
     * 解析token
     * 获取token中携带的数据
     */
    async verifyToken() {
      const { data } = await verifyToken()
      // 解析并获取用户权限
      this.permission = data.permission
      // 其他...
    },
    // Set setUserInfo
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setRememberLogin(form) {
      this.rememberLoginForm = assignOverride({ username: '', password: '', rememberme: false }, form)
    },
    clearUserInfo() {
      this.token = ''
      this.userInfo = {}
      this.permission = []
    }
  },
  persist: true
})
