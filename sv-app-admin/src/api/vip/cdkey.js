import request from '@/config/request/request.js'

export function cdkeyList(data) {
  return request({
    url: '/vip/cdkeyList',
    method: 'post',
    data
  })
}

export function cdkeyAdd(data) {
  return request({
    url: '/vip/cdkeyAdd',
    method: 'post',
    data
  })
}

export function cdkeyUpdate(data) {
  return request({
    url: '/vip/cdkeyUpdate',
    method: 'post',
    data
  })
}

export function cdkeyDelete(data) {
  return request({
    url: '/vip/cdkeyDelete',
    method: 'post',
    data
  })
}

export function cdkeyClear(data) {
  return request({
    url: '/vip/cdkeyClear',
    method: 'post',
    data
  })
}

export function cdkeyBatchAdd(data) {
  return request({
    url: '/vip/cdkeyBatchAdd',
    method: 'post',
    data
  })
}

export function cdkeyBatchDelete(data) {
  return request({
    url: '/vip/cdkeyBatchDelete',
    method: 'post',
    data
  })
}
