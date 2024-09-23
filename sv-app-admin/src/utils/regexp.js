/**
 * 生成正则
 * @param {String} type username | password | email
 * @returns {Object} {regexp, msg}
 */
export function useRegExp(type) {
  const regexps = {
    username: {
      regexp: /^(?![0-9]+$)[a-zA-Z0-9_\-*]{4,20}$/,
      msg: '用户名长度4-20，可包含字母、数字(不能纯数字)、特殊字符_ - *'
    },
    password: {
      regexp: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
      msg: '密码长度8-16，必须包含字母、数字、特殊符号其中至少两种'
    },
    email: {
      regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      msg: '请输入有效的邮箱地址'
    },
    phone: {
      regexp: /^1[3-9]\d{9}$/,
      msg: '请输入有效的手机号码'
    },
    version: {
      regexp: /^(\d+\.\d+\.\d+)(\.\w+)?$/,
      msg: '版本号格式应为num.num.num[.other]'
    },
    ipv4: {
      regexp: /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,
      msg: '包含ip地址',
      mask: (str) => {
        // 正则表达式匹配 IPv4 地址
        const ipv4Regex = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
        // 替换函数
        const replaceWithMask = (match) => {
          const parts = match.split('.')
          return parts
            .map((part) => {
              const numStars = part.length // 计算部分的位数
              return '*'.repeat(numStars) // 生成相应数量的星号
            })
            .join('.') // 重新组合成 IP 地址
        }
        // 返回替换后的字符串
        return str.replace(ipv4Regex, replaceWithMask)
      }
    }
  }

  if (regexps[type]) {
    return regexps[type]
  } else {
    throw new Error(`Unsupported type: ${type}`)
  }
}
