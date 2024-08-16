import { dictitemListByRedis } from '@/api/dict'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDictStore = defineStore(
  'sv-dict',
  () => {
    const dict = ref({})

    function setDict(name, data) {
      dict.value[name] = data
    }

    function getDict(name) {
      return dict.value[name]
    }

    function deleteDict(name) {
      delete dict.value[name]
    }

    function clearDict() {
      dict.value = {}
    }

    /**
     * 初始化字典项
     * @param {Array} typelist 要更新的字典 dict_type
     * @returns {Promise} 返回一个Promise对象，用于处理所有字典项初始化完成后的回调
     */
    async function initDict(typelist) {
      if (!Array.isArray(typelist)) {
        throw new Error('typelist 必须为数组')
      }

      const promises = typelist.map(async (item) => {
        const dictRes = await dictitemListByRedis({ dict_type: item, pagesize: -1 })
        setDict(item, dictRes.data)
      })

      // 使用Promise.all来等待所有的异步操作完成
      return Promise.all(promises)
    }

    return {
      dict,
      getDict,
      setDict,
      deleteDict,
      clearDict,
      initDict
    }
  },
  {
    persist: true
  }
)
