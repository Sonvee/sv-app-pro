// import request from '@/config/request'
import http from '@/config/request'

// 测试 开放接口
export function home() {
  return http.request({
    url: '/home',
    method: 'get'
  })
}

// 测试 需token校验
export function test() {
  return http.request({
    url: '/test',
    method: 'get'
  })
}

// ====== 测试 ======

export function testList(data) {
  return request({
    url: '/test/testList',
    method: 'post',
    data
  })
}

export function testAdd(data) {
  return request({
    url: '/test/testAdd',
    method: 'post',
    data
  })
}

export function testUpdate(data) {
  return request({
    url: '/test/testUpdate',
    method: 'post',
    data
  })
}

export function testDelete(data) {
  return request({
    url: '/test/testDelete',
    method: 'post',
    data
  })
}

export function testBatchAdd(data) {
  return request({
    url: '/test/testBatchAdd',
    method: 'post',
    data
  })
}

export function testBatchDelete(data) {
  return request({
    url: '/test/testBatchDelete',
    method: 'post',
    data
  })
}

// ====== 测试数据联表外键 ======

export function testforeignList(data) {
  return request({
    url: '/test/testforeignList',
    method: 'post',
    data
  })
}

export function testforeignAdd(data) {
  return request({
    url: '/test/testforeignAdd',
    method: 'post',
    data
  })
}

export function testforeignUpdate(data) {
  return request({
    url: '/test/testforeignUpdate',
    method: 'post',
    data
  })
}

export function testforeignDelete(data) {
  return request({
    url: '/test/testforeignDelete',
    method: 'post',
    data
  })
}

export function testforeignBatchAdd(data) {
  return request({
    url: '/test/testforeignBatchAdd',
    method: 'post',
    data
  })
}

export function testforeignBatchDelete(data) {
  return request({
    url: '/test/testforeignBatchDelete',
    method: 'post',
    data
  })
}