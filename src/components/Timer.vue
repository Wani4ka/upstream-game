<template>
	<div class="grid place-items-center">
		<span class="z-10 w-full text-center text-white text-semibold text-3xl tabular-nums select-none">
			<span class="text-4xl font-bold">{{ Math.floor(tweened.number / 60000) }}:{{ `0${Math.floor(tweened.number / 1000 % 60)}`.slice(-2) }}</span>.{{ `0${Math.floor(tweened.number % 1000 / 10)}`.slice(-2) }}
		</span>
		<svg class="absolute top-0 left-0 w-full h-full">
			<linearGradient id="main" x1="0" x2="0" y1="0" y2="1">
				<stop v-for="(step, index) in timerColors[color()].main" :key="index" :stop-color="step" :offset="`${index / (timerColors[color()].main.length-1) * 100}%`"></stop>
			</linearGradient>
			<linearGradient id="background" x1="0" x2="0" y1="0" y2="1">
				<stop v-for="(step, index) in timerColors[color()].background" :key="index" :stop-color="step" :offset="`${index / (timerColors[color()].background.length-1) * 100}%`"></stop>
			</linearGradient>
			<rect x="2" y="2" rx="20" ry="20" :width="`calc(100% - 4px)`" height="calc(100% - 4px)"
			fill="url(#background)" />
			<rect x="2" y="2" rx="20" ry="20" :width="`calc(${tweened.number / length * 100}% - 4px)`" height="calc(100% - 4px)"
			fill="url(#main)" />
			<rect x="2" y="2" rx="20" ry="20" width="calc(100% - 4px)" height="calc(100% - 4px)"
				:stroke="timerColors[color()].stroke"
				stroke-width="2"
				fill="none" />
		</svg>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
	paused: {
		type: Boolean,
		default: false
	},
	forceColor: {
		type: String,
		default: ''
	},
	length: {
		type: Number,
		required: true
	}
})

const emit = defineEmits(['complete'])

interface ColorScheme {
	main: string[]
	background: string[]
	stroke: string
}

const timerColors: { [k: string]: ColorScheme } = {
	blue: {
		main: ['#2563eb', '#1d4ed8', '#2563eb'],		// blue 600-700-600
		background: ['#075985', '#0c4a6e', '#075985'],	// sky 800-900-800
		stroke: '#164e63'								// cyan 900
	},
	yellow: {
		main: ['#ca8a04', '#a16207', '#ca8a04'],		// yellow 600-700-600
		background: ['#92400e', '#78350f', '#92400e'],	// amber 800-900-800
		stroke: '#7c2d12'								// cyan 900
	},
	red: {
		main: ['#dc2626', '#b91c1c', '#dc2626'],		// red 600-700-600
		background: ['#9f1239', '#881337', '#9f1239'],	// rose 800-900-800
		stroke: '#831843'								// ping 900
	},
}
let tweened = reactive({
	number: 0
})
let tween: any

onMounted(() => {
	tweened.number = props.length
	tween = gsap.to(tweened, {
		duration: Math.floor(props.length / 1000),
		number: 0,
		ease: 'none',
		onComplete: () => emit('complete')
	})
	if (props.paused) {
		tween.pause()
	}
})
watch(() => props.paused, (val: boolean) => {
	if (val) {
		tween.pause()
	} else {
		tween.play()
	}
})

let color = () => {
	if (props.forceColor) {
		return props.forceColor
	}
	if (tweened.number > props.length * 0.5) {
		return 'blue'
	}
	if (tweened.number > props.length * 0.25) {
		return 'yellow'
	}
	return 'red'
}
</script>