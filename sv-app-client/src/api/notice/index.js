import http from '@/config/request'

// 字典
export function noticeList(data) {
  return http.request({
    url: '/sys/noticeList',
    method: 'post',
    data
  })
}

export function noticeAdd(data) {
  return http.request({
    url: '/sys/noticeAdd',
    method: 'post',
    data
  })
}

export function noticeUpdate(data) {
  return http.request({
    url: '/sys/noticeUpdate',
    method: 'post',
    data
  })
}

export function noticeDelete(data) {
  return http.request({
    url: '/sys/noticeDelete',
    method: 'post',
    data
  })
}

export function noticeBatchAdd(data) {
  return http.request({
    url: '/sys/noticeBatchAdd',
    method: 'post',
    data
  })
}

export function noticeBatchDelete(data) {
  return http.request({
    url: '/sys/noticeBatchDelete',
    method: 'post',
    data
  })
}
