/**
 * 文件下载 - buffer
 * @param {buffer} buffer 要下载的buffer二进制文件
 */
function buffer(buffer) {
  const blob = new Blob([buffer])
  // 创建临时下载链接
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'permissionExcelTemplate.xlsx'
  link.click()
  URL.revokeObjectURL(url) // 清理临时URL
}

export const useSaveFile = () => {
  return {
    buffer
  }
}
