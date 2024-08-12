<template>
  <QRCodeVue3
    imgclass="publish-qrcode"
    v-bind="$attrs"
    :qrOptions="{
      typeNumber: 0, // 0 - 40
      mode: 'Byte', // 'Numeric' 'Alphanumeric' 'Byte' 'Kanji'
      errorCorrectionLevel: 'H' // 'L' 'M' 'Q' 'H'
    }"
    :backgroundOptions="{ color: '#ffffff' }"
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
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: primaryColor },
          { offset: 1, color: primaryColor }
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

const globalStore = useGlobalStore()
const primaryColor = computed(() => globalStore.primary)
</script>

<style>
.publish-qrcode {
  display: block;
}
</style>
