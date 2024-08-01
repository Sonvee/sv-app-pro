import request from '@/config/request/request.js'
import menuData from '@/assets/json/menuList.json'

// 获取菜单列表
export function getAuthMenuList() {
  return request({
    url: '/sys/authMenuList',
    method: 'get',
    loading: false
  })
  // 如果想让菜单变为本地数据，注释上面代码，并引入本地 menuList.json 数据
  // return menuData
}

// 获取验证码
export function getCaptcha(data) {
  return request({
    url: '/auth/getCaptcha',
    method: 'post',
    loading: false,
    data
  })
}
