import request from '../config/request'

export function roleList(data) {
  return request({
    url: '/user/roleList',
    method: 'post',
    data
  })
}

export function findPermissionByRole(data) {
  return request({
    url: '/user/findPermissionByRole',
    method: 'post',
    data
  })
}

export function roleAdd(data) {
  return request({
    url: '/user/roleAdd',
    method: 'post',
    data
  })
}

export function roleUpdate(data) {
  return request({
    url: '/user/roleUpdate',
    method: 'post',
    data
  })
}

export function roleDelete(data) {
  return request({
    url: '/user/roleDelete',
    method: 'post',
    data
  })
}

export function roleBatchAdd(data) {
  return request({
    url: '/user/roleBatchAdd',
    method: 'post',
    data
  })
}

export function roleBatchDelete(data) {
  return request({
    url: '/user/roleBatchDelete',
    method: 'post',
    data
  })
}
