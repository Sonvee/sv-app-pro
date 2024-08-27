import request from '@/config/request/request.js'

export function subscriptionList(data) {
  return request({
    url: '/vip/subscriptionList',
    method: 'post',
    data
  })
}

export function subscriptionAdd(data) {
  return request({
    url: '/vip/subscriptionAdd',
    method: 'post',
    data
  })
}

export function subscriptionUpdate(data) {
  return request({
    url: '/vip/subscriptionUpdate',
    method: 'post',
    data
  })
}

export function subscriptionDelete(data) {
  return request({
    url: '/vip/subscriptionDelete',
    method: 'post',
    data
  })
}

export function subscriptionBatchDelete(data) {
  return request({
    url: '/vip/subscriptionBatchDelete',
    method: 'post',
    data
  })
}
