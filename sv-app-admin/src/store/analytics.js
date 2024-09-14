import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnalyticsStore = defineStore(
  'baidu-analytics',
  () => {
    // 站点id
    const site_id = ref('')
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
      site_id,
      baiduToken,
      getBaiduToken,
      setBaiduToken
    }
  },
  {
    persist: true
  }
)
