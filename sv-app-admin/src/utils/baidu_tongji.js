import { isType } from './index'

/**
 * 百度统计相关数据结构转换工具方法
 */

export function transformOutline(data) {
  const transformed = {}
  const fields = data.fields
  const items = data.items
  items.forEach((item) => {
    if (isType(item[0]) === 'string') {
      let obj = {}
      for (let i = 1; i < item.length; i++) {
        const field = fields[i]
        if (isType(item[i]) === 'object') {
          obj[field] = item[i]
        } else {
          obj[field] = item[i]
        }
      }
      transformed[item[0]] = obj
    }
  })
  return transformed
}
