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
     */
    function initDict(typelist) {
      if (!Array.isArray(typelist)) {
        return console.error('typelist 必须为数组')
      }
      typelist.forEach(async (item) => {
        const dictRes = await dictitemListByRedis({ dict_type: item, pagesize: -1 })
        setDict(item, dictRes.data)
      })
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
