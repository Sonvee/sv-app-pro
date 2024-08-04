import request from '@/config/request/request.js'

// 版本发布
export function releaseList(data) {
  return request({
    url: '/app/releaseList',
    method: 'post',
    data
  })
}

export function releaseLatest() {
  return request({
    url: '/app/releaseLatest',
    method: 'get'
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

export function releaseBatchAdd(data) {
  return request({
    url: '/app/releaseBatchAdd',
    method: 'post',
    data
  })
}

export function releaseBatchDelete(data) {
  return request({
    url: '/app/releaseBatchDelete',
    method: 'post',
    data
  })
}
