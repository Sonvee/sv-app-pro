import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSysStore = defineStore('sv-sys', () => {
  // 主题：light | dark
  const theme = ref('light')

  function setTheme(e) {
    theme.value = e
  }

  function getTheme() {
    return theme.value
  }

  // 系统配置

  return {
    theme,
    setTheme,
    getTheme,
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})