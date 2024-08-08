import { defineStore } from 'pinia'
import { authMenuList } from '@/api/auth'
import { getFlatMenuList, getTreeMenuList, getAllBreadcrumbList } from '@/utils'
import { localFlatMenuList } from '@/router/modules/localRouter'

export const useAuthStore = defineStore({
  id: 'sv-auth',
  state: () => ({
    // 菜单权限列表
    authMenuList: []
  }),
  getters: {
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: (state) => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    treeMenuListGet: (state) => getTreeMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: (state) => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // 获取动态菜单列表（api获取菜单和本地菜单）
    async getAuthMenuList() {
      const menuRes = await authMenuList()
      const menuData = menuRes.data || []
      this.authMenuList = [...menuData, ...localFlatMenuList]
    }
  }
})
