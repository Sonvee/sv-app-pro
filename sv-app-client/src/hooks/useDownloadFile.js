async function createDir(path) {
	return await new Promise((resolve) => {
		//申请本地存储读写权限
		plus.android.requestPermissions([
			'android.permission.WRITE_EXTERNAL_STORAGE',
			'android.permission.READ_EXTERNAL_STORAGE',
			'android.permission.INTERNET',
			'android.permission.ACCESS_WIFI_STATE'
		], (res) => {
			let success = false

			if (res.deniedAlways.length > 0) { // 权限被永久拒绝
				// 弹出提示框解释为何需要权限，引导用户打开设置页面开启
				success = false
				uni.showToast({ title: '无法获取权限，文件下载将出错！', icon: 'none' })
			}
			if (res.deniedPresent.length > 0) { // 权限被临时拒绝
				// 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限
				success = false
				uni.showToast({ title: '未授权，可以会出现问题！', icon: 'none' })
			}
			if (res.granted.length > 0) { // 权限被允许
				success = true
				uni.showToast({ title: '已授权', icon: 'none' })

				const File = plus.android.importClass('java.io.File');
				const dirpath = '/storage/emulated/0/' + path
				let file = new File(dirpath);
				if (!file.exists()) { //文件夹不存在即创建
					file.mkdirs()
				}
			}
			resolve(success)

		}, (error) => {
			uni.showToast({ title: '无法获取权限，文件下载将出错！', icon: 'none' })
			resolve(false)
		})

	})
}

/**`
 * 下载工具
 * @param {String} url 文件的临时地址
 * @param {String} fileName 文件名
 */
export async function useDownloadFile(url, fileName = "未命名") {
	// #ifdef APP
	/**
	 * 文件下载
	 * @tutorial https://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader
	 */
	const downloadTask = plus.downloader.createDownload(
		url, { filename: 'file://storage/emulated/0/SvApp/excel/' + fileName },
		(download, status) => {
			console.log('downloadTask ==>', download, status);
			if (status == 200) {
				// download.filename是文件在保存在本地的相对路径，使用下面的API可转为绝对路径
				const filepath = plus.io.convertLocalFileSystemURL(download.filename)
				plus.runtime.openFile(filepath) // 选择软件打开文件
				plus.downloader.clear() // 清除下载任务
			} else {
				// 失败处理
				plus.downloader.clear() // 清除下载任务
			}
		}
	)
	// 开始下载
	downloadTask.start()
	// #endif

	// #ifdef MP-WEIXIN
	let fs = uni.getFileSystemManager()
	const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
	fs.saveFile({
		tempFilePath: url,
		filePath: filePath,
		success: (res) => {
			console.log('文件保存成功', res)
			uni.openDocument({
				filePath: res.savedFilePath,
				showMenu: true,
				success: (r) => {
					console.log('文件预览成功', r)
				},
				fail: (error) => {
					console.error('文件保存失败', error)
				}
			})
		}
	})
	// #endif
}