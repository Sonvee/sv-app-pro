<template>
  <el-tooltip effect="dark" :content="tip" placement="top">
    <i class="sv-icons-question text-xs cursor-pointer"></i>
  </el-tooltip>
</template>

<script setup name="DoubtTip">
const props = defineProps({
  tip: {
    type: String,
    default: '提示'
  }
})
</script>

<style lang="scss" scoped></style>
