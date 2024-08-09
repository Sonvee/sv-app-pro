/**
 * 本地路由
 * @description 本地路由为动态路由中的分支，由本地配置，但是由dynamicRouter动态路由装载至router中
 */

/**
 * 本地路由菜单（扁平）
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
 * @property {Boolean} meta.isLocal ==> 本地路由标识
 */
export const localFlatMenuList = [
  {
    name: 'publish',
    path: '/portal/publish',
    component: '/portal/publish/index',
    parent_name: 'portal',
    sort: 410,
    redirect: '',
    permissions: [],
    meta: {
      isOpen: true,
      icon: 'admin-icons-error-app',
      title: '统一发布页',
      isLink: '',
      activeMenu: '',
      isHide: false,
      isSub: false,
      isFull: true,
      isAffix: false,
      isKeepAlive: true,
      isLocal: true // 本地路由标识
    }
  }
]
