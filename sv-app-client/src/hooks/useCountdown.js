import { ref } from 'vue'

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