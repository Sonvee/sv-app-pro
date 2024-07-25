import http from '@/config/request'

// 字典
export function dictList(data) {
  return http.request({
    url: '/sys/dictList',
    method: 'post',
    data
  })
}

export function dictAdd(data) {
  return http.request({
    url: '/sys/dictAdd',
    method: 'post',
    data
  })
}

export function dictUpdate(data) {
  return http.request({
    url: '/sys/dictUpdate',
    method: 'post',
    data
  })
}

export function dictDelete(data) {
  return http.request({
    url: '/sys/dictDelete',
    method: 'post',
    data
  })
}

export function dictBatchAdd(data) {
  return http.request({
    url: '/sys/dictBatchAdd',
    method: 'post',
    data
  })
}

export function dictBatchDelete(data) {
  return http.request({
    url: '/sys/dictBatchDelete',
    method: 'post',
    data
  })
}

// 字典项

export function dictitemList(data) {
  return http.request({
    url: '/sys/dictitemList',
    method: 'post',
    data
  })
}

export function dictitemListByRedis(data) {
  return http.request({
    url: '/sys/dictitemListByRedis',
    method: 'post',
    data
  })
}

export function dictitemAdd(data) {
  return http.request({
    url: '/sys/dictitemAdd',
    method: 'post',
    data
  })
}

export function dictitemUpdate(data) {
  return http.request({
    url: '/sys/dictitemUpdate',
    method: 'post',
    data
  })
}

export function dictitemDelete(data) {
  return http.request({
    url: '/sys/dictitemDelete',
    method: 'post',
    data
  })
}

export function dictitemBatchAdd(data) {
  return http.request({
    url: '/sys/dictitemBatchAdd',
    method: 'post',
    data
  })
}

export function dictitemBatchDelete(data) {
  return http.request({
    url: '/sys/dictitemBatchDelete',
    method: 'post',
    data
  })
}
