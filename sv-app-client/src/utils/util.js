import dayjs from 'dayjs'

/**
 * 时间日期格式化
 * @param {String} time 需要格式化的时间
 * @param {String} format 格式化规则 为timestamp将time转化为时间戳（毫秒）
 */
export function timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
  if (format === 'timestamp') {
    return dayjs(time).valueOf()
  }
  return dayjs(time).format(format)
}

/**
 * 睡眠 延时
 * @param {Object} ms 需要延时的毫秒数
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 扫码
 */
export function onScan() {
  // #ifndef H5
  uni.scanCode({
    onlyFromCamera: false,
    success: (res) => {
      console.log('==== res :', res)
    },
    fail: (err) => {
      console.log('==== err :', err)
    }
  })
  // #endif
  // #ifdef H5
  uni.showToast({
    title: 'H5端不支持扫码',
    icon: 'none'
  })
  // #endif
}

/**
 * 节流 - 需要使用闭包来进行隔离
 * @param {Object} toast 提示内容
 * @param {Object} time 节流时长（毫秒）默认2000
 */
let throttleMoment = null
export function useThrottle(toast = '点击太快啦', time = 2000) {
  return function() {
    const now = Date.now()
    if (throttleMoment === null || now - throttleMoment >= time) {
      throttleMoment = Date.now()
      return true
    }
    uni.showToast({
      title: toast,
      icon: 'none',
    })
    return false
  }
}

/**
 * 合并对象，只合并原有对象中存在的参数，用法同Object.assign()
 * @param {Object} target 原对象
 * @param {Object} source 要合并覆盖的对象
 */
export function assignOverride(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

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
  if (type.includes('obj') && !Array.isArray(value) && typeof value === 'object' && value !== null && Object.keys(value)
    .length === 0) {
    result = false
  }
  // bool模式下false为真
  if (type.includes('bool') && value === false) {
    result = true
  }
  return result
}

/**
 * 获取变量类型
 * @param {any} val 要判断的变量
 * @returns {String} 类型
 */
export function isType(val) {
  if (val === null) return 'null'
  if (isNaN(val)) return 'NaN'
  if (typeof val !== 'object') return typeof val
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
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
 * 多元判断
 * @param {any} origin - 判断源
 * @param {Array} conditions - 条件
 * @param {Array} result - 处理结果
 * @returns 对应的结果值或抛出错误
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