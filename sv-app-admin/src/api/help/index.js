import request from '@/config/request/request.js'

export function helpList(data) {
  return request({
    url: '/app/helpList',
    method: 'post',
    data
  })
}

export function helpAdd(data) {
  return request({
    url: '/app/helpAdd',
    method: 'post',
    data
  })
}

export function helpUpdate(data) {
  return request({
    url: '/app/helpUpdate',
    method: 'post',
    data
  })
}

export function helpDelete(data) {
  return request({
    url: '/app/helpDelete',
    method: 'post',
    data
  })
}

export function helpBatchAdd(data) {
  return request({
    url: '/app/helpBatchAdd',
    method: 'post',
    data
  })
}

export function helpBatchDelete(data) {
  return request({
    url: '/app/helpBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function helpImport(data) {
  return request({
    url: '/app/helpImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function helpExport(data) {
  return request({
    url: '/app/helpExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function helpExcelTemplate() {
  return request({
    url: '/app/helpExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}