import request from '@/config/request/request.js'

// 版本发布
export function releaseList(data) {
  return request({
    url: '/app/releaseList',
    method: 'post',
    data
  })
}

export function releaseLatest(data) {
  return request({
    url: '/app/releaseLatest',
    method: 'post',
    data
  })
}

export function releaseAdd(data) {
  return request({
    url: '/app/releaseAdd',
    method: 'post',
    data
  })
}

export function releaseUpdate(data) {
  return request({
    url: '/app/releaseUpdate',
    method: 'post',
    data
  })
}

export function releaseDelete(data) {
  return request({
    url: '/app/releaseDelete',
    method: 'post',
    data
  })
}
