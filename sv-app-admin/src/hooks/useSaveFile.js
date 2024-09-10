/**
 * 文件下载
 * @param {Blob} blob 要下载的二进制文件 buffer
 * @param {String} fileName 文件名（需带上文件后缀）
 */
function start(buffer, fileName = '未命名') {
  const blob = new Blob([buffer])
  // 创建临时下载链接
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url) // 清理临时URL
}

export const useSaveFile = () => {
  return {
    start
  }
}
