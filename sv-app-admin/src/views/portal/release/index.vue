<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" @click="add">新增</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="version" label="版本号" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="应用类型" align="center" width="160" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictStore.getDict('dict_app_type')" :value="scope.row.type"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="file.url" label="资源地址" min-width="300" show-overflow-tooltip>
          <template #default="scope">
            <a :href="scope.row?.file?.url" download>{{ scope.row?.file?.url }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="link" label="资源链接" min-width="300" show-overflow-tooltip>
          <template #default="scope">
            <a :href="scope.row?.link" target="_blank">{{ scope.row?.link }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="qrcode" label="应用码源文本" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="版本描述" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="intro" label="应用简介" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="screenshot" label="应用截图" min-width="300">
          <template #default="scope">
            <div class="flex-vc text-line-1">
              <el-image
                class="screenshot-iamges"
                v-for="(item, index) in scope.row?.screenshot"
                :key="item?.url"
                :src="item?.url"
                :preview-src-list="scope.row?.screenshot?.map((i) => i?.url)"
                :initial-index="index"
                preview-teleported
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mandatory" label="是否强制更新" align="center" width="160" show-overflow-tooltip>
          <template #default="scope">
            <el-switch v-model="scope.row.mandatory" inline-prompt :active-icon="Check" :inactive-icon="Close" @change="handleTableSwitch(scope.row)" />
          </template>
        </el-table-column>

        <el-table-column
          prop="release_date"
          label="发布日期"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.release_date, 'YYYY-MM-DD')"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="primary" :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" @click="del(scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <TablePagination :pagingParams="dataParams" :total="total" @update:page-size="handleSizeChange" @update:current-page="handleCurrentChange"></TablePagination>
    </div>
    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" :form-mode="formMode" @submit="submitForm"></TableForm>
  </div>
</template>

<script setup name="release">
import { ref, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import { releaseList, releaseAdd, releaseUpdate, releaseDelete, releaseLatest } from '@/api/release'
import { RefreshRight, Plus, EditPen, Delete, View, Hide, Check, Close, Top, Minus } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
// 初始化字典
function dictInit() {
  dictStore.initDict(['dict_app_type'])
}

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

onMounted(() => {
  dictInit()
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await releaseList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
}

// 开关直接修改
async function handleTableSwitch(row) {
  const res = await releaseUpdate(row)
  if (res.success) {
    ElMessage({
      type: 'success',
      message: res?.msg
    })
  }
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}

// 增
function add() {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  showForm.value = true
}

// 改
function edit(row) {
  formInit.value = row // 携带参数
  formMode.value = 'edit'
  showForm.value = true
}

// 删
function del(row) {
  const { version, type } = row
  ElMessageBox.confirm(`确认删除『 ${version} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await releaseDelete({ version, type })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

// 刷新
function refresh() {
  // 置空数据
  tableData.value = []
  handleTable(dataParams.value)
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await releaseAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await releaseUpdate(e.data)
      break
  }
  if (result.success) {
    showForm.value = false
    ElNotification({
      title: 'Success',
      message: result?.msg,
      type: 'success'
    })
    refresh()
  }
}

// 分页
function handleSizeChange(e) {
  dataParams.value.pagesize = e
  handleTable(dataParams.value)
}
function handleCurrentChange(e) {
  dataParams.value.pagenum = e
  handleTable(dataParams.value)
}
</script>

<style lang="scss" scoped>
.screenshot-iamges {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  margin-right: 6px;
}
</style>
