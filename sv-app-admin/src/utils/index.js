import dayjs from 'dayjs'

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(menuList) {
  return menuList.filter((item) => !item.meta.isHide || (item.meta.isHide && item.meta.isSub))
}

/**
 * @description 使用递归过滤出树形侧菜单列表 (可选择性过滤isHide的菜单)
 * @param {Array} menuList 菜单列表
 * @param {Boolean} filter 是否过滤isHide的菜单，默认true
 * @returns {Array} 处理后的菜单
 */
export function getTreeMenuList(menuList, filter = true) {
  const treeMap = {}
  const rootMenus = []
  // 遍历菜单列表
  menuList.forEach((menu) => {
    if (filter && menu.meta.isHide) return // 如果需要过滤且当前项需要隐藏，则跳过
    // 创建新的菜单项，防止污染原数据
    const newMenu = { ...menu }
    // 添加到树形结构中
    if (!menu.parent_name || !treeMap[menu.parent_name]) {
      // 没有父级或父级未找到，作为根节点
      rootMenus.push(newMenu)
    } else {
      // 父级已找到，添加为子节点
      treeMap[menu.parent_name].push(newMenu)
    }
    // 确保每个父节点都有一个空数组作为其子节点容器
    if (!treeMap[newMenu.name]) {
      treeMap[newMenu.name] = []
    }
  })
  // 构建树形结构
  const buildTree = (menus) => {
    return menus.map((menu) => {
      menu.children = treeMap[menu.name] ? buildTree(treeMap[menu.name]) : undefined
      return menu
    })
  }
  return buildTree(rootMenus)
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export function getAllBreadcrumbList(menuList) {
  const handelTreeMenuList = (menuList) => {
    const treeMap = {}
    const rootMenus = []
    // 遍历菜单列表
    menuList.forEach((menu) => {
      if (menu.meta.isHide && !menu.meta.isSub) return // 如果需要过滤且当前项需要隐藏，则跳过
      // 创建新的菜单项，防止污染原数据
      const newMenu = { ...menu }
      // 添加到树形结构中
      if (!menu.parent_name || !treeMap[menu.parent_name]) {
        // 没有父级或父级未找到，作为根节点
        rootMenus.push(newMenu)
      } else {
        // 父级已找到，添加为子节点
        treeMap[menu.parent_name].push(newMenu)
      }
      // 确保每个父节点都有一个空数组作为其子节点容器
      if (!treeMap[newMenu.name]) {
        treeMap[newMenu.name] = []
      }
    })
    // 构建树形结构
    const buildTree = (menus) => {
      return menus.map((menu) => {
        menu.children = treeMap[menu.name] ? buildTree(treeMap[menu.name]) : undefined
        return menu
      })
    }
    return buildTree(rootMenus)
  }

  menuList = handelTreeMenuList(menuList)

  const handleBreadcrumbList = (menuList, parent = [], result = {}) => {
    for (const item of menuList) {
      result[item.path] = [...parent, item]
      if (item.children) handleBreadcrumbList(item.children, result[item.path], result)
    }
    return result
  }

  // 使用递归找出所有面包屑
  return handleBreadcrumbList(menuList)
}

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  }
  return url[mode]
}

/**
 * 时间日期格式化
 * @param {String} time 需要格式化的时间
 * @param {String} format 格式化规则 为timestamp将time转化为时间戳（毫秒）
 */
export function timeFormat(time, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return
  if (format === 'timestamp') {
    return dayjs(time).valueOf()
  }
  time = Number(time) // 转化为时间戳数字
  return dayjs(time).format(format)
}

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
  let timeNow = new Date()
  let hours = timeNow.getHours()
  if (hours >= 6 && hours <= 10) return `早上好 ⛅`
  if (hours >= 10 && hours <= 14) return `中午好 🌞`
  if (hours >= 14 && hours <= 18) return `下午好 🌞`
  if (hours >= 18 && hours <= 24) return `晚上好 🌛`
  if (hours >= 0 && hours <= 6) return `夜深啦，注意休息哦 🌛`
}

