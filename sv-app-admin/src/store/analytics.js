import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalyticsStore = defineStore(
  'baidu-analytics',
  () => {
    // 当前站点id
    const curSiteId = ref('')

    // token
    const baiduToken = ref({
      refresh_token: '', // 有效期十年
      access_token: '' // 有效期一个月
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
