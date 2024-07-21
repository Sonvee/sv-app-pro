<template>
  <div class="icon-select">
    <el-input v-bind="$attrs" v-model="iconVal" placeholder="请选择图标" clearable>
      <template #append>
        <el-popover placement="bottom-start" :width="opt.popWidth" trigger="click">
          <template #reference>
            <div class="append-btn">
              <div class="admin-icons-icon"></div>
              内置图标
            </div>
          </template>
          <icon-list :height="opt.popHeight" @selected="selected" :colnum="opt.colnum"></icon-list>
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconList from './IconList.vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  opt: {
    type: Object,
    default: () => {
      return {
        colnum: 4,
        popWidth: 400,
        popHeight: 400
      }
    }
  }
})

const emits = defineEmits(['selected', 'update:icon'])

const iconVal = computed({
  set(newVal) {
    emits('update:icon', newVal)
  },
  get() {
    return props.icon
  }
})

function selected(e) {
  emits('update:icon', e)
}
</script>

<style lang="scss">
.icon-select {
  width: 100%;

  :deep(.el-input-group__append) {
    padding: 0;
  }

  .append-btn {
    padding: 0 10px;
    cursor: pointer;
    &:active {
      color: var(--el-color-primary);
    }
  }
}
</style>
