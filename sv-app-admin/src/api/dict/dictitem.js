import request from '@/config/request/request.js'

// 字典项

export function dictitemList(data) {
  return request({
    url: '/sys/dictitemList',
    method: 'post',
    data
  })
}

export function dictitemListByRedis(data) {
  return request({
    url: '/sys/dictitemListByRedis',
    method: 'post',
    data,
    cancel: false
  })
}

export function dictitemAdd(data) {
  return request({
    url: '/sys/dictitemAdd',
    method: 'post',
    data
  })
}

export function dictitemUpdate(data) {
  return request({
    url: '/sys/dictitemUpdate',
    method: 'post',
    data
  })
}

export function dictitemDelete(data) {
  return request({
    url: '/sys/dictitemDelete',
    method: 'post',
    data
  })
}

export function dictitemBatchAdd(data) {
  return request({
    url: '/sys/dictitemBatchAdd',
    method: 'post',
    data
  })
}

export function dictitemBatchDelete(data) {
  return request({
    url: '/sys/dictitemBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function dictitemImport(data) {
  return request({
    url: '/sys/dictitemImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function dictitemExport(data) {
  return request({
    url: '/sys/dictitemExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function dictitemExcelTemplate() {
  return request({
    url: '/sys/dictitemExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}
