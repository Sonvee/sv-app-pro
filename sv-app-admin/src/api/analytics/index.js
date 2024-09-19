import request from '@/config/request/request.js'

export function getBaiduTokenCode(params) {
  return request({
    url: '/analytics/getBaiduTokenCode',
    method: 'get',
    params
  })
}

export function getBaiduTokenByCode(params) {
  return request({
    url: '/analytics/getBaiduTokenByCode',
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

export function getSiteList(params) {
  return request({
    url: '/analytics/getSiteList',
    method: 'get',
    params
  })
}

export function getOutline(params) {
  return request({
    url: '/analytics/getOutline',
    method: 'get',
    params
  })
}

export function getTimeTrendRpt(params) {
  return request({
    url: '/analytics/getTimeTrendRpt',
    method: 'get',
    params
  })
}

export function getDistrictRpt(params) {
  return request({
    url: '/analytics/getDistrictRpt',
    method: 'get',
    params
  })
}

export function getCommonTrackRpt(params) {
  return request({
    url: '/analytics/getCommonTrackRpt',
    method: 'get',
    params
  })
}

export function getTrendTime(params) {
  return request({
    url: '/analytics/getTrendTime',
    method: 'get',
    params
  })
}

export function getTrendLatest(params) {
  return request({
    url: '/analytics/getTrendLatest',
    method: 'get',
    params
  })
}

export function getSourceAll(params) {
  return request({
    url: '/analytics/getSourceAll',
    method: 'get',
    params
  })
}

export function getSourceEngine(params) {
  return request({
    url: '/analytics/getSourceEngine',
    method: 'get',
    params
  })
}

export function getSourceSearchword(params) {
  return request({
    url: '/analytics/getSourceSearchword',
    method: 'get',
    params
  })
}

export function getSourceLink(params) {
  return request({
    url: '/analytics/getSourceLink',
    method: 'get',
    params
  })
}

export function getVisitToppage(params) {
  return request({
    url: '/analytics/getVisitToppage',
    method: 'get',
    params
  })
}

export function getVisitLandingpage(params) {
  return request({
    url: '/analytics/getVisitLandingpage',
    method: 'get',
    params
  })
}

export function getVisitTopdomain(params) {
  return request({
    url: '/analytics/getVisitTopdomain',
    method: 'get',
    params
  })
}

export function getVisitDistrict(params) {
  return request({
    url: '/analytics/getVisitDistrict',
    method: 'get',
    params
  })
}

export function getVisitWorld(params) {
  return request({
    url: '/analytics/getVisitWorld',
    method: 'get',
    params
  })
}
