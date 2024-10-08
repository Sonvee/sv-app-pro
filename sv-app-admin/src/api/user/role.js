import request from '@/config/request/request.js'

export function roleList(data) {
  return request({
    url: '/user/roleList',
    method: 'post',
    data
  })
}

export function findPermissionByRole(data) {
  return request({
    url: '/user/findPermissionByRole',
    method: 'post',
    data
  })
}

export function roleAdd(data) {
  return request({
    url: '/user/roleAdd',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/user/roleUpdate',
    method: 'post',
    data
  })
}

export function roleDelete(data) {
  return request({
    url: '/user/roleDelete',
    method: 'post',
    data
  })
}

export function roleBatchAdd(data) {
  return request({
    url: '/user/roleBatchAdd',
    method: 'post',
    data
  })
}

export function roleBatchDelete(data) {
  return request({
    url: '/user/roleBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function roleImport(data) {
  return request({
    url: '/user/roleImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function roleExport(data) {
  return request({
    url: '/user/roleExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function roleExcelTemplate() {
  return request({
    url: '/user/roleExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}
