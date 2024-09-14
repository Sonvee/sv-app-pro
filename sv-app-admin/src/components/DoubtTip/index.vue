<template>
  <el-tooltip effect="dark" :content="tip" placement="top">
    <i class="sv-icons-question text-xs cursor-pointer"></i>
    <template #content v-if="!tip">
      <slot></slot>
    </template>
  </el-tooltip>
</template>

<script setup name="DoubtTip">
const props = defineProps({
  tip: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped></style>
