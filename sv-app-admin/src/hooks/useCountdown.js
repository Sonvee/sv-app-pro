import { ref } from 'vue'

/**
 * 倒计时
 * @tutorial 实例初始化 const countdownIns = new useCountdown(cd) // cd为倒计时秒数
 * @tutorial 实例销毁 countdownIns.clearCountdown() // cd为倒计时秒数
 * @tutorial 开始-设置倒计时时间 countdownIns.setCD(cd)
 * @tutorial 开始-计时 countdownIns.startCountdown()
 * @tutorial 结束-计时 countdownIns.clearCountdown()
 * @tutorial 加禁止状态时 :disabled="countdownIns.disabled.value"
 * @tutorial 读秒 {{ countdownIns.cd.value ? '(' + countdownIns.cd.value + ')' : '' }}
 */
export class useCountdown {
	countdown = 60 // 倒计时秒数
	cd = ref(0)
	timer = null
	disabled = ref(false)

	constructor(countdown) {
		this.countdown = countdown
	}

	setCD(cd) {
		this.cd.value = cd
	}

	startCountdown() {
		// 不重复创建计时器
		if (this.timer) {
			this.clearCountdown()
			return
		}
		this.disabled.value = true
		this.cd.value = this.countdown // 重置倒计时
		// timer 实例
		this.timer = setInterval(() => {
			this.cd.value--
			if (this.cd.value == 0) {
				// 倒计时完毕
				this.clearCountdown()
			}
		}, 1000)
	}

	clearCountdown() {
		clearInterval(this.timer)
		this.timer = null
		this.cd.value = 0
    this.disabled.value = false
	}

}