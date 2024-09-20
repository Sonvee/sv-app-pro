<template>
  <el-dropdown v-bind="$attrs" trigger="click" @command="dropdownCommand" @visible-change="visibleChange">
    <span class="cursor-pointer">
      {{ curLabel || '请选择' }}
      <i :class="[isDropdown ? 'trans-up' : 'trans-down']" class="uni-icons-down"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in list" :key="item.value" :command="item.value">
          <span :class="[current == item.value ? 'color-primary' : '']"><i v-if="item.icon" :class="item.icon"></i>{{ item.label }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  /**
   * 菜单列表
   * @param {Array} 列表数组
   * @property {Object} 菜单对象 {label: '菜单名称', value: '菜单值', icon: '菜单图标'}
   */
  list: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 当前菜单
const current = defineModel({ type: String, default: '' }) // 双向绑定
const curLabel = computed(() => props.list.find((item) => item.value == current.value)?.label)

const emits = defineEmits(['select'])

function dropdownCommand(e) {
  current.value = e
  const curItem = props.list.find((item) => item.value == e)
  emits('select', curItem)
}

// 是否显示菜单框
const isDropdown = ref(false)
function visibleChange(e) {
  isDropdown.value = e
}
</script>

<style lang="scss" scoped>
.trans-up {
  transition: transform 0.3s;
  transform: rotate(-180deg);
}
.trans-down {
  transition: transform 0.3s;
  transform: rotate(0);
}
</style>
