<template>
  <el-dropdown trigger="click">
    <div class="flex-vc">
      <span class="username">{{ username }}</span>
      <div class="avatar">
        <img src="@/assets/images/avatar.gif" alt="avatar" />
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click="toLogout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LOGIN_URL } from '@/config'
import { useRouter } from 'vue-router'
import { logout } from '@/api/user/login'
import { useUserStore } from '@/store/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import InfoDialog from './InfoDialog.vue'
import PasswordDialog from './PasswordDialog.vue'

const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore.userInfo.username)

// 退出登录
function toLogout() {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 1.执行退出登录接口
    await logout({ username: username.value })

    // 2.清除 Token 和 用户信息 等
    userStore.clearUserInfo()

    // 3.重定向到登陆页
    router.replace(LOGIN_URL)
    ElMessage.success('退出登录成功！')
  })
}

// 打开修改密码和个人信息弹窗
const infoRef = ref(null)
const passwordRef = ref(null)
const openDialog = (refname) => {
  if (refname == 'infoRef') infoRef.value?.openDialog()
  if (refname == 'passwordRef') passwordRef.value?.openDialog()
}
</script>

<style scoped lang="scss">
.username {
  margin: 0 10px 0 20px;
  font-size: 15px;
  color: var(--el-header-text-color);
}
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
