import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalyticsStore = defineStore(
  'baidu-analytics',
  () => {
    // 当前站点id
    const curSiteId = ref('21032083')

    // token
    const baiduToken = ref({
      refresh_token: '122.99e4abada75e0d8b5658cd49214305fe.YDKJRtG_TcLI_bzEyEC_rsawfwhFyn2CpJ-JMbe.8GdEIw', // 有效期十年
      access_token: '121.d5c040f277c9fff66c636e1b284fc0f6.Yn0TnWuzEKS3tu3naukz6izxwQDnmwv0nbAQdL-.ieZIhg' // 有效期一个月
    })
    function getBaiduToken(key) {
      return baiduToken.value[key]
    }
    function setBaiduToken(key, value) {
      baiduToken.value[key] = value
    }

    return {
      curSiteId,
      baiduToken,
      getBaiduToken,
      setBaiduToken
    }
  },
  {
    persist: true
  }
)
