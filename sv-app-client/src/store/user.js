import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { refreshToken, verifyToken } from '@/api/user/login'
import { assignOverride } from '@/utils/util'

export const useUserStore = defineStore('sv-user', () => {
  // token
  const token = ref('')

  function getToken() {
    return token.value
  }

  function setToken(e) {
    token.value = e
  }

  // 以是否有token判断用户是否已登录
  const hasLogin = computed(() => !!token.value)

  // 用户信息
  const userInfo = ref({})

  function getUserInfo() {
    return userInfo.value
  }

  function setUserInfo(e) {
    userInfo.value = e
  }

  // 是否拥有会员
  const hasVip = computed(() => userInfo.value.role?.includes('vip'))

  // 一键清空token用户信息等
  function clearUserInfo() {
    token.value = ''
    userInfo.value = {}
    permission.value = []
  }

  // 用户权限
  const permission = ref([])

  function getPermission() {
    return permission.value
  }

  function setPermission(e) {
    permission.value = e
  }

  // 记住密码缓存
  const rememberLoginForm = ref({
    username: '',
    password: '',
    rememberme: false
  })

  function getRememberLogin() {
    return rememberLoginForm.value
  }

  function setRememberLogin(e) {
    rememberLoginForm.value = assignOverride({
      username: '',
      password: '',
      rememberme: false
    }, e)
  }

  /**
   * 解析token
   * 获取token中携带的数据
   */
  async function veToken() {
    const tokenRes = await verifyToken()
    // 解析并获取用户权限
    permission.value = tokenRes.data.permission
    // 其他...
  }

  // 刷新token
  async function reToken() {
    // 只在token还有效时刷新，token无效时会直接拦截，前往登录
    if (userInfo.value._id && token.value) {
      const tokenRes = await refreshToken({ _id: userInfo.value._id })
      // 更新token
      token.value = tokenRes.token
      // 解析并获取用户权限
      permission.value = tokenRes.verify.permission
    }
  }

  return {
    token,
    getToken,
    setToken,
    veToken,
    reToken,

    hasLogin,

    userInfo,
    getUserInfo,
    setUserInfo,
    clearUserInfo,
    
    hasVip,

    permission,
    getPermission,
    setPermission,

    rememberLoginForm,
    getRememberLogin,
    setRememberLogin,
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})