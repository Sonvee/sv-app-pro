import request from '@/config/request'

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