<template>
  <uv-tags
    v-if="isTag"
    plain
    size="mini"
    :type="dictMap[value]?.action"
    :text="dictMap[value]?.label"
  ></uv-tags>
  <uv-text v-else :type="dictMap[value]?.action" :text="dictMap[value]?.label"></uv-text>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { isTruthy, multipleJudgment } from '@/utils/util.js'

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
  }
})

const dictMap = ref([])

async function handleDict() {
  const { dictList, labelName, valueName } = props
  if (isTruthy(dictList, 'arr')) {
    // 构建字典Map
    dictMap.value = dictList.reduce((acc, cur) => {
      acc[cur[valueName]] = {
        label: cur[labelName],
        action: multipleJudgment(cur['action_style'], ['', 'danger'], ['primary', 'error'])
      }
      return acc
    }, {})
  }
}

watchEffect(() => {
  handleDict()
})
</script>

<style lang="scss" scoped>
.uv-text {
  :deep(.uv-text__value) {
    font-size: unset !important;
  }
}
</style>
