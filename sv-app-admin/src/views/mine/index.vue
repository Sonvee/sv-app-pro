<template>
  <div class="page-container">
    <!-- 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="16">
        <el-card>
          <template #header>
            <i class="sv-icons-redis mr-5"></i>
            个人空间
          </template>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <i class="sv-icons-redis mr-5"></i>
            消息通知
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
