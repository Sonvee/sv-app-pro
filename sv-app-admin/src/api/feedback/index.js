import request from '@/config/request/request.js'

export function feedbackList(data) {
  return request({
    url: '/app/feedbackList',
    method: 'post',
    data
  })
}

export function feedbackAdd(data) {
  return request({
    url: '/app/feedbackAdd',
    method: 'post',
    data
  })
}

export function feedbackUpdate(data) {
  return request({
    url: '/app/feedbackUpdate',
    method: 'post',
    data
  })
}

export function feedbackDelete(data) {
  return request({
    url: '/app/feedbackDelete',
    method: 'post',
    data
  })
}

export function feedbackBatchAdd(data) {
  return request({
    url: '/app/feedbackBatchAdd',
    method: 'post',
    data
  })
}

export function feedbackBatchDelete(data) {
  return request({
    url: '/app/feedbackBatchDelete',
    method: 'post',
    data
  })
}