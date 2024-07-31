<template>
  <el-select v-bind="$attrs" filterable clearable :empty-values="[null, undefined]">
    <el-option v-for="item in dictData" :key="item[labelName]" :label="item[labelName]" :value="formatValue(item[valueName])"></el-option>
  </el-select>
</template>

<script setup name="DictSelect">
import { ref, watchEffect } from 'vue'
import { dictitemList, dictitemListByRedis } from '@/api/dict'
import { isTruthy } from '@/utils'
import { useDictStore } from '@/store/dict'

const props = defineProps({
  // 字典类型，与dictList二选一，优先级大于dictList
  dictType: {
    type: String,
    default: ''
  },
  // 给定的列表
  dictList: {
    type: Array,
    default: () => []
  },
  // 获取字典数据的api接口
  dictApi: {
    type: Function
  },
  // 获取字典数据的api接口参数
  apiParams: {
    type: Object,
    default: () => {
      return {
        pagesize: -1
      }
    }
  },
  labelName: {
    type: String,
    default: 'label'
  },
  valueName: {
    type: String,
    default: 'value'
  },
  // 是否格式化数字（用于将value为字符串类型数字时的值转换成Number）
  formatNumber: {
    type: Boolean,
    default: false
  },
  // 是否格式化布尔值（用于将value为字符串类型布尔时的值转换成true或false）
  formatBoolean: {
    type: Boolean,
    default: false
  }
})

const dictData = ref(props.dictList)

// 字典值格式化
function formatValue(val) {
  if (props.formatNumber) {
    val = Number(val)
  } else if (props.formatBoolean) {
    val = JSON.parse(val)
  }
  return val
}

async function handleDict() {
  const { dictType, dictList, dictApi, apiParams } = props
  if (isTruthy(dictType)) {
    // 先从缓存中获取
    let dictRes = useDictStore().getDict(dictType)
    if (isTruthy(dictRes, 'arrobj')) {
      // 缓存中有直接从缓存中取
      dictData.value = dictRes
    } else {
      // 缓存中没有则请求Redis
      const dictRedisRes = await dictitemListByRedis({ dict_type: dictType, pagesize: -1 })
      if (dictRedisRes.success && isTruthy(dictRedisRes.data, 'arr')) {
        dictRes = dictRedisRes.data
        // 请求成功，设置缓存
        useDictStore().setDict(dictType, dictRes)
        dictData.value = dictRes
      } else {
        // Redis中没有则直接请求api
        const dictApiRes = await dictitemList({ dict_type: dictType, pagesize: -1 })
        if (dictApiRes.success) {
          dictRes = dictApiRes.data
          // 请求成功，设置缓存
          useDictStore().setDict(dictType, dictRes)
          dictData.value = dictRes
        }
      }
    }
    return
  }
  if (isTruthy(dictList, 'arr')) {
    dictData.value = dictList
    return
  }
  if (isTruthy(dictApi)) {
    const dictRes = await dictApi(apiParams)
    dictData.value = dictRes.data
    return
  }
}

watchEffect(() => {
  handleDict()
})
</script>

<style lang="scss" scoped></style>
