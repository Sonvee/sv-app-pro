import http from '@/config/request'

export function login(data) {
  return http.request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function loginByEmailer(data) {
  return http.request({
    url: '/user/loginByEmailer',
    method: 'post',
    data
  })
}

export function loginByWechat(data) {
  return http.request({
    url: '/user/loginByWechat',
    method: 'post',
    data
  })
}

export function register(data) {
  return http.request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function logout(data) {
  return http.request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

export function hasAdmin() {
  return http.request({
    url: '/user/hasAdmin',
    method: 'get'
  })
}

export function refreshToken(data) {
  return http.request({
    url: '/user/refreshToken',
    method: 'post',
    data
  })
}

export function verifyToken() {
  return http.request({
    url: '/user/verifyToken',
    method: 'get'
  })
}