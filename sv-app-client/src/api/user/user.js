import http from '@/config/request'

export function userList(data) {
  return http.request({
    url: '/user/userList',
    method: 'post',
    data
  })
}

export function userSelf(params) {
  return http.request({
    url: '/user/userSelf',
    method: 'get',
		params
  })
}

export function userUpdate(data) {
  return http.request({
    url: '/user/userUpdate',
    method: 'post',
    data
  })
}

export function userUpdateSimple(data) {
  return http.request({
    url: '/user/userUpdateSimple',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return http.request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}

export function changePasswordByEmail(data) {
  return http.request({
    url: '/user/changePasswordByEmail',
    method: 'post',
    data
  })
}

export function changePasswordByPhone(data) {
  return http.request({
    url: '/user/changePasswordByPhone',
    method: 'post',
    data
  })
}

export function bindEmail(data) {
  return http.request({
    url: '/user/bindEmail',
    method: 'post',
    data
  })
}

export function bindEmailByPhone(data) {
  return http.request({
    url: '/user/bindEmailByPhone',
    method: 'post',
    data
  })
}

export function bindWechat(data) {
  return http.request({
    url: '/user/bindWechat',
    method: 'post',
    data
  })
}

export function userDeactivate(data) {
  return http.request({
    url: '/user/userDeactivate',
    method: 'post',
    data
  })
}

export function userDelete(data) {
  return http.request({
    url: '/user/userDelete',
    method: 'post',
    data
  })
}