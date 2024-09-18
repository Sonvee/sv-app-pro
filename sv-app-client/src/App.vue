<script>
import { preProcess } from '@/utils/pre-process'
export default {
  onLaunch: () => {
    console.log('App Launch')
    preProcess()
  },
  onShow: () => {
    console.log('App Show')
  },
  onHide: () => {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/assets/styles/main.scss';
</style>
