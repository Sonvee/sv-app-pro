import request from '@/config/request/request.js'

export function benefitList(data) {
  return request({
    url: '/vip/benefitList',
    method: 'post',
    data
  })
}

export function benefitAdd(data) {
  return request({
    url: '/vip/benefitAdd',
    method: 'post',
    data
  })
}

export function benefitUpdate(data) {
  return request({
    url: '/vip/benefitUpdate',
    method: 'post',
    data
  })
}

export function benefitDelete(data) {
  return request({
    url: '/vip/benefitDelete',
    method: 'post',
    data
  })
}

export function benefitBatchAdd(data) {
  return request({
    url: '/vip/benefitBatchAdd',
    method: 'post',
    data
  })
}

export function benefitBatchDelete(data) {
  return request({
    url: '/vip/benefitBatchDelete',
    method: 'post',
    data
  })
}

// 导入 导出 模版
export function benefitImport(data) {
  return request({
    url: '/vip/benefitImport',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function benefitExport(data) {
  return request({
    url: '/vip/benefitExport',
    method: 'post',
    data,
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}

export function benefitExcelTemplate() {
  return request({
    url: '/vip/benefitExcelTemplate',
    method: 'get',
    responseType: 'blob' // 指定响应类型为二进制数据
  })
}