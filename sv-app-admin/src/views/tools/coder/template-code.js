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
        <el-button type="primary" plain :icon="Plus" @click="add">新增</el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="!isTruthy(batchSelection, 'arr')" @click="batchDelete">批量删除</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
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
              <el-button text :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
              <el-button text :icon="Delete" @click="del(scope.row)">删除</el-button>
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
import { testList, testAdd, testUpdate, testDelete, testBatchDelete } from '@/api/test'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'

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
  const res = await testList(params)
  loading.value = false
  tableData.value = res.data || []
  total.value = res.total
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
        <el-button type="primary" @click="submit">搜索</el-button>
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

\`\`\`
`

const model = `> EggJs model/test.js 
\`\`\`js
'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const TestSchema = new mongoose.Schema(
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
  return mongoose.model('test', TestSchema)
}

\`\`\`
`

const controller = `> EggJs controller/test.js
\`\`\`js
'use strict'

const Controller = require('egg').Controller

class TestController extends Controller {
  async testList() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testList(data)
    ctx.result(res)
  }

  async testAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testAdd(data)
    ctx.result(res)
  }

  async testUpdate() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testUpdate(data)
    ctx.result(res)
  }

  async testDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testDelete(data)
    ctx.result(res)
  }

  async testBatchAdd() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testBatchAdd(data)
    ctx.result(res)
  }

  async testBatchDelete() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.test.testBatchDelete(data)
    ctx.result(res)
  }
}

module.exports = TestController

\`\`\`
`

const service = `> EggJs service/test.js
\`\`\`js
'use strict'

const { isTruthy } = require('../utils')

const Service = require('egg').Service

class TestService extends Service {
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

    // 参数处理
    let { pagesize = 20, pagenum = 1 } = data
    pagesize = Number(pagesize)
    pagenum = Number(pagenum)

    // 参数校验
    if (pagenum < 1) ctx.throw(400, { msg: 'pagenum不能小于1' })

    // 数据库连接
    const db = app.model.Test

    // 查询条件处理
    const conditions = {}

    // 查询条件
    if (isTruthy(data.test_id)) conditions.test_id = data.test_id
    if (isTruthy(data.test_name)) conditions.test_name = { $regex: data.test_name, $options: 'i' } // 模糊查询

    // 查询操作
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
    ctx.checkAuthority('permission', ['testAdd'])

    // 参数处理
    delete data._id // 去除部分参数

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 数据库连接
    const db = app.model.Test

    // 查询条件处理
    const conditions = { test_id: data.test_id }

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
    ctx.checkAuthority('permission', ['testUpdate'])

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 数据库连接
    const db = app.model.Test

    // 查询条件处理
    const conditions = { test_id: data.test_id }

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
    ctx.checkAuthority('permission', ['testDelete'])

    // 参数校验
    if (!isTruthy(data.test_id)) ctx.throw(400, { msg: 'test_id 必填' })

    // 数据库连接
    const db = app.model.Test

    // 查询条件处理
    const conditions = { test_id: data.test_id }

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
    ctx.checkAuthority('permission', ['testBatchAdd'])

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
    const db = app.model.Test

    // 主键
    const primaryKey = 'test_id'

    // 过滤掉主键缺失无效的项
    data.list = data.list.filter((item) => item[primaryKey])

    // 结果处理
    let res, tip
    if (data.cover) {
      // 覆盖模式：使用 upsert 更新或插入数据
      res = await Promise.all(
        data.list.map(async (item) => {
          try {
            return await db.findOneAndUpdate({ [primaryKey]: item[primaryKey] }, item, { upsert: true, new: true })
          } catch (error) {
            ctx.logger.warn(\`Error updating or inserting item \${item[primaryKey]}:\`, error)
            return null // 返回一个表示失败的特殊值
          }
        })
      )
    } else {
      // 增量模式：使用 insertMany 插入数据
      const existingIds = data.list.map((item) => item[primaryKey])
      const batchSize = app.config.batchAddSize || 1000 // 分批数量 app.config.batchAddSize 在 config.default.js 中配置
      const existingKeys = []

      // 分批处理，避免 $in 操作符中的元素过多，
      for (let i = 0; i < existingIds.length; i += batchSize) {
        const batchKeys = existingIds.slice(i, i + batchSize)
        const batchExistingItems = await db.find({ [primaryKey]: { $in: batchKeys } })
        existingKeys.push(...batchExistingItems.map((item) => item[primaryKey]))
      }

      if (existingKeys.length > 0) {
        tip = \`已跳过存在项：\${existingKeys.toString()}\`
      }

      // 过滤掉已存在的记录
      const filteredItems = data.list.filter((item) => !existingKeys.includes(item[primaryKey]))

      try {
        res = await db.insertMany(filteredItems)
      } catch (error) {
        ctx.logger.error('Error during insertMany operation:', error)
        return ctx.throw(500, { msg: '服务器内部错误' })
      }
    }

    return {
      data: res,
      msg: data.cover ? '批量覆盖添加成功' : '批量增量添加成功',
      tip
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
    ctx.checkAuthority('permission', ['testBatchDelete'])

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
    const db = app.model.Test
    // 主键
    const primaryKey = 'test_id'

    // 分批处理删除操作，避免单次操作处理过多数据
    const batchSize = app.config.batchDeleteSize || 1000 // 分批数量 app.config.batchDeleteSize 在 config.default.js 中配置
    let deletedCount = 0

    // 执行批量删除
    for (let i = 0; i < data.list.length; i += batchSize) {
      const batchKeys = data.list.slice(i, i + batchSize)
      const deleteRes = await db.deleteMany({ [primaryKey]: { $in: batchKeys } })
      deletedCount += deleteRes.deletedCount
    }

    // 其他处理
    if (deletedCount == 0) ctx.throw(400, { msg: '无有效数据项删除' })

    return {
      msg: '批量删除成功',
      tip: \`共删除\${deletedCount}条记录\`
    }
  }
}

module.exports = TestService

\`\`\`
`

export { table, filter, form, api, model, controller, service }
