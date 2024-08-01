import request from '@/config/request/request.js'

// 字典
export function noticeList(data) {
  return request({
    url: '/sys/noticeList',
    method: 'post',
    data
  })
}

export function noticeAdd(data) {
  return request({
    url: '/sys/noticeAdd',
    method: 'post',
    data
  })
}

export function noticeUpdate(data) {
  return request({
    url: '/sys/noticeUpdate',
    method: 'post',
    data
  })
}

export function noticeDelete(data) {
  return request({
    url: '/sys/noticeDelete',
    method: 'post',
    data
  })
}

export function noticeBatchAdd(data) {
  return request({
    url: '/sys/noticeBatchAdd',
    method: 'post',
    data
  })
}

export function noticeBatchDelete(data) {
  return request({
    url: '/sys/noticeBatchDelete',
    method: 'post',
    data
  })
}
