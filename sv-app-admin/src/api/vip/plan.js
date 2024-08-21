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