/**
 * 将毫秒转换为x天x小时x分钟
 * @param {Number} ms 要转换的毫秒数
 * @returns 转换结果x天x小时x分钟，当x为0则该部分单位不显示，不足1分钟则显示秒，不足1秒则显示毫秒
 */
export function durationFormat(ms) {
  // 定义各个时间单位对应的毫秒数
  const milliSecondsInSecond = 1000
  const milliSecondsInMinute = 60 * milliSecondsInSecond
  const milliSecondsInHour = milliSecondsInMinute * 60
  const milliSecondsInDay = milliSecondsInHour * 24

  // 计算天数、小时数、分钟数、秒数和毫秒数
  const days = Math.floor(ms / milliSecondsInDay)
  const hours = Math.floor((ms % milliSecondsInDay) / milliSecondsInHour)
  const minutes = Math.floor((ms % milliSecondsInHour) / milliSecondsInMinute)
  const seconds = Math.floor((ms % milliSecondsInMinute) / milliSecondsInSecond)
  const milliseconds = ms % milliSecondsInSecond

  // 创建一个数组来存储非零时间单位
  const parts = []

  // 如果天数大于0，添加到数组
  if (days > 0) {
    parts.push(`${days}天`)
  }
  // 如果小时数大于0，添加到数组
  if (hours > 0) {
    parts.push(`${hours}小时`)
  }
  // 如果分钟数大于0，添加到数组
  if (minutes > 0) {
    parts.push(`${minutes}分钟`)
  }
  // 如果总时间小于1分钟，且秒数大于0，添加到数组
  if (ms < milliSecondsInMinute && seconds > 0) {
    parts.push(`${seconds}秒`)
  }
  // 如果总时间小于1秒，且毫秒数大于0，添加到数组
  if (ms < milliSecondsInSecond && milliseconds > 0) {
    parts.push(`${milliseconds}毫秒`)
  }

  // 如果数组为空，说明毫秒数不足1毫秒，直接返回"0"
  if (parts.length === 0) {
    return '0'
  }

  // 返回格式化的字符串
  return parts.join('')
}

/**
 * 合并对象，只合并原有对象中存在的参数，用法同 Object.assign()
 * @param {Object} target 原对象
 * @param {Object} source 要合并覆盖的对象 为假时返回原对象
 * @returns {Object} 合并的对象
 */
export function assignOverride(target, source) {
  if (source) {
    for (var key in source) {
      if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

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
 * @returns {Boolean} 判断结果
 */
export function isTruthy(value, type = '') {
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
}

/**
 * 获取变量类型
 * @param {any} val 要判断的变量
 * @returns {String} 类型
 */
export function isType(val) {
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
}

/**
 * 判断字符串型数字
 * @param {*} str 要判断的字符串
 * @returns {Boolean} 是否是字符串型数字
 */
export function isNumeric(str) {
  const num = Number(str)
  return !Number.isNaN(num)
}

/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = ''
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

/**
 * 对象转换为数组
 * @param {Object} obj 要转换的对象
 * @param {String} keyName 键字段名
 * @param {String} valueName 值字段名
 * @returns {Array} 转换结果
 */
export function objectToArray(obj, keyName = 'key', valueName = 'value') {
  return Object.entries(obj).map(([key, value]) => ({
    [keyName]: key,
    [valueName]: value
  }))
}

/**
 * 多元判断
 * @param {any} origin - 判断源
 * @param {Array<any>} conditions - 条件
 * @param {Array<any>} result - 处理结果
 * @returns {any} - 对应的结果值或抛出错误
 */
export function multipleJudgment(origin, conditions = [], result = []) {
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

/**
 * 精确将分转为元
 * @param {Object} fen 金额(分) 100分=1元
 */
export function convertFenToYuan(fen) {
  if (!fen) return 0
  // 将分转换为元，过程中放大100倍
  let yuan = fen / 100
  // 创建一个足够大的基数（这里是100）的幂次，用于去除不需要的小数位
  const base = 10
  const precision = 2
  const multiplier = base ** precision
  // 四舍五入并转为整数，然后再除以基数的幂次，得到精确到小数点后两位的结果
  return Math.round(yuan * multiplier) / multiplier
}
