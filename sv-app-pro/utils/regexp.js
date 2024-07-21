export function useRegExp(type) {
	const regexps = {
		username: {
			regexp: /^(?![0-9]+$)[a-zA-Z0-9_\-*]{4,20}$/,
			msg: '可为字母,数字(非纯数字),特殊字符_ - *'
		},
		password: {
			regexp: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
			msg: '至少包含字母,数字,特殊符号其中两种'
		},
		email: {
			regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			msg: '请输入有效的邮箱地址'
		},
		phone: {
			regexp: /^1[3-9]\d{9}$/,
			msg: '请输入有效的手机号码'
		}
	}

	if (regexps[type]) {
		return regexps[type]
	} else {
		throw new Error(`Unsupported type: ${type}`)
	}
}