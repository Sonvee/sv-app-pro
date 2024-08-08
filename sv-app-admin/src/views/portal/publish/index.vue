<template>
  <div class="page-container page-publish">
    <header class="publish-header">
      <img src="@/assets/images/avatar.gif" alt="" class="p-logo" />
      <div class="p-title">
        <h2 class="p-title-1">Hello World</h2>
        <div class="p-title-2">应用描述</div>
      </div>
      <div class="p-qrcode" @click="createQRCode">
        获取本页二维码
        <Vue3NextQrcode :text="fullpath"></Vue3NextQrcode>
      </div>
    </header>

    <footer>页脚</footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Vue3NextQrcode } from 'vue3-next-qrcode'

const router = useRouter()
const route = useRoute()
const fullpath = computed(() => window.location.href)

function createQRCode() {
  console.log('fullpath :>> ', fullpath.value)
}
</script>

<style lang="scss" scoped>
.page-publish {
  --base-size: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: var(--base-size);

  .publish-header {
    width: 40em;
    font-size: 1em;
    padding: 2em 0;
    display: flex;
    align-items: center;

    .p-logo {
      width: 5em;
      height: 5em;
    }

    .p-title {
      height: 100%;
      margin-left: 1em;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      &-1 {
        font-size: 1.8em;
      }
      &-2 {
        font-size: 1.2em;
      }
    }

    .p-qrcode {
      font-size: 0.8em;
      height: 100%;
      padding: 1em 0;
      color: #409eff;
      cursor: pointer;

      &:active {
        color: #66b1ff;
      }
    }
  }
}
</style>
