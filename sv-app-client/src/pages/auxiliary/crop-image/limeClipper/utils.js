/**
 * 判断手指触摸位置
 */
export function determineDirection(clipX, clipY, clipWidth, clipHeight, currentX, currentY) {
	/*
	 * (右下>>1 右上>>2 左上>>3 左下>>4)
	 */
	let corner;
	/**
	 * 思路：（利用直角坐标系）
	 *  1.找出裁剪框中心点
	 *  2.如点击坐标在上方点与左方点区域内，则点击为左上角
	 *  3.如点击坐标在下方点与右方点区域内，则点击为右下角
	 *  4.其他角同理
	 */
	const mainPoint = [clipX + clipWidth / 2, clipY + clipHeight / 2]; // 中心点
	const currentPoint = [currentX, currentY]; // 触摸点

	if (currentPoint[0] <= mainPoint[0] && currentPoint[1] <= mainPoint[1]) {
		corner = 3; // 左上
	} else if (currentPoint[0] >= mainPoint[0] && currentPoint[1] <= mainPoint[1]) {
		corner = 2; // 右上
	} else if (currentPoint[0] <= mainPoint[0] && currentPoint[1] >= mainPoint[1]) {
		corner = 4; // 左下
	} else if (currentPoint[0] >= mainPoint[0] && currentPoint[1] >= mainPoint[1]) {
		corner = 1; // 右下
	}

	return corner;
}

/**
 * 图片边缘检测检测时，计算图片偏移量
 */
export function calcImageOffset(data, scale) {
	let left = data.imageLeft;
	let top = data.imageTop;
	scale = scale || data.scale;
	
	let imageWidth = data.imageWidth;
	  let imageHeight = data.imageHeight;
	  if ((data.angle / 90) % 2) {
	    imageWidth = data.imageHeight;
	    imageHeight = data.imageWidth;
	  }
	  const {
	      clipX,
	      clipWidth,
	      clipY,
	      clipHeight
	    } = data;

	// 当前图片宽度/高度
	const currentImageSize = (size) => (size * scale) / 2;
	const currentImageWidth = currentImageSize(imageWidth);
	const currentImageHeight = currentImageSize(imageHeight);

	left = clipX + currentImageWidth >= left ? left : clipX + currentImageWidth;
	left = clipX + clipWidth - currentImageWidth <= left ? left : clipX + clipWidth - currentImageWidth;
	top = clipY + currentImageHeight >= top ? top : clipY + currentImageHeight;
	top = clipY + clipHeight - currentImageHeight <= top ? top : clipY + clipHeight - currentImageHeight;
	return {
		left,
		top,
		scale
	};
}

/**
 * 图片边缘检测时，计算图片缩放比例
 */
export function calcImageScale(data, scale) {
	scale = scale || data.scale;
	let {
		imageWidth,
		imageHeight,
		clipWidth,
		clipHeight,
		angle
	} = data
	if ((angle / 90) % 2) {
		imageWidth = imageHeight;
		imageHeight = imageWidth;
	}
	if (imageWidth * scale < clipWidth) {
		scale = clipWidth / imageWidth;
	}
	if (imageHeight * scale < clipHeight) {
		scale = Math.max(scale, clipHeight / imageHeight);
	}
	return scale;
}

/**
 * 计算图片尺寸
 */
export function calcImageSize(width, height, data) {
	let imageWidth = width,
		imageHeight = height;
	let {
		clipWidth,
		clipHeight,
		sysinfo,
		width: originWidth,
		height: originHeight
	} = data
	if (imageWidth && imageHeight) {
		if (imageWidth / imageHeight > (clipWidth || originWidth) / (clipWidth || originHeight)) {
			imageHeight = clipHeight || originHeight;
			imageWidth = (width / height) * imageHeight;
		} else {
			imageWidth = clipWidth || originWidth;
			imageHeight = (height / width) * imageWidth;
		}
	} else {
		let sys = sysinfo || uni.getSystemInfoSync();
		imageWidth = sys.windowWidth;
		imageHeight = 0;
	}
	return {
		imageWidth,
		imageHeight
	};
}

/**
 * 勾股定理求斜边
 */
export function calcPythagoreanTheorem(width, height) {
	return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
}

/**
 * 拖动裁剪框时计算
 */
