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
        <el-input v-model="code" class="mb-2" size="small" clearable placeholder="无RT时需先获取code"></el-input>
        <div>
          <el-button type="success" plain size="small" @click="createTokenCode">获取code</el-button>
          <el-button v-if="refresh_token" type="primary" plain size="small" @click="refreshRtAt">刷新token</el-button>
          <el-button v-else type="info" plain size="small" @click="createTokenByCode">获取token</el-button>
        </div>
      </div>
    </FloatSideButton>
    <!-- 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <div>
            统计分析数据来源：<a href="https://tongji.baidu.com" target="_blank">百度统计&nbsp;<i class="admin-icons-page-ent text-sm"></i></a>
          </div>
          <a class="flex-vhc flex-sub padding-10" href="https://tongji.baidu.com" target="_blank">
            <img class="h-full" :src="svgbaidutongji" alt="" />
          </a>
          <div class="flex-vc">
            <span class="flex-shrink">当前站点：</span>
            <el-select v-model="curSiteId" placeholder="Select">
              <el-option v-for="item in siteList" :key="item.site_id" :label="item.domain" :value="item.site_id" />
            </el-select>
          </div>
        </div>
      </el-col>
      <!-- 浏览量(PV) -->
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <i class="sv-icons-github outline-icon" style="color: #2f54eb"></i>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #2f54eb">{{ outlineData['今日']?.pv_count }}</span>
            <span class="text-xs ml-10 text-gray">今日</span>
            <span class="text-xl ml-20" style="color: #69c0ff">{{ outlineData['昨日']?.pv_count }}</span>
            <span class="text-xs ml-10 text-grey">昨日</span>
          </div>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #597ef7">{{ outlineData['预计今日']?.pv_count.val }}</span>
            <i v-if="outlineData['预计今日']?.pv_count.flag > 0" class="uni-icons-pulldown flip-x180 ml-5 text-bold slide-top-down text-green"></i>
            <i v-else-if="outlineData['预计今日']?.pv_count.flag < 0" class="uni-icons-pulldown ml-5 text-bold slide-top-down text-red"></i>
            <i v-else class="cuIcon-move text-bold ml-5 text-cyan"></i>
            <span class="text-xs ml-5 text-cyan">预计今日</span>
          </div>
          <div class="text-sm" style="color: #1890ff; margin-top: auto">浏览量(PV)</div>
        </div>
      </el-col>
      <!-- 访客数(UV) -->
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <i class="sv-icons-github outline-icon" style="color: #2f54eb"></i>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #2f54eb">{{ outlineData['今日']?.visitor_count }}</span>
            <span class="text-xs ml-10 text-gray">今日</span>
            <span class="text-xl ml-20" style="color: #69c0ff">{{ outlineData['昨日']?.visitor_count }}</span>
            <span class="text-xs ml-10 text-grey">昨日</span>
          </div>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #597ef7">{{ outlineData['预计今日']?.visitor_count.val }}</span>
            <i v-if="outlineData['预计今日']?.visitor_count.flag > 0" class="uni-icons-pulldown flip-x180 ml-5 text-bold slide-top-down text-green"></i>
            <i v-else-if="outlineData['预计今日']?.visitor_count.flag < 0" class="uni-icons-pulldown ml-5 text-bold slide-top-down text-red"></i>
            <i v-else class="cuIcon-move text-bold ml-5 text-cyan"></i>
            <span class="text-xs ml-5 text-cyan">预计今日</span>
          </div>
          <div class="text-sm" style="color: #1890ff; margin-top: auto">访客数(UV)</div>
        </div>
      </el-col>
      <!-- IP数 -->
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <i class="sv-icons-github outline-icon" style="color: #2f54eb"></i>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #2f54eb">{{ outlineData['今日']?.ip_count }}</span>
            <span class="text-xs ml-10 text-gray">今日</span>
            <span class="text-xl ml-20" style="color: #69c0ff">{{ outlineData['昨日']?.ip_count }}</span>
            <span class="text-xs ml-10 text-grey">昨日</span>
          </div>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #597ef7">{{ outlineData['预计今日']?.ip_count.val }}</span>
            <i v-if="outlineData['预计今日']?.ip_count.flag > 0" class="uni-icons-pulldown flip-x180 ml-5 text-bold slide-top-down text-green"></i>
            <i v-else-if="outlineData['预计今日']?.ip_count.flag < 0" class="uni-icons-pulldown ml-5 text-bold slide-top-down text-red"></i>
            <i v-else class="cuIcon-move text-bold ml-5 text-cyan"></i>
            <span class="text-xs ml-5 text-cyan">预计今日</span>
          </div>
          <div class="text-sm" style="color: #1890ff; margin-top: auto">IP数</div>
        </div>
      </el-col>
      <!-- 跳出率 -->
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <i class="sv-icons-github outline-icon" style="color: #2f54eb"></i>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #2f54eb">{{ outlineData['今日']?.bounce_ratio }}%</span>
            <span class="text-xs ml-10 text-gray">今日</span>
            <br />
            <span class="text-xl ml-10" style="color: #69c0ff">{{ outlineData['昨日']?.bounce_ratio }}%</span>
            <span class="text-xs ml-10 text-grey">昨日</span>
          </div>
          <div class="text-sm" style="color: #1890ff; margin-top: auto">跳出率</div>
        </div>
      </el-col>
      <!-- 平均访问时长 -->
      <el-col :span="4">
        <div class="card flex-col" style="height: 150px">
          <i class="sv-icons-github outline-icon" style="color: #2f54eb"></i>
          <div>
            <span class="text-xxl text-bold text-italic" style="color: #2f54eb">{{ timeFormat(outlineData['今日']?.avg_visit_time, 'ss') }}</span>
            <span class="text-xs ml-10 text-gray">今日</span>
            <br />
            <span class="text-xl ml-10" style="color: #69c0ff">{{ timeFormat(outlineData['昨日']?.avg_visit_time, 'ss') }}</span>
            <span class="text-xs ml-10 text-grey">昨日</span>
          </div>
          <div class="text-sm" style="color: #1890ff; margin-top: auto">平均访问时长</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FloatSideButton from '@/components/FloatSideButton/FloatSideButton.vue'
