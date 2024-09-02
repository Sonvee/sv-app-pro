import dayjs from 'dayjs'
import { useLoginModal } from '@/hooks/useLoginModal';

/**
 * 时间日期格式化
 * @param {String} time 需要格式化的时间
 * @param {String} format 格式化规则 为timestamp将time转化为时间戳（毫秒）
 */
export function timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
  if (!time) return
  if (format === 'timestamp') {
    return dayjs(time).valueOf()
  }
  time = Number(time) // 转化为时间戳数字
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
 * 静态资源处理 - 只支持H5端
 * @param {String} path 资源路径
 * @tutorial https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url
 */
export function handleImage(path) {
  // #ifdef H5
  // 如果 path 以 @ 开头，则将 @ 替换为 /src
  if (path.startsWith('@')) {
    path = path.replace(/^@/, '/src')
  }
  return new URL(path, import.meta.url).href
  // #endif
  // #ifndef H5
  return path
  // #endif
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
 * 判断对象 target 是否包含为 source  
 * @param {Object} target
 * @param {Object} source
 */
export function isSubset(target, source) {
  // 遍历 source 的所有属性
  for (let key in source) {
    // 如果 source 的某个属性不在 target 中，或者对应的值不同，则返回 false
    if (!target.hasOwnProperty(key) || target[key] !== source[key]) {
      return false;
    }
  }
  // 如果所有属性都匹配，则 source 是 target 的子集
  return true;
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

/**
 * 隐藏部分手机号和邮箱字符以*代替
 * @param {String} input - 输入的手机号或邮箱
 * @returns {String} - 处理后的手机号或邮箱
 */
export function maskPersonalInfo(input) {
  // 检查是否为手机号
  const isPhoneNumber = /^1[3-9]\d{9}$/.test(input);

  // 检查是否为邮箱
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);

  if (isPhoneNumber) {
    // 处理手机号
    return input.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  } else if (isEmail) {
    // 处理邮箱
    const atIndex = input.indexOf('@');
    const localPart = input.substring(0, atIndex);

    // 检查本地部分是否有至少四个字符
    if (localPart.length >= 4) {
      const maskedLocalPart = localPart.substring(0, 3) + '*'.repeat(localPart.length - 3);
      return maskedLocalPart + input.substring(atIndex);
    } else {
      // 如果本地部分不足四个字符，则不进行替换
      return input;
    }
  } else {
    // 如果既不是手机号也不是邮箱，则返回原输入
    return input;
  }
}

/**
 * 页面跳转
 * @description 本方法在页面跳转时，可将要跳转的页面是否需要登录作为可控参数传入
 * @param {String} path - 跳转路径
 * @param {Boolean} needlogin - 是否需要登录 默认false
 * @param {Object} params - 跳转参数携带
 * @param {Function} callback - back后执行回调，页面需提供this.getOpenerEventChannel().emit('E_BACKPAGE', res)，其中res为可携带参数
 */
export function skipPage(path, needlogin = false, params, callback) {
  if (needlogin && !useLoginModal()) return
  if (path) {
    // 判断是否是外部链接（以http开头）
    if (path.startsWith('http')) {
      // #ifdef H5
      window.open(path)
      // #endif
      // #ifdef APP-PLUS
      // plus.runtime.openURL(path);
      plus.runtime.openWeb(path);
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pages/auxiliary/link/link?url=${path}`
      })
      // #endif

      return
    }

    // 正常路由跳转
    uni.navigateTo({
      url: path,
      events: {
        // back后执行回调
        E_BACKPAGE: (res) => {
          if (callback) callback(res)
        }
      },
      success: (res) => {
        res.eventChannel.emit('E_SKIPPAGE', params)
      },
      fail: (err) => {
        console.warn(err.errMsg);
      }
    })
  } else {
    uni.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }
}

/**
 * cdkey校验
 * @param {string} cdkey 要校验的cdkey
 * @param {Number} segments 分组数
 * @param {Number} segmentLength 每组字符数
 * @param {String} flag 分组标志
 * @return {boolean} 是否校验成功
 */
export function validCdkey(cdkey, segments = 5, segmentLength = 5, flag = '-') {
  const regexPattern = new RegExp(
    `^(?:[A-Za-z0-9]{${segmentLength}}\\${flag}){${segments - 1}}[A-Za-z0-9]{${segmentLength}}$`);
  return regexPattern.test(cdkey);
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