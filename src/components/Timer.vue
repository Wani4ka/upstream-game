<template>
	<div class="bg-blue-500 max-w-[150px] text-center text-white text-medium text-3xl rounded-full p-2">
		{{ Math.floor(tweened.number / 60000) }}:{{ `0${Math.floor(tweened.number / 1000)}`.slice(-2) }}.{{ `0${Math.floor(tweened.number % 1000 / 10)}`.slice(-2) }}
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import gsap from 'gsap'
const props = defineProps({
	paused: {
		type: Boolean,
		default: false
	}
})

const delay = 10 * 60 * 1000
let tweened = reactive({
	number: delay
})
let tween: any

onMounted(() => {
	tween = gsap.to(tweened, { duration: Math.floor(delay / 1000), number: 0, ease: 'none' })
})
watch(() => props.paused, (val: boolean) => {
	if (val) {
		tween.pause()
	} else {
		tween.play()
	}
})
</script>