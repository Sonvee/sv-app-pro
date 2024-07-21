import request from '../config/request'

export function userList(data) {
  return request({
    url: '/user/userList',
    method: 'post',
    data
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

export function changeStatus(data) {
  return request({
    url: '/user/changeStatus',
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