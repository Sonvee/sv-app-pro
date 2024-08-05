import request from '@/config/request/request.js'

export function cacheKeyList(data) {
  return request({
    url: '/cache/cacheKeyList',
    method: 'post',
    data
  })
}

export function cacheValueByKey(data) {
  return request({
    url: '/cache/cacheValueByKey',
    method: 'post',
    data
  })
}

export function cacheDelete(data) {
  return request({
    url: '/cache/cacheDelete',
    method: 'post',
    data
  })
}

export function cacheBatchDelete(data) {
  return request({
    url: '/cache/cacheBatchDelete',
    method: 'post',
    data
  })
}
