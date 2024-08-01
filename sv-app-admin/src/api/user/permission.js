import request from '@/config/request/request.js'

export function permissionList(data) {
  return request({
    url: '/user/permissionList',
    method: 'post',
    data
  })
}

export function permissionAdd(data) {
  return request({
    url: '/user/permissionAdd',
    method: 'post',
    data
  })
}

export function permissionUpdate(data) {
  return request({
    url: '/user/permissionUpdate',
    method: 'post',
    data
  })
}

export function permissionDelete(data) {
  return request({
    url: '/user/permissionDelete',
    method: 'post',
    data
  })
}

export function permissionBatchAdd(data) {
  return request({
    url: '/user/permissionBatchAdd',
    method: 'post',
    data
  })
}

export function permissionBatchDelete(data) {
  return request({
    url: '/user/permissionBatchDelete',
    method: 'post',
    data
  })
}
