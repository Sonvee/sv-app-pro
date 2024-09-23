import request from '@/config/request/request.js'

export function baiduTokenCode(params) {
  return request({
    url: '/analytics/baiduTokenCode',
    method: 'get',
    params
  })
}

export function baiduTokenByCode(params) {
  return request({
    url: '/analytics/baiduTokenByCode',
    method: 'get',
    params
  })
}

export function refreshBaiduToken(params) {
  return request({
    url: '/analytics/refreshBaiduToken',
    method: 'get',
    params
  })
}

export function siteList(data) {
  return request({
    url: '/analytics/siteList',
    method: 'post',
    data
  })
}

export function outline(data) {
  return request({
    url: '/analytics/outline',
    method: 'post',
    data
  })
}

export function timeTrendRpt(data) {
  return request({
    url: '/analytics/timeTrendRpt',
    method: 'post',
    data
  })
}

export function districtRpt(data) {
  return request({
    url: '/analytics/districtRpt',
    method: 'post',
    data
  })
}

export function commonTrackRpt(data) {
  return request({
    url: '/analytics/commonTrackRpt',
    method: 'post',
    data
  })
}

export function overviewAge(data) {
  return request({
    url: '/analytics/overviewAge',
    method: 'post',
    data
  })
}

export function trendTime(data) {
  return request({
    url: '/analytics/trendTime',
    method: 'post',
    data
  })
}

export function visitorType(data) {
  return request({
    url: '/analytics/visitorType',
    method: 'post',
    data
  })
}

export function trendLatest(data) {
  return request({
    url: '/analytics/trendLatest',
    method: 'post',
    data
  })
}

export function sourceSite(data) {
  return request({
    url: '/analytics/sourceSite',
    method: 'post',
    data
  })
}

export function sourceAll(data) {
  return request({
    url: '/analytics/sourceAll',
    method: 'post',
    data
  })
}

export function sourceEngine(data) {
  return request({
    url: '/analytics/sourceEngine',
    method: 'post',
    data
  })
}

export function sourceSearchword(data) {
  return request({
    url: '/analytics/sourceSearchword',
    method: 'post',
    data
  })
}

export function sourceLink(data) {
  return request({
    url: '/analytics/sourceLink',
    method: 'post',
    data
  })
}

export function visitPage(data) {
  return request({
    url: '/analytics/visitPage',
    method: 'post',
    data
  })
}

export function visitToppage(data) {
  return request({
    url: '/analytics/visitToppage',
    method: 'post',
    data
  })
}

export function landingPage(data) {
  return request({
    url: '/analytics/landingPage',
    method: 'post',
    data
  })
}

export function visitLandingpage(data) {
  return request({
    url: '/analytics/visitLandingpage',
    method: 'post',
    data
  })
}

export function visitTopdomain(data) {
  return request({
    url: '/analytics/visitTopdomain',
    method: 'post',
    data
  })
}

export function visitDistrict(data) {
  return request({
    url: '/analytics/visitDistrict',
    method: 'post',
    data
  })
}

export function visitWorld(data) {
  return request({
    url: '/analytics/visitWorld',
    method: 'post',
    data
  })
}
