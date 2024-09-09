import request from '@/config/request/request.js'

export function permissionList(data) {
  return request({
    url: '/user/permissionList',
    method: 'post',
    data
  })
}

export function permissionAdd(data) {
  return request({
    url: '/user/permissionAdd',
    method: 'post',
    data
  })
}

export function permissionUpdate(data) {
  return request({
    url: '/user/permissionUpdate',
    method: 'post',
    data
  })
}

export function permissionDelete(data) {
  return request({
    url: '/user/permissionDelete',
    method: 'post',
    data
  })
}

export function permissionBatchAdd(data) {
  return request({
    url: '/user/permissionBatchAdd',
    method: 'post',
    data
  })
}

export function permissionBatchDelete(data) {
  return request({
    url: '/user/permissionBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function permissionImport(data) {
  return request({
    url: '/user/permissionImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function permissionExport(data) {
  return request({
    url: '/user/permissionExport',
    method: 'post',
    data
  })
}

export function permissionExcelTemplate() {
  return request({
    url: '/user/permissionExcelTemplate',
    method: 'get',
    responseType: 'arraybuffer' // 指定响应类型为二进制数据
  })
}
