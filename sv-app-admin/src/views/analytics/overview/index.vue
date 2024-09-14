<template>
  <div class="page-container">
    <!-- 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="card">
          本统计数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计</a>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="card flex-vc">
          <div class="mr-10 text-sm flex-vc">
            <span>refresh_oken</span>
            <DoubtTip>
              获取方式：https://tongji.baidu.com/api/manual/Chapter2/openapi.html
              <i class="sv-icons-key"></i>
            </DoubtTip>
          </div>
          <el-input v-model="refreshToken" />
          <el-button type="primary" plain circle title="管理百度token" @click="handleBaiduToken">
            <i class="sv-icons-key"></i>
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="14">
        <div style="background-color: aliceblue;height: 300px;"></div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: aliceblue;height: 300px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DoubtTip from '@/components/DoubtTip/index.vue'

const refreshToken = ref('')
function handleBaiduToken() {

}
</script>

<style lang="scss" scoped></style>
