<template>
  <view class="sv-pagination">
    <el-pagination
      v-bind="$attrs"
      v-model:current-page="pagingParams.pagenum"
      v-model:page-size="pagingParams.pagesize"
      :page-sizes="[5, 10, 20, 30, 40]"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :size="size"
    />
  </view>
</template>

<script setup name="TablePagination">
import { ref, computed } from 'vue'
import { useGlobalStore } from '@/store/global'

/**
 * vue不建议将props绑定为v-model，但是此处修改的是 pagingParams 对象内部的属性，而不是直接替换整个 props 对象
 * Vue 只有在尝试直接修改 props 时发出警告，而对于对象内部属性的修改，Vue 是可以追踪并更新视图的
 */
const props = defineProps({
  pagingParams: {
    type: Object,
    default: () => {
      return {
        pagenum: 1,
        pagesize: 20
      }
    }
  }
})

const size = computed(() => {
  return useGlobalStore().assemblySize
})
</script>

<style lang="scss">
.sv-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
