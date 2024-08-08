import router from '@/router/index'
import { LOGIN_URL } from '@/config'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * @description 初始化动态路由
 */
export async function initDynamicRouter() {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  try {
    // 1.获取菜单列表
    await authStore.getAuthMenuList()

    // 2.判断当前用户有没有动态菜单权限
    if (!authStore.authMenuList.length) {
      ElNotification({
        title: '系统警告',
        message: '当前账号无任何菜单权限！',
        type: 'warning',
        duration: 3000
      })
      // userStore.setToken("");
      // router.replace(LOGIN_URL);
      return Promise.reject('Forbidden')
    }

    // 3.添加动态路由
    authStore.authMenuList.forEach((item) => {
      item.children && delete item.children
      if (item.component && typeof item.component == 'string') {
        item.component = modules['/src/views' + item.component + '.vue']
      }
      if (item.meta.isFull) {
        router.addRoute(item)
      } else {
        router.addRoute('layout', item)
      }
    })
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    // userStore.setToken("");
    // router.replace(LOGIN_URL);
    return Promise.reject(error)
  }
}
