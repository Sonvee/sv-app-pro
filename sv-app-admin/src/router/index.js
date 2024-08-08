import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'
import { LOGIN_URL } from '@/config'
import { initDynamicRouter } from './modules/dynamicRouter'
import { staticRouter, errorRouter } from './modules/staticRouter'
import NProgress from '@/config/nprogress'

/**
 * @description 📚 路由参数配置简介
 * @param {String} path ==> 路由菜单访问路径
 * @param {String} name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param {String} redirect ==> 路由重定向地址
 * @param {String} component ==> 视图文件路径
 * @param {String} permissions ==> 权限
 * @param {Object} meta ==> 路由菜单元信息
 * @property {String} meta.icon ==> 菜单和面包屑对应的图标
 * @property {String} meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @property {String} meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @property {Boolean} meta.isLink ==> 路由外链时填写的访问地址
 * @property {Boolean} meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @property {Boolean} meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @property {Boolean} meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @property {Boolean} meta.isKeepAlive ==> 当前路由是否缓存
 * @property {Boolean} meta.isSub ==> 是否是子菜单详情页面
 * @property {Boolean} meta.isOpen ==> 是否需要登录（开放页面为true，无需token）
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRouter, ...errorRouter] // 此处直接装载静态路由，动态路由由initDynamicRouter中addRoute装载
})

// 静态路由白名单
const WHITE_ROUTE_LIST = [...staticRouter, ...errorRouter].map((item) => item.path)

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // 1.NProgress 开始
  NProgress.start()

  // 2.动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath)
    resetRouter()
    return next()
  }

  // 4.判断访问页面是否为静态路由，如果是则直接放行
  if (WHITE_ROUTE_LIST.includes(to.path)) return next()

  if (authStore.authMenuList.length) {
    // 5.判断当前页面是否需要登录
    const findroute = authStore.authMenuList?.find((item) => item.path === to.path)
    if (findroute?.meta?.isOpen) {
      // 页面无需登录，直接放行
      return next()
    } else {
      // 判断是否有token，没有则重定向到 login 页面
      if (!userStore.token) return next({ path: LOGIN_URL, replace: true })
    }
  } else {
    // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
    try {
      await initDynamicRouter()
      return next({ ...to, replace: true })
    } catch (error) {
      // 捕获异常并跳转403页面
      return next({ path: '/403' })
    }
  }

  // 7.正常访问页面
  next()
})

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthStore()
  authStore.authMenuList.forEach((route) => {
    const { name } = route
    if (name && router.hasRoute(name)) router.removeRoute(name)
  })
}

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done()
  console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done()
})

export default router
