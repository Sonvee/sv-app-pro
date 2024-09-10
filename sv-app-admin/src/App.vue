<template>
  <el-config-provider :locale="locale" :size="assemblySize">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGlobalStore } from '@/store/global'
import { useTheme } from '@/hooks/useTheme'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useUserStore } from './store/user'
import { useDatabaseInit } from '@/hooks/useDatabaseInit'

// 项目启动时自动刷新token
useUserStore().reToken()

// useDatabaseInit()

// 初始化主题风格
const { initTheme } = useTheme()
initTheme()

// 全局配置element-plus中文
const locale = computed(() => {
  return zhCn
})

// 全局配置element-plus尺寸
const globalStore = useGlobalStore()
const assemblySize = computed(() => {
  return globalStore.assemblySize
})
</script>

<style scoped lang="scss"></style>
