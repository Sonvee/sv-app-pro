import config from "@/config"

/**
 * Android申请权限并创建文件夹
 * @param {Object} path 文件夹目录
 */
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
				// uni.showToast({ title: '已授权', icon: 'none' })

				const File = plus.android.importClass('java.io.File');
				const dirpath = '/storage/emulated/0/' + path
				let file = new File(dirpath);
				if (!file.exists()) { //文件夹不存在即创建
					file.mkdirs()
				}
			}
			resolve(success)

		}, (err) => {
			uni.showToast({ title: err.message, icon: 'none' })
			resolve(false)
		})

	})
}

/**
 * 安卓app下载
 * @param {String} url 文件地址
 * @param {String} fileName 文件夹/文件名
 * @param {Function} callback 下载完成后回调 会覆盖原处理
 * @returns downloadTask 下载任务
 */
async function appDownload(url, fileName = "", callback) {
	// 申请文件相关权限，并以appName为根目录创建文件夹
	const dirRes = await createDir(config.name)
	if (!dirRes) return

	/**
	 * 文件下载
	 * @tutorial https://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader
	 */
	const downloadTask = plus.downloader.createDownload(
		url, { filename: `file://storage/emulated/0/${config.name}/${fileName}` },
		(download, status) => {
			// download.filename是文件在保存在本地的相对路径，使用下面的API可转为绝对路径
			const filepath = plus.io.convertLocalFileSystemURL(download.filename)
			if (status == 200) {
				if (callback) {
					callback(filepath)
				} else {
					plus.runtime.openFile(filepath) // 选择软件打开文件
				}
			} else {
				// 失败处理
				// plus.downloader.clear() // 清除下载任务
				downloadTask.abort() // 取消下载任务
			}
		}
	)
	// 开始下载
	downloadTask.start()

	return downloadTask
}

/**
 * 下载进度监听
 * @param {Object} task 下载任务
 * @param {Object} callback 进度监听回调
 */
function appDownloadProgress(task, callback) {
	task.addEventListener('statechanged', callback)
}

// hook实例
export const useDownloadFile = () => {
	return {
		appDownload,
		appDownloadProgress,
		createDir
	}
}