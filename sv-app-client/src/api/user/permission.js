import http from '@/config/request'

export function permissionList(data) {
  return http.request({
    url: '/user/permissionList',
    method: 'post',
    data
  })
}

export function permissionAdd(data) {
  return http.request({
    url: '/user/permissionAdd',
    method: 'post',
    data
  })
}

export function permissionUpdate(data) {
  return http.request({
    url: '/user/permissionUpdate',
    method: 'post',
    data
  })
}

export function permissionDelete(data) {
  return http.request({
    url: '/user/permissionDelete',
    method: 'post',
    data
  })
}

export function permissionBatchAdd(data) {
  return http.request({
    url: '/user/permissionBatchAdd',
    method: 'post',
    data
  })
}

export function permissionBatchDelete(data) {
  return http.request({
    url: '/user/permissionBatchDelete',
    method: 'post',
    data
  })
}
