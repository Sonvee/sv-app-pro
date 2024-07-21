import request from '../config/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

export function hasAdmin() {
  return request({
    url: '/user/hasAdmin',
    method: 'get'
  })
}

export function refreshToken(data) {
  return request({
    url: '/user/refreshToken',
    method: 'post',
    data
  })
}

export function verifyToken() {
  return request({
    url: '/user/verifyToken',
    method: 'get'
  })
}