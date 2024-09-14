<template>
  <div class="page-container">
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
        <div class="card" style="height: 150px">
          <div class="flx-justify-between mb-10">
            <span>密钥凭证</span>
            <el-popover placement="bottom-end" :width="190" trigger="click">
              <template #reference>
                <el-button type="primary" plain circle size="small">
                  <i class="sv-icons-key"></i>
                </el-button>
              </template>

              <el-input v-model="code" class="mb-10" size="small" placeholder="请先输入code再获取token"></el-input>
              <el-button type="success" plain size="small" @click="createTokenCode">获取code</el-button>
              <el-button type="primary" plain size="small" @click="createTokenByCode">获取token</el-button>
            </el-popover>
          </div>
          <el-form label-width="auto">
            <el-form-item label="refresh_token" class="token-input-item">
              <el-input :model-value="refresh_token" class="mb-10" disabled></el-input>
            </el-form-item>
            <el-form-item label="access_token" class="token-input-item">
              <el-input :model-value="access_token" class="mb-10" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="14">
        <div style="background-color: aliceblue; height: 300px"></div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: aliceblue; height: 300px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/store/analytics'
import { getBaiduTokenCode, getBaiduTokenByCode, getSiteList } from '@/api/analytics'
import { ElMessage } from 'element-plus'

const analyticsStore = useAnalyticsStore()
const refresh_token = computed(() => analyticsStore.getBaiduToken('refresh_token'))
const access_token = computed(() => analyticsStore.getBaiduToken('access_token'))

const code = ref('') // 获取token凭证

onMounted(() => {
  siteList()
})

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
