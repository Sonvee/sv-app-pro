import http from '@/config/request'

export function noticeList(data) {
  return http.request({
    url: '/app/noticeList',
    method: 'post',
    data
  })
}

export function noticeInTime(data) {
  return http.request({
    url: '/app/noticeInTime',
    method: 'post',
    data
  })
}