<template>
	<div class="flex flex-row flex-wrap max-w-full gap-y-1 justify-center mt-5">
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
				'text-slate-500': index > max+1,
			}"
		><div v-if="index === current" class="z-10 absolute w-[4px] bg-blue-100 h-full"/>{{ from + index - 1 }}</span>
	</div>
</template>

<script setup lang="ts">
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
	customState: String
})

let shouldApplyCustomState = (index:number): boolean => !!props.customState && index === props.current
</script>