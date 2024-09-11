const table = `> 表格页面 index.vue
\`\`\`vue3
<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" v-permission="['sys:test:add']" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" v-permission="['sys:test:batchdelete']" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <ExcelTool ref="excelToolRef" class="mr-12" v-permission="['sys:test:excel']" @onTool="onExcelTool" @confirmUpload="excelUpload"></ExcelTool>
        <el-button circle :icon="RefreshRight" v-permission="['sys:test:query']" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="50" fixed="left" />
        <el-table-column prop="test_id" label="ID" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="test_name" label="名称" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="created_date" label="创建时间" align="center" width="180" sortable :formatter="(row) => timeFormat(row.created_date)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updated_date" label="更新时间" align="center" width="180" sortable :formatter="(row) => timeFormat(row.updated_date)" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="160" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button text type="primary" :icon="EditPen" v-permission="['sys:test:update']" @click="edit(scope.row)">编辑</el-button>
              <el-button text type="danger" :icon="Delete" v-permission="['sys:test:delete']" @click="del(scope.row)">删除</el-button>
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

<script setup name="test">
import { ref, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import ExcelTool from '@/components/ExcelTool/ExcelTool.vue'
import { testList, testAdd, testUpdate, testDelete, testBatchDelete, testImport, testExport, testExcelTemplate } from '@/api/test'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useSaveFile } from '@/hooks/useSaveFile'

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await testList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
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
  const { test_name, test_id } = row
  ElMessageBox.confirm(\`确认删除『 \${test_name} 』吗？\`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await testDelete({ test_id })
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
  batchSelection.value = []
  handleTable(dataParams.value)
}

// 多选
const batchSelection = ref([])
function handleSelectionChange(e) {
  batchSelection.value = e.map((item) => item.test_id)
}

// 批量删除
function batchDelete() {
  if (!isTruthy(batchSelection.value, 'arr')) return
  ElMessageBox.confirm('确认批量删除所选项吗？', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认批量删除操作
      const deleteRes = await testBatchDelete({
        list: batchSelection.value
      })
      ElMessage({
        type: 'success',
        message: deleteRes?.msg
      })
      refresh()
    })
    .catch(() => {})
}

// 提交表单
async function submitForm(e) {
  try {
    let result = {}
    switch (e.mode) {
      case 'add':
        // 新增添加
        result = await testAdd(e.data)
        break
      case 'edit':
        // 编辑更新
        result = await testUpdate(e.data)
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
  } catch (error) {
    console.warn(error.msg)
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

// excel工具
const excelToolRef = ref()
async function onExcelTool(e) {
  switch (e) {
    case 'import':
      // 打开导入文件面板
      excelToolRef.value.openUpload()
      break
    case 'export':
      // 在当前筛选条件下进行全量导出
      const params = Object.assign({ ...dataParams.value }, { pagenum: 1, pagesize: -1 })
      const exportRes = await testExport(params)
      useSaveFile().start(exportRes, '测试列表.xlsx')
      break
    case 'template':
      const templateRes = await testExcelTemplate()
      useSaveFile().start(templateRes, '测试模板.xlsx')
      break
  }
}

// 确认导入
async function excelUpload() {
  const upRes = await excelToolRef.value.upload(testImport, 'files')
  if (upRes.success) {
    ElNotification({ title: 'Success', message: upRes?.msg, type: 'success' })
    refresh()
  }
  excelToolRef.value.closeUpload()
}
</script>

<style lang="scss" scoped></style>

\`\`\`
`

const filter = `> 筛选栏 TableFilter.vue
\`\`\`vue3
<template>
  <view class="table-filter card">
    <el-form ref="filterFormRef" inline :model="filterForm">
      <el-form-item prop="test_id" label="ID">
        <el-input v-model.trim="filterForm.test_id" placeholder="请输入ID" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item prop="test_name" label="名称">
        <el-input v-model.trim="filterForm.test_name" placeholder="请输入名称" clearable style="width: 150px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['sys:test:query']" @click="submit">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const emits = defineEmits(['submit'])

const filterFormRef = ref()
// 过滤条件表单
const filterForm = ref({
  test_id: '',
  test_name: ''
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

\`\`\`
`

