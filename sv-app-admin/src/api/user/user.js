import request from '@/config/request/request.js'

export function userList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
  })
}

export function userSelf(params) {
  return request({
    url: '/user/userSelf',
    method: 'get',
    params
  })
}

export function userUpdate(data) {
  return request({
    url: '/user/userUpdate',
    method: 'post',
    data
  })
}

export function userUpdateSimple(data) {
  return request({
    url: '/user/userUpdateSimple',
    method: 'post',
    data
  })
}

export function userDeactivate(data) {
  return request({
    url: '/user/userDeactivate',
    method: 'post',
    data
  })
}

export function userDelete(data) {
  return request({
    url: '/user/userDelete',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}

export function verifyVip(data) {
  return request({
    url: '/user/verifyVip',
    method: 'post',
    data
  })
}
