<template>
  <QRCodeVue3
    imgclass="publish-qrcode"
    v-bind="$attrs"
    :qrOptions="{
      typeNumber: 0, // 0 - 40
      mode: 'Byte', // 'Numeric' 'Alphanumeric' 'Byte' 'Kanji'
      errorCorrectionLevel: 'H' // 纠错等级：L 7%、M 15%、Q 25%、H 30%
    }"
    :backgroundOptions="{ color: '#ffffff' }"
    :margin="2"
    :image="logo"
    :imageOptions="{
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 2
    }"
    :dotsOptions="{
      type: 'extra-rounded', // 'rounded' 'dots' 'square' 'classy' 'classy-rounded' 'extra-rounded'
      color: primaryColor,
      gradient: {
        type: 'linear', // 'linear' 'radial'
        rotation: 0,
        colorStops: [
          { offset: 0, color: primaryColor },
          { offset: 1, color: '#FB7299' }
        ]
      }
    }"
    :cornersSquareOptions="{
      type: 'extra-rounded', // 'dot' 'square' 'extra-rounded'
      color: primaryColor
    }"
    :cornersDotOptions="{
      type: 'dot', // 'dot' 'square'
      color: primaryColor
    }"
    fileExt="png"
  ></QRCodeVue3>
</template>

<script setup name="QRCode">
import { ref, computed } from 'vue'
import QRCodeVue3 from 'qrcode-vue3'
import logo from '@/assets/images/avatar.gif'
import { useGlobalStore } from '@/store/global'

/**
 * 官方文档
 * @tutorial https://github.com/scholtz/qrcode-vue3
 */

const globalStore = useGlobalStore()
const primaryColor = computed(() => globalStore.primary)
</script>

<style>
.publish-qrcode {
  display: block;
}
</style>