import { useAnalyticsStore } from '@/store/analytics'
import { getBaiduTokenCode, getBaiduTokenByCode, refreshBaiduToken, getSiteList, getOutline } from '@/api/analytics'
import { ElMessage } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import svgbaidutongji from '@/assets/svgs/baidu_tongji.svg'
import { transformOutline } from '@/utils/baidu_tongji'
import { timeFormat } from '@/utils'

const analyticsStore = useAnalyticsStore()
const refresh_token = computed(() => analyticsStore.getBaiduToken('refresh_token'))
const access_token = computed(() => analyticsStore.getBaiduToken('access_token'))
const curSiteId = computed({
  set(newVal) {
    analyticsStore.curSiteId = newVal
  },
  get() {
    return analyticsStore.curSiteId
  }
})

const code = ref('') // 获取token凭证

onMounted(async () => {
  await querySiteList()
  init()
})

/**
 * BaiduToken相关
 */
const { copy } = useClipboard() // 剪切板hook
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
  if (!code.value) return ElMessage({ type: 'error', message: '请获取并输入code' })
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
    code.value = '' // 清空code
  }
}
async function refreshRtAt() {
  if (!refresh_token.value) return ElMessage({ type: 'error', message: '无有效refresh_token' })
  const newToken = await refreshBaiduToken({ refresh_token: refresh_token.value })
  if (newToken.success) {
    const { refresh_token, access_token } = newToken.data
    analyticsStore.setBaiduToken('refresh_token', refresh_token)
    analyticsStore.setBaiduToken('access_token', access_token)
    ElNotification({
      title: 'Success',
      message: newToken?.msg,
      type: 'success'
    })
    code.value = '' // 清空code
  }
}

/**
 * 数据相关
 */

// 站点列表
const siteList = ref([])
async function querySiteList() {
  const siteRes = await getSiteList({ access_token: access_token.value })
  siteList.value = siteRes.data?.list || []
}

// 初始化/刷新所有数据
async function init() {
  if (!access_token.value || !curSiteId.value) return
  queryOutline()
}

// 今日流量：取今日/昨日/预计今日数据
const outlineData = ref({})
async function queryOutline() {
  const res = await getOutline({ access_token: access_token.value, site_id: curSiteId.value })
  const resData = res.data?.result
  outlineData.value = transformOutline(resData)
  console.log('getOutline res :>> ', outlineData.value)
}
</script>

<style lang="scss" scoped>
.page-container {
  height: auto;

  .outline-icon {
    position: absolute;
    bottom: -30%;
    right: -20%;
    font-size: 160px;
    opacity: 0.2;
    pointer-events: none;
  }
}
</style>
