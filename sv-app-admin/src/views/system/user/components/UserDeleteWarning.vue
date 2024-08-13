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
        <el-button type="primary" :disabled="countdownIns.disabled.value" @click="confirmDeleteDailog">
          确认 {{ countdownIns.cd.value ? '(' + countdownIns.cd.value + ')' : '' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCountdown } from '@/hooks/useCountdown'

const props = defineProps({
  username: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['close', 'confirm'])

const userDeleteRef = ref()

// 高危操作 - 删除
const cd = 10 // cd时间
const countdownIns = new useCountdown(cd)

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
      countdownIns.setCD(cd) // 设置倒计时时间
      countdownIns.startCountdown()
    } else {
      // 弹窗完全关闭时（建议加延时等待弹窗关闭动画结束）
      setTimeout(() => {
        countdownIns.clearCountdown()
      }, 600)
    }
  }
)
</script>

<style lang="scss" scoped></style>
