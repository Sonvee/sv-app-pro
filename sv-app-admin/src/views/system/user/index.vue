<template>
  <div class="page-container">
    <!-- 筛选栏 -->
    <TableFilter v-if="showFilter" @submit="submitFilter"></TableFilter>
    <!-- 表格主体 -->
    <div class="card table-container">
      <!-- 工具栏 -->
      <div class="table-control">
        <el-button type="primary" plain :icon="Plus" @click="register">注册新用户</el-button>
        <div style="flex: 1"></div>
        <el-button circle :icon="RefreshRight" @click="refresh" title="刷新"></el-button>
        <el-button circle :icon="showFilter ? View : Hide" @click="showFilter = !showFilter" :title="showFilter ? '隐藏筛选' : '显示筛选'"></el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="user_id" label="UID" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="用户名" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" width="80" show-overflow-tooltip>
          <template #default="scope">
            <el-image class="avatar-image" v-if="scope.row.avatar" :src="scope.row.avatar?.url" />
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="240" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-for="role in scope.row.role" :key="role" class="mr-4">{{ role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department_id" label="部门" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="手机号" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" label="邮箱" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tags" label="标签" min-width="240" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" class="mr-4">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="备注" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictUserStatus" :value="scope.row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="120" show-overflow-tooltip>
          <template #default="scope">
            <DictTag :dictList="dictUserGender" :value="scope.row.gender"></DictTag>
          </template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          label="生日"
          align="center"
          width="160"
          sortable
          :formatter="(row) => (row.birthday ? timeFormat(row.birthday, 'YYYY-MM-DD') : '')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="my_invite_code" label="邀请码" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inviter_uid" label="邀请人" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="score" label="积分" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="register_ip" label="注册IP" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="register_platform" label="注册平台" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="register_date"
          label="注册时间"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.register_date)"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="login_ip" label="登录IP" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="login_platform" label="登录平台" align="center" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="login_date"
          label="登录时间"
          align="center"
          width="180"
          sortable
          :formatter="(row) => timeFormat(row.login_date)"
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
    <!-- 注册新用户 -->
    <UserRegister v-model="showUserRegister" @registerSuccess="refresh"></UserRegister>
    <!-- 高危操作-删除用户 -->
    <UserDeleteWarning v-model="showDeleteWarning" :uid="deleteUser" @confirm="confirmDelete"></UserDeleteWarning>
  </div>
</template>

<script setup name="user">
import { ref, computed, onMounted } from 'vue'
import TableFilter from './components/TableFilter.vue'
import TableForm from './components/TableForm.vue'
import UserDeleteWarning from './components/UserDeleteWarning.vue'
import UserRegister from './components/UserRegister.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import DictTag from '@/components/DictType/DictTag.vue'
import { userList, userUpdate, userDelete, userUpdateSimple } from '@/api/user/user'
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { isTruthy, timeFormat } from '@/utils'
import { useDictStore } from '@/store/dict'

const dictStore = useDictStore()
dictStore.initDict(['dict_sys_user_status', 'dict_sys_user_gender']) // 初始化字典
const dictUserStatus = computed(() => dictStore.getDict('dict_sys_user_status'))
const dictUserGender = computed(() => dictStore.getDict('dict_sys_user_gender'))

const dataParams = ref({ pagenum: 1, pagesize: 20 })
const tableData = ref([])
const total = ref(0)
const loading = ref(true)
const showFilter = ref(true) // 头部筛选栏显示
const showForm = ref(false) // 表单弹窗
const showDeleteWarning = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式

onMounted(() => {
  handleTable(dataParams.value)
})

// 数据
async function handleTable(params) {
  loading.value = true
  const res = await userList(params)
  tableData.value = res.data || []
  total.value = res.total
  loading.value = false
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}

// 注册
const showUserRegister = ref(false)
function register() {
  showUserRegister.value = true
}

// 改
function edit(row) {
  formInit.value = row // 携带参数
  formMode.value = 'edit'
  showForm.value = true
}

// 高危操作 - 删除
const deleteUser = ref('') // 删除用户名
function del(row) {
  showDeleteWarning.value = true
  deleteUser.value = row.user_id
}
// 高危操作 - 确认删除
async function confirmDelete() {
  // 确认删除操作
  const deleteRes = await userDelete({ user_id: deleteUser.value })
  ElMessage({
    type: 'success',
    message: deleteRes?.msg
  })
  refresh()
}

// 刷新
function refresh() {
  // 置空数据
  tableData.value = []
  handleTable(dataParams.value)
}

// 提交表单
async function submitForm(e) {
  try {
    let result = {}
    switch (e.mode) {
      case 'edit':
        // 编辑更新
        result = await userUpdate(e.data)
        break
    }
    if (result.success) {
      showForm.value = false // 关闭弹窗
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
</script>

<style lang="scss" scoped>
.avatar-image {
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
</style>
