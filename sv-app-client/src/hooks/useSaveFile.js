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
 * app临时文件保存
 * @param {String} url 文件地址
 * @param {String} fileName 文件夹/文件名（IOS不支持指定文件夹，将忽略文件夹部分）
 * @param {Function} callback 下载完成后回调 会覆盖原处理
 * @returns void
 */
async function appSaveFile(url, fileName = "", callback) {
	if (uni.getSystemInfoSync().platform == 'android') {
		// android（支持指定文件夹）

		const dirRes = await createDir(config.name) // 申请文件相关权限，并以appName为根目录创建文件夹
		if (!dirRes) return

		// 分割路径
		const parts = fileName.split('/')
		const directory = parts.slice(0, -1).join('/') // 获取目录部分
		const filename = `${Date.now()}_${parts[parts.length - 1]}` // 获取文件名部分加上时间戳前缀确保唯一
		const sourcePath = `${directory}/${filename}` // 文件保存新相对路径

		// 文件移动
		const targetPath = `/storage/emulated/0/${config.name}/` // 保存至新的根目录
		plus.io.resolveLocalFileSystemURL(targetPath, (entry1) => {
			// console.log('新目录', entry1.fullPath)
			plus.io.resolveLocalFileSystemURL(url, (entry2) => {
				// console.log('旧文件', entry2.fullPath)
				entry2.moveTo(entry1, sourcePath, (res) => {
					// console.log('移动成功', res.fullPath)
					const filepath = res.fullPath
					if (callback) {
						callback(filepath)
					} else {
						uni.openDocument({
							filePath: filepath,
							showMenu: true,
							success: (r) => {
								console.log('打开文档成功', r)
							},
							fail: (err) => {
								uni.showToast({ title: '打开文档失败', icon: 'none' })
							}
						})
					}
				}, (err) => {
					uni.showToast({ title: err.message, icon: 'none' })
				})
			}, (err) => {
				uni.showToast({ title: err.message, icon: 'none' })
			})
		}, (err) => {
			uni.showToast({ title: err.message, icon: 'none' })
		})

	} else {
		// ios（IOS不支持指定文件夹，将忽略文件夹部分）

		uni.saveFile({
			tempFilePath: url,
			success: (res) => {
				let filepath = res.savedFilePath
				if (callback) {
					callback(filepath)
				} else {
					uni.openDocument({
						filePath: filepath,
						showMenu: true,
						success: (r) => {
							console.log('打开文档成功', r)
						},
						fail: (err) => {
							uni.showToast({ title: '打开文档失败', icon: 'none' })
						}
					})
				}
			},
			fail: (err) => {
				uni.showToast({ title: '保存文档失败', icon: 'none' })
			}
		})
	}
}

/**
 * 微信下载
 * @param {String} url 文件地址
 * @param {String} fileName 文件名（微信小程序不支持指定文件夹，将忽略文件夹部分）
 * @param {Function} callback 下载完成后回调 会覆盖原处理
 * @returns void
 */
async function wxSaveFile(url, fileName = "", callback) {
	let fs = uni.getFileSystemManager()
	// 取最后一个/之后的字符为文件名
	fileName = fileName.split('/').pop()
	const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
	fs.saveFile({
		tempFilePath: url,
		filePath: filePath,
		success: (res) => {
			const filepath = res.savedFilePath
			if (callback) {
				callback(filepath)
			} else {
				uni.openDocument({
					filePath: filepath,
					showMenu: true,
					success: (r) => {
						// console.log('文件打开成功', r)
					},
					fail: (e) => {
						uni.showToast({ title: e, icon: 'none' })
					}
				})
			}
		},
		fail: (err) => {
			uni.showToast({ title: err, icon: 'none' })
		}
	})
}

/**
 * H5下载
 * @param {String} url 文件地址
 * @param {String} fileName 文件名（H5不支持指定文件夹，将忽略文件夹部分）
 * @param {Function} callback 下载完成后回调 会覆盖原处理
 * @returns void
 */
async function h5SaveFile(url, fileName = "", callback) {
	// 分割路径
	const parts = fileName.split('/')
	const filename = parts.pop()

	const link = document.createElement("a")
	link.href = url
	link.download = filename
	link.click();

	if (callback) callback(url)
}

/**
 * 下载 临时文件持久化
 * @param {String} url 文件的临时地址
 * @param {String} fileName 文件夹/文件名（H5、IOS、微信小程序不支持指定文件夹，将忽略文件夹部分）
 * @param {Function} callback 下载完成后回调 会覆盖原处理（参数：path文件路径）
 */
async function save(url, fileName = "", callback) {
	// #ifdef APP
	await appSaveFile(url, fileName, callback)
	// #endif

	// #ifdef MP-WEIXIN
	await wxSaveFile(url, fileName, callback)
	// #endif

	// #ifdef H5
	await h5SaveFile(url, fileName, callback)
	// #endif
}

// hook实例
export const useSaveFile = () => {
	return {
		save,
		h5SaveFile,
		appSaveFile,
		wxSaveFile,
		createDir
	}
}