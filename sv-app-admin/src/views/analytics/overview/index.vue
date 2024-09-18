<template>
  <div class="page-container">
    <!-- 悬浮按钮 -->
    <FloatSideButton panel-height="132" panel-width="186">
      <div class="flex-col-hc padding-10">
        <div class="flex-vc mb-5">
          <span class="text-xs mr-5" title="refresh_token">RT</span>
          <el-input :model-value="refresh_token" disabled>
            <template #suffix><i class="cuIcon-copy cursor-pointer" @click="onCopy(refresh_token)"></i></template>
          </el-input>
        </div>
        <div class="flex-vc mb-5">
          <span class="text-xs mr-5" title="access_token">AT</span>
          <el-input :model-value="access_token" disabled>
            <template #suffix><i class="cuIcon-copy cursor-pointer" @click="onCopy(access_token)"></i></template>
          </el-input>
        </div>
        <el-input v-model="code" class="mb-2" size="small" placeholder="请先输入code再获取token"></el-input>
        <div>
          <el-button type="success" plain size="small" @click="createTokenCode">获取code</el-button>
          <el-button type="primary" plain size="small" @click="createTokenByCode">获取token</el-button>
        </div>
      </div>
    </FloatSideButton>
    <!-- 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <div class="card" style="height: 150px">本统计数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计</a></div>
      </el-col>
      <el-col :span="6">
        <div class="card" style="height: 150px">本统计数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计</a></div>
      </el-col>
      <el-col :span="6">
        <div class="card" style="height: 150px">本统计数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计</a></div>
      </el-col>
      <el-col :span="6">
        <div class="card" style="height: 150px">本统计数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计</a></div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt-10">
      <el-col :span="14">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt-10">
      <el-col :span="14">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt-10 mb-10">
      <el-col :span="14">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #333; height: 300px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FloatSideButton from '@/components/FloatSideButton/FloatSideButton.vue'
import { useAnalyticsStore } from '@/store/analytics'
import { getBaiduTokenCode, getBaiduTokenByCode, getSiteList } from '@/api/analytics'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'

const analyticsStore = useAnalyticsStore()
const refresh_token = computed(() => analyticsStore.getBaiduToken('refresh_token'))
const access_token = computed(() => analyticsStore.getBaiduToken('access_token'))

const { copy } = useClipboard() // 剪切板hook

const code = ref('') // 获取token凭证

onMounted(() => {
  siteList()
})

function onCopy(val) {
  if (!val) return ElMessage({ type: 'warning', message: '无复制内容' })
  copy(val)
  ElMessage({ type: 'success', message: '复制成功' })
}

async function createTokenCode() {
  const codeRes = await getBaiduTokenCode()
  const url = codeRes.data
  window.open(url)
}

async function createTokenByCode() {
  if (!code.value) return ElMessage({ type: 'error', message: '请输入code' })
  const tokenRes = await getBaiduTokenByCode({ code: code.value })
  if (tokenRes.success) {
    const { refresh_token, access_token } = tokenRes.data
    analyticsStore.setBaiduToken('refresh_token', refresh_token)
    analyticsStore.setBaiduToken('access_token', access_token)

    ElNotification({
      title: 'Success',
      message: tokenRes?.msg,
      type: 'success'
    })
  }
}

async function siteList() {
  const siteRes = await getSiteList({ access_token: access_token.value })
  console.log('siteRes :>> ', siteRes)
}
</script>

<style lang="scss" scoped>
.token-input-item {
  margin-bottom: 0 !important;
}
</style>
