<template>
  <uni-file-picker
    v-bind="$attrs"
    v-model="files"
    mode="grid"
    fileMediatype="image"
    :limit="1"
    :auto-upload="false"
    @select="selectFile"
  />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  file: {
    type: [Object, String]
  }
})

const emits = defineEmits(['update:file'])

const files = ref(props.file)

function selectFile(e) {
  console.log('==== selectFile :', e)
  emits('update:file', files.value)
}
</script>

<style lang="scss"></style>
