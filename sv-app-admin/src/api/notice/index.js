import request from '@/config/request/request.js'

// 字典
export function noticeList(data) {
  return request({
    url: '/app/noticeList',
    method: 'post',
    data
  })
}

export function noticeAdd(data) {
  return request({
    url: '/app/noticeAdd',
    method: 'post',
    data
  })
}

export function noticeUpdate(data) {
  return request({
    url: '/app/noticeUpdate',
    method: 'post',
    data
  })
}

export function noticeDelete(data) {
  return request({
    url: '/app/noticeDelete',
    method: 'post',
    data
  })
}

export function noticeBatchAdd(data) {
  return request({
    url: '/app/noticeBatchAdd',
    method: 'post',
    data
  })
}

export function noticeBatchDelete(data) {
  return request({
    url: '/app/noticeBatchDelete',
    method: 'post',
    data
  })
}
