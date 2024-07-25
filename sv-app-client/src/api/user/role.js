import http from '@/config/request'

export function roleList(data) {
  return http.request({
    url: '/user/roleList',
    method: 'post',
    data
  })
}

export function findPermissionByRole(data) {
  return http.request({
    url: '/user/findPermissionByRole',
    method: 'post',
    data
  })
}

export function roleAdd(data) {
  return http.request({
    url: '/user/roleAdd',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return http.request({
    url: '/user/roleUpdate',
    method: 'post',
    data
  })
}

export function roleDelete(data) {
  return http.request({
    url: '/user/roleDelete',
    method: 'post',
    data
  })
}

export function roleBatchAdd(data) {
  return http.request({
    url: '/user/roleBatchAdd',
    method: 'post',
    data
  })
}

export function roleBatchDelete(data) {
  return http.request({
    url: '/user/roleBatchDelete',
    method: 'post',
    data
  })
}
