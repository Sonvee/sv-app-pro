import request from '@/config/request/request.js'

// 字典
export function dictList(data) {
  return request({
    url: '/sys/dictList',
    method: 'post',
    data
  })
}

export function dictAdd(data) {
  return request({
    url: '/sys/dictAdd',
    method: 'post',
    data
  })
}

export function dictUpdate(data) {
  return request({
    url: '/sys/dictUpdate',
    method: 'post',
    data
  })
}

export function dictDelete(data) {
  return request({
    url: '/sys/dictDelete',
    method: 'post',
    data
  })
}

export function dictBatchAdd(data) {
  return request({
    url: '/sys/dictBatchAdd',
    method: 'post',
    data
  })
}

export function dictBatchDelete(data) {
  return request({
    url: '/sys/dictBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function dictImport(data) {
  return request({
    url: '/sys/dictImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function dictExport(data) {
  return request({
    url: '/sys/dictExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function dictExcelTemplate() {
  return request({
    url: '/sys/dictExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}
