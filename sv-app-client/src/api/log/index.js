import http from '@/config/request'

export function logList(data) {
  return http.request({
    url: '/sys/logList',
    method: 'post',
    data
  })
}

export function logDelete(data) {
  return http.request({
    url: '/sys/logDelete',
    method: 'post',
    data
  })
}

export function logBatchDelete(data) {
  return http.request({
    url: '/sys/logBatchDelete',
    method: 'post',
    data
  })
}

export function logClear(data) {
  return http.request({
    url: '/sys/logClear',
    method: 'post',
    data
  })
}
