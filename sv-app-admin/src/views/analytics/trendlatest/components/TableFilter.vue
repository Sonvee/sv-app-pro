<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm" label-width="auto">
      <el-form-item prop="source" label="来源">
        <DictSelect v-model="filterForm.source" :dictList="sourceList" placeholder="请选择来源" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="area" label="地域">
        <DictSelect v-model="filterForm.area" :dictList="areaList" placeholder="请选择地域" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="clientDevice" label="设备">
        <DictSelect v-model="filterForm.clientDevice" :dictList="clientDeviceList" placeholder="请选择设备" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="visitor" label="访客">
        <DictSelect v-model="filterForm.visitor" :dictList="visitorList" placeholder="请选择访客" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="visitCount" label="访问频次">
        <DictSelect v-model="filterForm.visitCount" :dictList="visitCountList" placeholder="请选择访问频次" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="visitPage" label="访问深度">
        <DictSelect v-model="filterForm.visitPage" :dictList="visitPageList" placeholder="请选择访问深度" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="visitTime" label="访问时长">
        <DictSelect v-model="filterForm.visitTime" :dictList="visitTimeList" placeholder="请选择访问时长" style="width: 150px"></DictSelect>
      </el-form-item>
      <el-form-item prop="searchWord" label="关键词/搜索词">
        <el-input v-model.trim="filterForm.searchWord" placeholder="请输入关键词/搜索词" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="url" label="入口页面">
        <el-input v-model.trim="filterForm.url" placeholder="请输入入口页面" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="visitorId" label="访客标识码">
        <el-input v-model.trim="filterForm.visitorId" placeholder="请输入访客标识码" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="ip" label="IP">
        <el-input v-model.trim="filterForm.ip" placeholder="请输入IP" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="date_range" label="时间范围">
        <el-date-picker
          v-model="filterForm.date_range"
          type="datetimerange"
          start-placeholder="开始"
          end-placeholder="结束"
          range-separator="~"
          value-format="x"
          style="width: 350px"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" v-permission="['sys:analytics:query']" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DictSelect from '@/components/DictType/DictSelect.vue'
import dayjs from 'dayjs'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  source: 'all', // all 全部来源 | through 直接访问 | search,0 搜索引擎(不做细分) | link 外部链接 | custom 自定义来源
  area: 'all', // all 全部地域 | china 全国 | province,1北京 2上海 3天津 4,0广东(不做细分) 5,0福建 ... | other 其他
  clientDevice: 'all', // all 全部 | pc 计算机 | mobile 移动设备
  visitor: 'all', // all | new 新访客 | old 老访客
  visitCount: '0', // 0 全部访问频次 | 1 1次 | 2 2次 | 3 3次 | 4 4次 | 5 5-10次 | 6 11-20次 | 7 20次以上
  visitPage: '0', // 0 全部访问深度 | 1 1页 | 2 2页 | 3 3页 | 4 4页 | 5 5-10页 | 6 11-20页 | 7 20页以上
  visitTime: '0', // 0 全部访问时长 | 1 0-30s | 2 31-60s | 3 61-90s | 4 91-180s | 5 181-300s | 6 301-600s | 7 600s以上
  searchWord: '', // 关键词/搜索词
  url: '', // 入口页面
  visitorId: '', // 访客标识码
  ip: '', // IP
  date_range: [dayjs().subtract(6, 'day').startOf('day').valueOf(), dayjs().endOf('day').valueOf()] // 时间范围 默认最近7天
})

const sourceList = [
  { label: '全部来源', value: 'all' },
  { label: '直接访问', value: 'through' },
  { label: '搜索引擎', value: 'search,0' },
  { label: '外部链接', value: 'link' },
  { label: '自定义来源', value: 'custom' }
]
// all 全部地域 | china 全国 | province,1北京 2上海 3天津 4,0广东(不做细分) 5,0福建 ... | other 其他
const areaList = [
  { label: '全部地域', value: 'all' },
  { label: '全国', value: 'china' },
  { label: '省市自治区', value: 'province' },
  { label: '其他', value: 'other' }
]
const clientDeviceList = [
  { label: '全部', value: 'all' },
  { label: '计算机', value: 'pc' },
  { label: '移动设备', value: 'mobile' }
]
const visitorList = [
  { label: '全部', value: 'all' },
  { label: '老访客', value: 'new' },
  { label: '新访客', value: 'old' }
]
const visitCountList = [
  { label: '全部访问频次', value: '0' },
  { label: '1次', value: '1' },
  { label: '2次', value: '2' },
  { label: '3次', value: '3' },
  { label: '4次', value: '4' },
  { label: '5-10次', value: '5' },
  { label: '11-20次', value: '6' },
  { label: '20次以上', value: '7' }
]
const visitPageList = [
  { label: '全部访问深度', value: '0' },
  { label: '1页', value: '1' },
  { label: '2页', value: '2' },
  { label: '3页', value: '3' },
  { label: '4页', value: '4' },
  { label: '5-10页', value: '5' },
  { label: '11-20页', value: '6' },
  { label: '20页以上', value: '7' }
]
const visitTimeList = [
  { label: '全部访问时长', value: '0' },
  { label: '0-30s', value: '1' },
  { label: '31-60s', value: '2' },
  { label: '61-90s', value: '3' },
  { label: '91-180s', value: '4' },
  { label: '181-300s', value: '5' },
  { label: '301-600s', value: '6' },
  { label: '600s以上', value: '7' }
]

onMounted(() => {
  // 初始化提交一次
  emits('submit', filterForm.value)
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterFormRef.value.resetFields()
}
</script>

<style lang="scss"></style>
