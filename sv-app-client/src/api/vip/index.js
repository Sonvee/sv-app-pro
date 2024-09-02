import http from '@/config/request'

export function planList(data) {
  return http.request({
    url: '/vip/planList',
    method: 'post',
    data
  })
}

export function benefitList(data) {
  return http.request({
    url: '/vip/benefitList',
    method: 'post',
    data
  })
}

export function cdkeyActive(data) {
  return http.request({
    url: '/vip/cdkeyActive',
    method: 'post',
    data
  })
}