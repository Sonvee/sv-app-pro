'use strict'

module.exports = (app) => {
  const mongoose = app.mongoose

  const SysMenuSchema = new mongoose.Schema(
    {
      // 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
      name: {
        type: String,
        unique: true,
        required: true
      },
      // 路由访问路径
      path: {
        type: String,
        required: true
      },
      // 视图文件路径
      component: {
        type: String
      },
      // 父级路由 name
      parent_name: {
        type: String
      },
      // 排序
      sort: {
        type: Number,
        default: 0
      },
      // 路由重定向地址
      redirect: {
        type: String
      },
      // 权限
      permissions: {
        type: Array,
        default: []
      },
      // 路由元信息
      meta: {
        // 菜单和面包屑对应的图标
        icon: {
          type: String,
          default: ''
        },
        // 路由标题 (用作 document.title || 菜单的名称)
        title: {
          type: String,
          default: ''
        },
        // 路由外链时填写的访问地址
        isLink: {
          type: String,
          default: ''
        },
        // 是否在菜单中隐藏, 需要高亮的 path (通常用作详情页高亮父级菜单)
        activeMenu: {
          type: String,
          default: ''
        },
        // 是否在菜单中隐藏 (通常列表详情页需要隐藏)
        isHide: {
          type: Boolean,
          default: false
        },
        // 是否是子菜单详情页面
        isSub: {
          type: Boolean,
          default: false
        },
        // 菜单是否全屏
        isFull: {
          type: Boolean,
          default: false
        },
        // 菜单是否固定在标签页中 (首页通常是固定项)
        isAffix: {
          type: Boolean,
          default: false
        },
        // 当前路由是否缓存
        isKeepAlive: {
          type: Boolean,
          default: false
        }
      },
      // 自动生成字段
      created_date: {
        type: Number
      },
      updated_date: {
        type: Number
      }
    },
    {
      versionKey: false, // 去除版本号字段
      timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
    }
  )

  return mongoose.model('sys_menu', SysMenuSchema)
}
