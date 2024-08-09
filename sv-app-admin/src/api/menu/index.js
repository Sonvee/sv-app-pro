import request from '@/config/request/request.js'
import { useUserStore } from '@/store/user'

export function menuList(data) {
  return request({
    url: '/sys/menuList',
    method: 'post',
    data
  })
}

export function menuAdd(data) {
  return request({
    url: '/sys/menuAdd',
    method: 'post',
    data
  })
}

export function menuUpdate(data) {
  return request({
    url: '/sys/menuUpdate',
    method: 'post',
    data
  })
}

export function menuDelete(data) {
  return request({
    url: '/sys/menuDelete',
    method: 'post',
    data
  })
}

export function menuBatchAdd(data) {
  return request({
    url: '/sys/menuBatchAdd',
    method: 'post',
    data
  })
}

export function menuBatchDelete(data) {
  return request({
    url: '/sys/menuBatchDelete',
    method: 'post',
    data
  })
}
