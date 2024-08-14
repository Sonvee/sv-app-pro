import http from '@/config/request'

// 最新版本信息
export function releaseLatest(data) {
  return http.request({
    url: '/app/releaseLatest',
    method: 'post',
    data
  })
}