import http from '@/config/request'

export function avatarUpload(data) {
	// 单文件上传
  return http.upload('/file/avatarUpload', {
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

export async function feedbackImageUpload(data) {
	// 多文件上传
  const uploadPromise = (filePath) => {
    return new Promise((resolve, reject) => {
      http.upload('/file/feedbackImageUpload', {
        filePath,
        name: data.name,
        formData: data.params,
      }).then(res => {
        resolve(res.data[0]);
      }).catch(err => {
        reject(err);
      })
    })
  }

  const promises = data?.files?.map(async (item) => {
    return await uploadPromise(item.url);
  });

  return await Promise.all(promises);
}