const form = `> 表单 TableForm.vue
\`\`\`vue3
<template>
  <el-drawer class="sv-el-drawer" v-bind="$attrs" ref="tableFormRef" @open="openDrawer" @close="closeDrawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120" label-position="left">
        <el-form-item prop="test_id" label="ID" required>
          <el-input v-model="formData.test_id" :disabled="formMode !== 'add'" placeholder="请输入ID" clearable />
        </el-form-item>
        <el-form-item prop="test_name" label="名称" required>
          <el-input v-model="formData.test_name" placeholder="请输入名称" clearable />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { assignOverride } from '@/utils'
import { ElNotification } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash-es'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['submit'])

// 初始数据
const formBase = {
  test_id: '', // 主键
  test_name: '',
}
// 表单数据
const formData = ref(formBase)
// 初始数据克隆
const formBaseClone = ref()
// 校验规则
const rules = ref({
  test_id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
  test_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const tableFormRef = ref() // 抽屉
const formRef = ref() // 表单

// 抽屉打开回调
function openDrawer() {
  // 表单数据初始化更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
  // 克隆初始数据，用作后续对比
  formBaseClone.value = cloneDeep(formData.value)
}

// 抽屉关闭回调
function closeDrawer() {}

// 关闭抽屉
function cancel() {
  tableFormRef.value.handleClose()
}
// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 对比数据是否发生变化
      if (isEqual(formBaseClone.value, formData.value)) {
        // 未变化则提示并关闭抽屉
        ElNotification({
          title: 'Info',
          message: '数据未变更',
          type: 'info'
        })
        tableFormRef.value.handleClose()
        return
      }
      
      emits('submit', { data: formData.value, mode: props.formMode })
      // tableFormRef.value.handleClose() // 此处无需主动关闭，在请求接口成功后再关闭
    } else {
      console.log('校验失败 ===> ', fields)
    }
  })
}
</script>

<style lang="scss"></style>

\`\`\`
`

const api = `> api test/index.js 
\`\`\`js
import request from '@/config/request/request.js'

export function testList(data) {
  return request({
    url: '/sys/testList',
    method: 'post',
    data
  })
}

export function testAdd(data) {
  return request({
    url: '/sys/testAdd',
    method: 'post',
    data
  })
}

export function testUpdate(data) {
  return request({
    url: '/sys/testUpdate',
    method: 'post',
    data
  })
}

export function testDelete(data) {
  return request({
    url: '/sys/testDelete',
    method: 'post',
    data
  })
}

export function testBatchAdd(data) {
  return request({
    url: '/sys/testBatchAdd',
    method: 'post',
    data
  })
}

export function testBatchDelete(data) {
  return request({
    url: '/sys/testBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function testImport(data) {
  return request({
    url: '/sys/testImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function testExport(data) {
  return request({
    url: '/sys/testExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function testExcelTemplate() {
  return request({
    url: '/sys/testExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

\`\`\`
`

const model = `> EggJs model/sysTest.js 
\`\`\`js
'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysTestSchema = new mongoose.Schema(
    {
      test_id: {
        type: String,
        unique: true,
        required: true
      },
      test_name: {
        type: String
      },
      // 自动生成字段
      created_date: {
        type: Number
      },
      updated_date: {
        type: Number
      }
    },
    {
      versionKey: false, // 去除版本号字段
      timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
    }
  )

  /**
   * 创建数据模型
   * 参数1：连接表名称（自动添加复数形式，自动转为小写），参数2：Schema，参数3：连接表自定义名称（可选，优先级大于参数1）
   */
  return mongoose.model('sys_test', SysTestSchema)
}

\`\`\`
`

