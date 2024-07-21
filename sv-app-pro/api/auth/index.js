import request from '@/config/request'

// 获取验证码
export function getCaptcha(data) {
  return request({
    url: '/auth/getCaptcha',
    method: 'post',
    loading: false,
    data
  })
}

// 获取验证码
export function emailCaptcha(data) {
  return request({
    url: '/auth/emailCaptcha',
    method: 'post',
    loading: false,
    data
  })
}
