<template>
	<div class="grid place-items-center text-center">
		<span
			class="block absolute -inset-2 -skew-x-12 border border-x-8 border-double"
			aria-hidden="true"
			:class="{
				'bg-gradient-to-b': true,
				'via-blue-900 from-blue-700 to-blue-700 border-blue-600':
					state === 'default' || !state,
				'hover:from-blue-600 hover:to-blue-600':
					hoverable && (state === 'default' || !state),
				'via-yellow-900 from-yellow-700 to-yellow-700 border-yellow-600':
					state === 'selected',
				'hover:from-yellow-600 hover:to-yellow-600':
					hoverable && state === 'selected',
				'via-lime-900 from-lime-700 to-lime-700 border-lime-600': state === 'incorrect',
				'hover:from-lime-600 hover:to-lime-600':
					hoverable && state === 'incorrect',
				'via-red-900 from-red-700 to-red-700 border-red-600': state === 'correct',
				'hover:from-red-600 hover:to-red-600':
					hoverable && state === 'correct',
			}"
		></span>
		<span class="relative select-none px-4"><slot /></span>
	</div>
</template>

<script setup lang="ts">
defineProps({
	state: String,
	hoverable: Boolean,
})
</script>
