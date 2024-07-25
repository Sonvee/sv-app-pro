import http from '@/config/request'

export function userList(data) {
  return http.request({
    url: '/user/userList',
    method: 'post',
    data
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

export function changeStatus(data) {
  return http.request({
    url: '/user/changeStatus',
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