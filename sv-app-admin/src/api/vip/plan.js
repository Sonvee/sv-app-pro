import request from '@/config/request/request.js'

export function planList(data) {
  return request({
    url: '/vip/planList',
    method: 'post',
    data
  })
}

export function planAdd(data) {
  return request({
    url: '/vip/planAdd',
    method: 'post',
    data
  })
}

export function planUpdate(data) {
  return request({
    url: '/vip/planUpdate',
    method: 'post',
    data
  })
}

export function planDelete(data) {
  return request({
    url: '/vip/planDelete',
    method: 'post',
    data
  })
}

export function planBatchAdd(data) {
  return request({
    url: '/vip/planBatchAdd',
    method: 'post',
    data
  })
}

export function planBatchDelete(data) {
  return request({
    url: '/vip/planBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function planImport(data) {
  return request({
    url: '/vip/planImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function planExport(data) {
  return request({
    url: '/vip/planExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function planExcelTemplate() {
  return request({
    url: '/vip/planExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}