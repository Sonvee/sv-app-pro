import request from '@/config/request/request.js'

export function avatarUpload(data) {
  return request({
    url: '/file/avatarUpload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function avatarDelete(data) {
  return request({
    url: '/file/avatarDelete',
    method: 'post',
    data
  })
}

export function userfilesDelete(data) {
  return request({
    url: '/file/userfilesDelete',
    method: 'post',
    data
  })
}

export function editorImgUpload(data) {
  return request({
    url: '/file/editorImgUpload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function releaseUpload(data) {
  return request({
    url: '/file/releaseUpload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function releaseImageUpload(data) {
  return request({
    url: '/file/releaseImageUpload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}