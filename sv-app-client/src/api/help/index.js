import http from '@/config/request'

export function helpList(data) {
  return http.request({
    url: '/app/helpList',
    method: 'post',
    data
  })
}
