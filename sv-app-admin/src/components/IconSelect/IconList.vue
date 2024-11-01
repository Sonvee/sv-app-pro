<template>
  <view class="sv-icon-select">
    <el-input class="sv-el-input" v-model="iconName" :prefix-icon="Search" clearable @clear="filterIcons" @input="filterIcons" />
    <el-scrollbar v-bind="$attrs" class="icon-list">
      <view v-for="item in iconList" :key="item" class="icon" :style="{ '--col-num': colnum }" @click="onIcon(item)">
        <view class="icon-font" :class="item"></view>
        <view class="icon-text text-line-3">{{ item }}</view>
      </view>
    </el-scrollbar>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import icons from '@/assets/iconfont/icons-list.js'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  colnum: {
    type: Number,
    default: 4
  }
})

const emits = defineEmits(['selected'])

const iconList = ref(icons)
const iconName = ref('')

const { copy } = useClipboard() // 剪切板hook

function onIcon(item) {
  iconName.value = item
  // 复制到剪切板
  copy(iconName.value)
  emits('selected', iconName.value)
  document.body.click()
}

// 筛选过滤
function filterIcons() {
  iconList.value = icons
  if (iconName.value) {
    iconList.value = icons.filter((item) => item.indexOf(iconName.value) !== -1)
  }
}
</script>

<style lang="scss">
.sv-icon-select {
  width: 100%;
  // height: 100%;
  height: calc(100% - 40px);

  .icon-list {
    margin-top: 12px;

    .icon {
      --col-num: 4; // 默认4列
      width: calc(100% / var(--col-num));
      height: 100px;
      display: inline-block;
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      vertical-align: top;
      text-align: center;

      .icon-font {
        width: 30px;
        display: block;
        margin: 0 auto;
        font-size: 30px;
      }

      .icon-text {
        width: 100%;
        text-align: center;
        font-size: 12px;
      }
    }
    .icon:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
