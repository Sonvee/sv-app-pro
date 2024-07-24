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
import { ref, computed } from 'vue'

const props = defineProps({
	file: {
		type: Object
	}
})

const emits = defineEmits(['update:file'])

const files = computed({
	get() {
		return props.file
	},
	set(val) {
		console.log('files', val)
		emits('update:file', val[0])
	}
})

function selectFile(e) {
	emits('update:file', e.tempFiles[0].file)
}
</script>

<style lang="scss"></style>
