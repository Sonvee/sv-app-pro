<template>
  <div class="page-container">
    <!-- 栅格布局 -->
    <el-row :gutter="10">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="flx-justify-between">
              <span>个人资料</span>
              <el-button plain :icon="Edit" circle @click="editInfo" />
            </div>
          </template>
          <div class="flex-vc">
            <el-avatar :size="avatarSize" shape="square" :src="userInfo?.avatar?.url" :icon="UserFilled" />

            <div class="ml-20 flex-grow-1">
              <el-descriptions border :column="2">
                <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
                <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
                <el-descriptions-item label="手机">{{ userInfo.phone }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
                <el-descriptions-item label="角色">
                  <el-tag v-for="role in userInfo.role" :key="role" class="mr-4">{{ role }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="标签">
                  <el-tag v-for="tags in userInfo.tags" :key="tags" class="mr-4">{{ tags }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header> 消息通知 </template>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <TableForm v-model="showForm" :form-init="formInit" @submit="submitForm"></TableForm>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TableForm from './components/TableForm.vue'
import { userSelf, userUpdate, userUpdateSimple } from '@/api/user/user'
import { UserFilled, Edit } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { ElNotification } from 'element-plus'
import { useGlobalStore } from '@/store/global'
import { multipleJudgment } from '@/utils'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const avatarSize = computed(() => {
  return multipleJudgment(useGlobalStore().assemblySize, ['small', 'default', 'large'], [100, 124, 156])
})

onMounted(() => {
  getMySelf()
})

async function getMySelf() {
  const selfRes = await userSelf()
  if (selfRes.success) {
    // 缓存用户信息
    userStore.setUserInfo(selfRes.data)
  }
}

const showForm = ref(false) // 表单弹窗
const formInit = ref({}) // 表单初始值
function editInfo() {
  formInit.value = userInfo.value // 携带参数
  showForm.value = true
}

// 提交表单
async function submitForm(e) {
  // 编辑更新
  const result = await userUpdateSimple(e.data)
  if (result.success) {
    showForm.value = false // 关闭弹窗
    ElNotification({
      title: 'Success',
      message: result?.msg,
      type: 'success'
    })
    getMySelf()
  }
}
</script>

<style lang="scss" scoped></style>
