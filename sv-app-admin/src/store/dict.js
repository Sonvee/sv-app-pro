import { dictitemListByRedis } from '@/api/dict'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDictStroe = defineStore(
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

    // 初始化字典项
    async function initDict(typelist) {
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
