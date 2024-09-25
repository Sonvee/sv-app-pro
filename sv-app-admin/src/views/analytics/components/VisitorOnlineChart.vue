<template>
  <ChartFrame header :chart-main="false">
    <template #header>
      <div class="flex-vc">
        <i class="title-cube"></i>
        <span class="text-lg text-bold text-line-1">在线人数</span>
        <span class="text-xs text-gray text-line-1">
          <el-divider direction="vertical" />
          <DateTime class="text-sm"></DateTime>
        </span>
      </div>
      <el-divider style="margin: 10px 0 0 0" />
    </template>
    <template #chartMain>
      <div class="flex-col-vhc w-h-full">
        <span class="text-xxsl color-primary YouSheBiaoTiHei">{{ onlineNumber }}</span>
      </div>
    </template>
  </ChartFrame>
</template>

<script setup>
import { ref } from 'vue'
import ChartFrame from '@/components/Chart/ChartFrame.vue'
import DateTime from '@/components/DateTime/DateTime.vue'
import mittBus from '@/utils/mittBus'

const onlineNumber = ref(0)

/**
 * 实时在线人数
 * 该组件不独立存在，需要配合 TrendOnlineChart 组件使用
 */
mittBus.on('e_online_number', (e) => {
  onlineNumber.value = e
})
</script>

<style lang="scss" scoped></style>
