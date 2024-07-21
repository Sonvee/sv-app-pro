import dayjs from 'dayjs'

/**
 * 时间日期格式化
 */
export function timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
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