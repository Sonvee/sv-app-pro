<template>
  <el-dropdown trigger="click">
    <div class="flex-vc">
      <span class="username-text">{{ userInfo.username }}</span>
      <div class="avatar">
        <el-avatar :src="userInfo?.avatar?.url" :icon="UserFilled" :size="40" shape="circle" fit="cover" />
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="skipMine">
          <el-icon><User /></el-icon>个人主页
        </el-dropdown-item>
        <el-dropdown-item divided @click="toLogout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LOGIN_URL } from '@/config'
import { useRouter } from 'vue-router'
import { logout } from '@/api/user/login'
import { useUserStore } from '@/store/user'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 退出登录
function toLogout() {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    // 1.执行退出登录接口
    await logout({ _id: userInfo.value._id })

    // 2.清除 Token 和 用户信息 等
    userStore.clearUserInfo()

    // 3.重定向到登陆页
    router.replace(LOGIN_URL)
    ElMessage.success('退出登录成功！')
  })
}

// 跳转至个人空间
function skipMine() {
  router.push('/mine')
}
</script>

<style scoped lang="scss">
.username-text {
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
