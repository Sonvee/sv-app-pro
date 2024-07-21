<template>
  <el-dialog v-bind="$attrs" ref="userDeleteRef" width="420" align-center>
    <template #header>
      <h3 style="color: red">高危操作</h3>
    </template>
    <div>确认删除『 {{ username }} 』吗？</div>
    <h4 style="color: red">这将会直接删除该账号所有数据，且无法挽回！</h4>
    <h4 style="color: orange">如果只是需要封禁该账号，请点击 编辑 > 状态 > 禁用</h4>
    <div>确认继续删除吗？</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDeleteDailog">取消</el-button>
        <el-button type="primary" :disabled="confirmDeleteDisabled" @click="confirmDeleteDailog">
          确认
          <span v-if="deleteCountdown">({{ deleteCountdown }})</span>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  username: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['close', 'confirm'])

const userDeleteRef = ref()

// 高危操作 - 删除
const confirmDeleteDisabled = ref(true)
const deleteCountdown = ref(9)
let countdownTimer = null
// 倒计时开始
const startCountdown = () => {
  // 不重复创建计时器
  if (countdownTimer) {
    clearCountdown()
    return
  }
  confirmDeleteDisabled.value = true
  // 倒计时
  countdownTimer = setInterval(() => {
    deleteCountdown.value--
    if (deleteCountdown.value == 0) {
      // 倒计时完毕
      clearCountdown()
      confirmDeleteDisabled.value = false
    }
  }, 1000)
}
// 倒计时清除
const clearCountdown = () => {
  clearInterval(countdownTimer)
  countdownTimer = null
}

// 关闭删除弹窗
function closeDeleteDailog() {
  emits('close')
  userDeleteRef.value.visible = false
}
// 确认删除
async function confirmDeleteDailog() {
  emits('confirm', props.username)
  // 关闭弹窗
  userDeleteRef.value.visible = false
}

// 监听删除弹窗状态
watch(
  () => userDeleteRef.value?.visible,
  (newVal) => {
    if (newVal) {
      // 弹窗开启时
      startCountdown()
    } else {
      // 弹窗关闭时
      clearCountdown()
      confirmDeleteDisabled.value = true
      deleteCountdown.value = 9
    }
  }
)
</script>

<style lang="scss" scoped></style>
