<script>
import { preProcess } from '@/utils/pre-process'
export default {
  onLaunch: function () {
    console.log('App Launch')
    preProcess()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import '@/assets/styles/main.scss';


</style>
