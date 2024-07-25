import http from '@/config/request'

export function avatarUpload(data) {
	return http.upload('/file/avatarUpload', {
		name: 'file',
		fileType: 'image',
		...data,
	})
}

export function avatarDelete(data) {
	return http.request({
		url: '/file/avatarDelete',
		method: 'post',
		data
	})
}

export function userfilesDelete(data) {
	return http.request({
		url: '/file/userfilesDelete',
		method: 'post',
		data
	})
}