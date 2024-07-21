/**
 * v-permission
 * 按钮权限指令
 */
import { useUserStore } from '@/store/user'

const auth = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()

    // 判断userStore.permission是否包含value
    if (Array.isArray(value)) {
      const hasPermission = value.every((item) => userStore.permission.includes(item))
      if (!hasPermission) el.remove()
    } else {
      if (!userStore.permission.includes(value)) el.remove()
    }
  }
}

export default auth
