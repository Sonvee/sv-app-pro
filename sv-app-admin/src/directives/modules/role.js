/**
 * v-role
 * 按钮权限指令
 */
import { useUserStore } from '@/store/user'

const auth = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    // admin角色拥有所有权限
    if (userStore.userInfo.role?.includes('admin')) return
    // 判断userStore.role是否包含value
    if (Array.isArray(value)) {
      const hasRole = value.every((item) => userStore.userInfo?.role.includes(item))
      if (!hasRole) el.remove()
    } else {
      if (!userStore.userInfo?.role.includes(value)) el.remove()
    }
  }
}

export default auth