export function clipTouchMoveOfCalculate(data, event) {
	const clientX = event.touches[0].clientX;
	const clientY = event.touches[0].clientY;

	let {
		clipWidth,
		clipHeight,
		clipY: oldClipY,
		clipX: oldClipX,
		clipStart,
		isLockRatio,
		maxWidth,
		minWidth,
		maxHeight,
		minHeight
	} = data;
	maxWidth = maxWidth / 2;
	minWidth = minWidth / 2;
	minHeight = minHeight / 2;
	maxHeight = maxHeight / 2;

	let width = clipWidth,
		height = clipHeight,
		clipY = oldClipY,
		clipX = oldClipX,
		// 获取裁剪框实际宽度/高度
		// 如果大于最大值则使用最大值
		// 如果小于最小值则使用最小值
		sizecorrect = () => {
			width = width <= maxWidth ? (width >= minWidth ? width : minWidth) : maxWidth;
			height = height <= maxHeight ? (height >= minHeight ? height : minHeight) : maxHeight;
		},
		sizeinspect = () => {
			sizecorrect();
			if ((width > maxWidth || width < minWidth || height > maxHeight || height < minHeight) && isLockRatio) {
				return false;
			} else {
				return true;
			}
		};
	//if (clipStart.corner) {
	height = clipStart.height + (clipStart.corner > 1 && clipStart.corner < 4 ? 1 : -1) * (clipStart.y - clientY);
	//}
	switch (clipStart.corner) {
		case 1:
			width = clipStart.width - clipStart.x + clientX;
			if (isLockRatio) {
				height = width / (clipWidth / clipHeight);
			}
			if (!sizeinspect()) return;
			break;
		case 2:
			width = clipStart.width - clipStart.x + clientX;
			if (isLockRatio) {
				height = width / (clipWidth / clipHeight);
			}
			if (!sizeinspect()) {
				return;
			} else {
				clipY = clipStart.clipY - (height - clipStart.height);
			}

			break;
		case 3:
			width = clipStart.width + clipStart.x - clientX;
			if (isLockRatio) {
				height = width / (clipWidth / clipHeight);
			}
			if (!sizeinspect()) {
				return;
			} else {
				clipY = clipStart.clipY - (height - clipStart.height);
				clipX = clipStart.clipX - (width - clipStart.width);
			}

			break;
		case 4:
			width = clipStart.width + clipStart.x - clientX;
			if (isLockRatio) {
				height = width / (clipWidth / clipHeight);
			}
			if (!sizeinspect()) {
				return;
			} else {
				clipX = clipStart.clipX - (width - clipStart.width);
			}
			break;
		default:
			break;
	}
	return {
		width,
		height,
		clipX,
		clipY
	};
}

/**
 * 单指拖动图片计算偏移
 */
export function imageTouchMoveOfCalcOffset(data, clientXForLeft, clientYForLeft) {
	let left = clientXForLeft - data.touchRelative[0].x,
		top = clientYForLeft - data.touchRelative[0].y;
	return {
		left,
		top
	};
}

export function base64ToPath(base64) {
  return new Promise(function(resolve, reject) {
    if (typeof window === 'object' && 'document' in window) {
      base64 = base64.split(',')
      let type = base64[0].match(/:(.*?);/)[1]
      let str = atob(base64[1])
      let n = str.length
      let array = new Uint8Array(n)
      while (n--) {
        array[n] = str.charCodeAt(n)
      }
      return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], {
        type: type
      })))
    }
    let extName = base64.split(',')[0].match(/data\:\S+\/(\S+);/)
    if (extName) {
      extName = extName[1]
    } else {
      reject(new Error('base64 error'))
    }
    let fileName = getNewFileId() + '.' + extName
    if (typeof plus === 'object') {
      let basePath = '_doc'
      let dirPath = 'uniapp_temp'
      let filePath = basePath + '/' + dirPath + '/' + fileName
      if (!biggerThan(plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472', plus.runtime.innerVersion)) {
        plus.io.resolveLocalFileSystemURL(basePath, function(entry) {
          entry.getDirectory(dirPath, {
            create: true,
            exclusive: false,
          }, function(entry) {
            entry.getFile(fileName, {
              create: true,
              exclusive: false,
            }, function(entry) {
              entry.createWriter(function(writer) {
                writer.onwrite = function() {
                  resolve(filePath)
                }
                writer.onerror = reject
                writer.seek(0)
                writer.writeAsBinary(dataUrlToBase64(base64))
              }, reject)
            }, reject)
          }, reject)
        }, reject)
        return
      }
      let bitmap = new plus.nativeObj.Bitmap(fileName)
      bitmap.loadBase64Data(base64, function() {
        bitmap.save(filePath, {}, function() {
          bitmap.clear()
          resolve(filePath)
        }, function(error) {
          bitmap.clear()
          reject(error)
        })
      }, function(error) {
        bitmap.clear()
        reject(error)
      })
      return
    }
    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
      let filePath = wx.env.USER_DATA_PATH + '/' + fileName
      wx.getFileSystemManager().writeFile({
        filePath: filePath,
        data: dataUrlToBase64(base64),
        encoding: 'base64',
        success: function() {
          resolve(filePath)
        },
        fail: function(error) {
          reject(error)
        }
      })
      return
    }
    reject(new Error('not support'))
  })
}