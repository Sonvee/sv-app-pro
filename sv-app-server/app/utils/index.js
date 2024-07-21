const UAParser = require('ua-parser-js')

module.exports = {
  /**
   * 生成随机码
   * @param {number} length 码长度
   * @param {number} chunkSize 分组长度 可选
   * @param {string} separator 分组分隔符 可选
   * @returns {string} 生成的码
   */
  generateRandomCode: function (length, chunkSize, separator) {
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
   * @returns {boolean} 是否包含
   */
  arrayIncludesSubarray: function (mainArray, subArray) {
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
   * @returns {Object} 合并的对象
   */
  assignOverride(target, source) {
    for (var key in source) {
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
   * @param {any} value 要判断的值
   * @param {String} type 模式 可为包含[zero|arr丨obj]的字符串组合
   * @returns {Boolean} 判断结果
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
    return result
  },

  /**
   * 菜单节点删除，会删除指定节点与其子节点
   * @param {Array} nodes 扁平化的菜单列表
   * @param {Array} nodeNames 指定删除项的标识名name数组
   * @returns 删除后的菜单列表，已删除项的name数组
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
   * ua解析
   * @param {*} ctx eggjs的ctx对象
   */
  uaHandler(ctx) {
    const uaParser = new UAParser(ctx.request.header['user-agent'])
    const ua = uaParser.getResult()
    return ua
  },

  /**
   * 判断用户当前访问平台：WeChat丨Android丨iOS
   * @param {*} ctx eggjs的ctx对象
   */
  judgePlatform(ctx) {
    const uaParser = new UAParser(ctx.request.header['user-agent'])
    const ua = uaParser.getResult()

    if (ua.browser.name == 'WeChat') {
      return 'WeChat'
    }
    return ua.os.name
  }
}