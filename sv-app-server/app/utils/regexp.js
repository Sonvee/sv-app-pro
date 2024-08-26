/**
 * 创建正则
 * @param {String} type username | password | email | phone
 * @return
 */
function useRegExp(type) {
  const regexps = {
    username: {
      regexp: /^(?![0-9]+$)[a-zA-Z0-9_\-*]{4,20}$/,
      msg: '用户名长度4-20，可包含字母、数字(不能纯数字)、特殊字符_ - *',
    },
    password: {
      regexp: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
      msg: '密码长度8-16，必须包含字母、数字、特殊符号其中至少两种',
    },
    email: {
      regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      msg: '请输入有效的邮箱地址',
    },
    phone: {
      regexp: /^1[3-9]\d{9}$/,
      msg: '请输入有效的手机号码',
    },
    version: {
      regexp: /^(\d+\.\d+\.\d+)(\.\w+)?$/,
      msg: '版本号格式应为num.num.num[.other]',
    },
  };

  if (regexps[type]) {
    return regexps[type];
  }
  throw new Error(`Unsupported type: ${type}`);

}

module.exports = useRegExp;
