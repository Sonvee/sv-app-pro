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