import http from '@/config/request'

export function feedbackList(data) {
  return http.request({
    url: '/app/feedbackList',
    method: 'post',
    data
  })
}

export function feedbackAdd(data) {
  return http.request({
    url: '/app/feedbackAdd',
    method: 'post',
    data
  })
}

export function feedbackUpdate(data) {
  return http.request({
    url: '/app/feedbackUpdate',
    method: 'post',
    data
  })
}

export function feedbackDelete(data) {
  return http.request({
    url: '/app/feedbackDelete',
    method: 'post',
    data
  })
}

export function feedbackBatchAdd(data) {
  return http.request({
    url: '/app/feedbackBatchAdd',
    method: 'post',
    data
  })
}
export function feedbackBatchDelete(data) {
  return http.request({
    url: '/app/feedbackBatchDelete',
    method: 'post',
    data
  })
}