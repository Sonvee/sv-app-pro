import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('sv-common', () => {

  const userBindOptions = ref()

  return {
    userBindOptions
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})