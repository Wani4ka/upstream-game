<template>
	<div class="flex flex-row flex-wrap max-w-full gap-y-1 justify-center mt-3">
		<span
			v-for="index in (to-from+1)"
			:key="index"
			class="text-center w-[30px]"
			:class="{
				'bg-gradient-to-b': true,
				'via-blue-800 from-blue-700 to-blue-700':
					(!shouldApplyCustomState(index) && index > max) || (shouldApplyCustomState(index) && customState === 'blue'),
				'via-yellow-800 from-yellow-700 to-yellow-700':
					(!shouldApplyCustomState(index) && index >= current && index <= max) || (shouldApplyCustomState(index) && customState === 'yellow'),
				'via-lime-800 from-lime-700 to-lime-700': (!shouldApplyCustomState(index) && index < current) || (shouldApplyCustomState(index) && customState === 'lime'),
				'via-red-800 from-red-700 to-red-700': shouldApplyCustomState(index) && customState === 'red',
				'text-slate-500': index !== current && index > max+1,
			}"
		>
			<span class="w-0.5 z-10 absolute left-0 h-full" v-if="checkpoints && ((from+index-1)-1) % checkpoints === 0" :class="{
				'bg-slate-600': (from+index-1) > current,
				'bg-slate-400': Math.floor((from+index-1) / checkpoints) < Math.floor((current-1) / checkpoints),
				'bg-slate-200': Math.floor((from+index-1) / checkpoints) === Math.floor((current-1) / checkpoints),
			}"></span>
			<font-awesome-icon :icon="['fas', 'chevron-right']" style="--fa-primary-color:#ffffff;--fa-secondary-color:#ffffff;" v-if="index === current" class="z-20 absolute -left-3 h-[125%] -top-[0.1875rem]"/>
			{{ from + index - 1 }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps({
	from: {
		type: Number,
		required: true
	},
	to: {
		type: Number,
		required: true
	},
	current: {
		type: Number,
		required: true
	},
	max: {
		type: Number,
		required: true
	},
	checkpoints: {
		type: Number,
		default: 0
	},
	customState: String
})

watch(() => props.current, val => {
	console.log(Math.floor(val / props.checkpoints))
})

let shouldApplyCustomState = (index:number): boolean => !!props.customState && index === props.current
</script>