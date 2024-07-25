import http from '@/config/request'

export function menuList(data) {
  return http.request({
    url: '/sys/menuList',
    method: 'post',
    data
  })
}

export function menuAdd(data) {
  return http.request({
    url: '/sys/menuAdd',
    method: 'post',
    data
  })
}

export function menuUpdate(data) {
  return http.request({
    url: '/sys/menuUpdate',
    method: 'post',
    data
  })
}

export function menuDelete(data) {
  return http.request({
    url: '/sys/menuDelete',
    method: 'post',
    data
  })
}

export function menuBatchAdd(data) {
  return http.request({
    url: '/sys/menuBatchAdd',
    method: 'post',
    data
  })
}

export function menuBatchDelete(data) {
  return http.request({
    url: '/sys/menuBatchDelete',
    method: 'post',
    data
  })
}
