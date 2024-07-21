<template>
  <el-switch v-model="globalStore.isDark" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" @change="switchDark" />
</template>

<script setup name="SwitchDark">
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store/global'
import { Sunny, Moon } from '@element-plus/icons-vue'

const { switchDark } = useTheme()
const globalStore = useGlobalStore()
</script>
