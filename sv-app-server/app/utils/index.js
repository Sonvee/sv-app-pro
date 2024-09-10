module.exports = {
  /**
   * 生成随机码
   * @param {number} length 码长度
   * @param {number} chunkSize 分组长度 可选
   * @param {string} separator 分组分隔符 可选
   * @return {string} 生成的码
   */
  generateRandomCode(length, chunkSize, separator) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    let formattedResult = ''

    // 生成随机字符串
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    // 如果chunkSize或separator未定义，则不进行分组
    if (chunkSize && separator) {
      // 按照指定的chunkSize进行分组并插入separator
      for (let i = 0; i < result.length; i++) {
        if (i > 0 && i % chunkSize === 0) {
          formattedResult += separator
        }
        formattedResult += result[i]
      }
    } else {
      // 如果没有分组，直接使用原始的result
      formattedResult = result
    }

    return formattedResult
  },

  /**
   * 判断数组中是否包含子数组
   * @param {array} mainArray 主数组
   * @param {array} subArray 子数组
   * @return {boolean} 是否包含
   */
  arrayIncludesSubarray(mainArray, subArray) {
    // 非数组直接false
    if (!Array.isArray(mainArray) || !Array.isArray(subArray)) {
      return false
    }
    // 子数组大于主数组直接false
    if (subArray.length > mainArray.length) {
      return false
    }
    return mainArray.some((_, start) => mainArray.slice(start, start + subArray.length).every((value, index) => value === subArray[index]))
  },

  /**
   * 合并对象，只合并原有对象中存在的参数，用法同 Object.assign()
   * @param {Object} target 原对象
   * @param {Object} source 要合并覆盖的对象
   * @return {Object} 合并的对象
   */
  assignOverride(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
    return target
  },

  /**
   * 判断值真假
   * 1. 默认常规判断
   * 2. type 含有 'zero' 时，数字0为真
   * 3. type 含有 'arr' 时，空数组为假
   * 4. type 含有 'obj' 时，空对象为假
   * 5. type 含有 'bool' 时，false为真
   * 6. type 含有 'strbo' 时，仅'true'或true为真，其他皆为假
   * @param {any} value 要判断的值
   * @param {String} type 模式 可为包含[zero|arr丨obj]的字符串组合
   * @return {Boolean} 判断结果
   */
  isTruthy(value, type = '') {
    let result = false
    // 常规真假判断
    result = !!value
    // 只有空格的字符串为假值
    if (typeof value === 'string' && !value.trim()) {
      result = false
    }
    // zero模式下数字0为真
    if (type.includes('zero') && value === 0) {
      result = true
    }
    // arr模式下空数组为假值
    if (type.includes('arr') && Array.isArray(value) && value.length === 0) {
      result = false
    }
    // obj模式下空对象为假值
    if (type.includes('obj') && !Array.isArray(value) && typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
      result = false
    }
    // bool模式下false为真
    if (type.includes('bool') && value === false) {
      result = true
    }
    // strbo模式下仅'true'或true为真，其他皆为假
    if (type.includes('strbo') && value !== 'true' && value !== true) {
      result = false
    }

    return result
  },

  /**
   * 获取变量类型
   * @param {any} val 要判断的变量
   * @returns {String} 类型
   */
  isType(val) {
    const type = Object.prototype.toString.call(val)
    switch (type) {
      case '[object Boolean]':
        return 'boolean'
      case '[object Number]':
        return isNaN(val) ? 'NaN' : 'number' // 检测NaN
      case '[object String]':
        return 'string'
      case '[object Function]':
        return 'function'
      case '[object Array]':
        return 'array'
      case '[object Null]':
        return 'null' // 特殊处理null
      case '[object Undefined]':
        return 'undefined' // 特殊处理undefined
      default:
        return 'object' // 包括Date, RegExp, Error等都视为object
    }
  },

  /**
   * 菜单节点删除，会删除指定节点与其子节点
   * @param {Array} nodes 扁平化的菜单列表
   * @param {Array} nodeNames 指定删除项的标识名name数组
   * @return 删除后的菜单列表，已删除项的name数组
   */
  removeNode(nodes, nodeNames) {
    const queue = [...nodeNames]
    const toRemove = {}
    const removedNames = []

    while (queue.length > 0) {
      const currentName = queue.shift()
      toRemove[currentName] = true
      removedNames.push(currentName)

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].parent_name === currentName) {
          queue.push(nodes[i].name)
        }
      }
    }

    for (let i = 0; i < nodes.length; ) {
      if (toRemove[nodes[i].name]) {
        nodes.splice(i, 1)
      } else {
        i++
      }
    }

    return {
      nodes,
      removedNames: [...new Set(removedNames)]
    }
  },

  /**
   * 多元判断
   * @param {any} origin - 判断源
   * @param {Array<any>} conditions - 条件
   * @param {Array<any>} result - 处理结果
   * @return {any} - 对应的结果值或抛出错误
   */
  multipleJudgment(origin, conditions = [], result = []) {
    // 检查条件和结果数组的长度是否一致
    if (conditions.length !== result.length) {
      throw new Error('条件数组和结果数组长度不一致')
    }

    // 查找判断源在条件数组中的位置
    const index = conditions.indexOf(origin)

    // 如果找到，则返回对应的结果值
    if (index !== -1) {
      return result[index]
    }

    // 如果没有找到，则返回本身
    return origin
  }
}
