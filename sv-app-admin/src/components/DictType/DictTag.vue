<template>
  <el-tag v-if="isTag" :type="dictMap[value]?.action">{{ dictMap[value]?.label }}</el-tag>
  <div v-else>{{ dictMap[value]?.label }}</div>
</template>

<script setup name="DictTag">
import { ref, watchEffect } from 'vue'
import { isTruthy } from '@/utils'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    required: true
  },
  // 给定的列表
  dictList: {
    required: true
  },
  labelName: {
    type: String,
    default: 'label'
  },
  valueName: {
    type: String,
    default: 'value'
  },
  isTag: {
    type: Boolean,
    default: true
  },
})

const dictMap = ref([])

async function handleDict() {
  const { dictList, labelName, valueName } = props
  if (isTruthy(dictList, 'arr')) {
    // 构建字典Map
    dictMap.value = dictList.reduce((acc, cur) => {
      acc[cur[valueName]] = {
        label: cur[labelName],
        action: cur['action_style'] || 'primary'
      }
      return acc
    }, {})
  }
}

watchEffect(() => {
  handleDict()
})
</script>

<style lang="scss" scoped></style>
