<template>
  <div class="page-container grid grid-col-3 grid-gap-sm">
    <!-- 宫格布局 -->
    <el-card shadow="hover">
      <template #header>
        <i class="sv-icons-redis mr-5"></i>
        缓存列表
      </template>
    </el-card>
    <el-card shadow="hover">
      <template #header>
        <i class="sv-icons-key mr-5"></i>
        键名列表
      </template>
    </el-card>
    <el-card shadow="hover">
      <template #header>
        <i class="admin-icons-doc mr-5"></i>
        缓存内容
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { cacheKeyList } from '@/api/cache'

cacheKeyList().then((res) => {
  console.log(' ===> ', res)
})
</script>

<style lang="scss" scoped></style>
