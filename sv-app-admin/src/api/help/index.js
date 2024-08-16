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