const controller = `> EggJs controller/sysTest.js
\`\`\`js
'use strict'

const Controller = require('egg').Controller

class SysTestController extends Controller {
  async testList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testList(data)
    ctx.result(res)
  }

  async testAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testAdd(data)
    ctx.result(res)
  }

  async testUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testUpdate(data)
    ctx.result(res)
  }

  async testDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testDelete(data)
    ctx.result(res)
  }

  async testBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testBatchAdd(data)
    ctx.result(res)
  }

  async testBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testBatchDelete(data)
    ctx.result(res)
  }

  async testExcelTemplate() {
    const { ctx, service } = this
    const res = await service.sysTest.testExcelTemplate()
    ctx.result(res)
  }

  async testImport() {
    const { ctx, service } = this
    const files = ctx.request.files
    const data = ctx.request.body
    const res = await service.sysTest.testImport({ data, files })
    ctx.result(res)
  }

  async testExport() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.sysTest.testExport(data)
    ctx.result(res)
  }
}

module.exports = SysTestController

\`\`\`
`

const service = `> EggJs service/sysTest.js
\`\`\`js
'use strict'

const { isTruthy } = require('../utils')
const { batchAdd, batchDelete } = require('../utils/batch')
const useExcel = require('../utils/excel');

const Service = require('egg').Service

class SysTestService extends Service {
  /**
   * 查询 post - 权限 open
   * @param {Object} data - 请求参数
   * @property {String} data.test_id - id
   * @property {String} data.test_name - 名称
   * @property {Number} data.pagesize - 每页条数
   * @property {Number} data.pagenum - 页码
   */
  async testList(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('open')

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.test_id)) conditions.test_id = data.test_id
    if (isTruthy(data.test_name)) conditions.test_name = { $regex: data.test_name, $options: 'i' } // 模糊查询

    // 数据库连接
    const db = app.model.SysTest

    // 查询
    let query = db.find(conditions)

    // 排序：1升序，-1降序
    query = query.sort({ created_date: -1 }) // 按照创建时间倒序

    // 分页
    if (pagesize > 0) {
      query = query.skip(pagesize * (pagenum - 1)).limit(pagesize)
    }

    // 计数
    const count = await db.countDocuments(conditions)

    // 页数
    const pages = pagesize > 0 ? Math.ceil(count / pagesize) : count > 0 ? 1 : 0

    // 开启 Lean
    query = query.lean()
    
    // 处理查询结果
    const res = await query.exec()

    return {
      data: res,
      msg: '列表获取成功',
      total: count,
      pagenum,
      pagesize,
      pages
    }
  }

  /**
   * 新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.test_id - id
   * @property {String} data.test_name - 名称
   */
  async testAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:add'])

    // 参数处理
    // delete data.test_id // 去除自动生成键

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 查询条件处理
    const conditions = { test_id: data.test_id }

    // 数据库连接
    const db = app.model.SysTest

    // 查询
    const one = await db.findOne(conditions)
    if (one) ctx.throw(400, { msg: '新增项已存在' })

    const res = await db.create(data)

    return {
      data: res,
      msg: '新增成功'
    }
  }

  /**
   * 更新 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.test_id - id
   * @property {String} data.test_name - 名称
   */
  async testUpdate(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:update'])

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 查询条件处理
    const conditions = { test_id: data.test_id }

    // 数据库连接
    const db = app.model.SysTest

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '更新项不存在' })

    const res = await db.findOneAndUpdate(conditions, data, { new: true })

    return {
      data: res,
      msg: '更新成功'
    }
  }

  /**
   * 删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {String} data.test_id - id
   */
  async testDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:delete'])

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 查询条件处理
    const conditions = { test_id: data.test_id }

    // 数据库连接
    const db = app.model.SysTest

    // 查询
    const one = await db.findOne(conditions)
    if (!one) ctx.throw(400, { msg: '删除项不存在或已被删除' })

    const res = await db.deleteOne(conditions)

    return {
      data: res,
      msg: '删除成功'
    }
  }

  /**
   * 批量新增 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list 批量新增项
   * @property {Boolean} data.cover - 是否覆盖 默认true
   */
  async testBatchAdd(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:batchadd'])

    // 参数处理
    data = Object.assign(
      {
        list: [],
        cover: false // 是否覆盖
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' })

    // 数据库连接
    const db = app.model.SysTest

    // 主键
    const primaryKey = 'test_id'

    // 批量添加
    const res = await batchAdd(ctx, db, data, primaryKey)

    let msg = data.cover ? '批量覆盖添加成功' : '批量增量添加成功'
    if (!isTruthy(res?.data, 'arrobj')) msg += ' - 无有效数据项添加'

    return {
      data: res?.data,
      msg: msg,
      tip: res?.tip
    }
  }

  /**
   * 批量删除 post - 权限 permission
   * @param {Object} data - 请求参数
   * @property {Array} data.list - 批量新增项
   */
  async testBatchDelete(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:batchdelete'])

    // 参数处理
    data = Object.assign(
      {
        list: [] // 需要删除的记录的ID列表
      },
      data
    )

    // 参数校验
    if (!Array.isArray(data.list)) ctx.throw(400, { msg: 'list 必须是数组' })
    if (!isTruthy(data.list, 'arr')) ctx.throw(400, { msg: 'list 为空' })

    // 数据库连接
    const db = app.model.SysTest
    
    // 主键
    const primaryKey = 'test_id'

    // 批量删除
    const deletedCount = await batchDelete(ctx, db, data, primaryKey)

    return {
      msg: '批量删除成功',
      tip: \`共删除\${deletedCount}条记录\`
    }
  }

  /**
   * excel模板下载 get - 权限 permission
   */
  async testExcelTemplate() {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:excel'])

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '测试ID', key: 'test_id', width: 40 },
      { header: '测试名称', key: 'test_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = [
      { sort: 0, test_id: 'text_0', test_name: '测试0', status: 1, remark: '测试备注0' },
      { sort: 1, test_id: 'text_1', test_name: '测试1', status: 1, remark: '测试备注1' }
    ]

    try {
      const options = { columns, data: tableData, fileName: 'test_excel_template' }
      const buffer = await useExcel().createWorkSheet(ctx, options)

      return {
        type: 'buffer', // 注明类型为二进制文件
        data: buffer
      }
    } catch (error) {
      ctx.throw(500, { msg: '下载模板失败', errMsg: error.message })
    }
  }

  /**
   * excel导入 post - 权限 permission
   * @param {Array<File>} files 用户上传的文件
   * @param {Object} data 请求参数（经过FormData上传处理的参数像Boolean等类型会被自动转为字符串，需手动解析）
   */
  async testImport({ data, files }) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:excel'])

    // 参数校验
    if (!isTruthy(files, 'arrobj')) ctx.throw(400, { msg: 'files 为空' })

    // 表头：column对应列，name对应名称，field对应字段键名（严格对应列匹配）
    const header = [
      { column: 'A', name: '序号', field: 'sort' },
      { column: 'B', name: '测试ID', field: 'test_id' },
      { column: 'C', name: '测试名称', field: 'test_name' },
      { column: 'D', name: '状态', field: 'status' },
      { column: 'E', name: '备注', field: 'remark' }
    ]
    // 解析成JSON数据
    const jsondata = await useExcel().readExcelFilesToJson(files, header)

    // 导入数据
    const addParams = {
      list: jsondata,
      cover: isTruthy(data.cover, 'strbo') // 经过formdata处理后会自动转为字符串，需要解析一下
    }
    const impRes = await this.testBatchAdd(addParams)

    return impRes
  }

  /**
   * excel导出 post - 权限 permission
   * @param {Object} data 请求参数
   */
  async testExport(data) {
    const { ctx, app } = this

    // 权限校验
    ctx.checkAuthority('permission', ['sys:test:excel'])

    const listRes = await this.testList(data)

    // 表头列（顺序严格）
    const columns = [
      { header: '序号', key: 'sort', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '测试ID', key: 'test_id', width: 40 },
      { header: '测试名称', key: 'test_name', width: 40 },
      { header: '状态', key: 'status', width: 10, style: { alignment: { horizontal: 'center' } } },
      { header: '备注', key: 'remark', width: 40 }
    ]

    // 填充数据
    const tableData = listRes.data

    try {
      const options = { columns, data: tableData, fileName: 'test_list' }
      const buffer = await useExcel().createWorkSheet(ctx, options)

      return {
        type: 'buffer', // 注明类型为二进制文件
        data: buffer
      }
    } catch (error) {
      ctx.throw(500, { msg: '导出文件失败', errMsg: error.message })
    }
  }
}

module.exports = SysTestService

\`\`\`
`

export { table, filter, form, api, model, controller, service }
