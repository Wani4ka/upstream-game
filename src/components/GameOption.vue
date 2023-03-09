<template>
	<div
		class="p-3 basis-1/2 -skew-x-12 border text-center border-blue-800"
		:class="{
			'bg-gradient-to-b': true,
			'via-blue-800 from-blue-700 to-blue-700 ':
				state === 'default' || !state,
			'hover:from-blue-600 hover:to-blue-600':
				hoverable && (state === 'default' || !state),
			'via-yellow-800 from-yellow-700 to-yellow-700':
				state === 'selected',
			'hover:from-yellow-600 hover:to-yellow-600':
				hoverable && state === 'selected',
			'via-lime-800 from-lime-700 to-lime-700': state === 'incorrect',
			'hover:from-lime-600 hover:to-lime-600':
				hoverable && state === 'incorrect',
			'via-red-800 from-red-700 to-red-700': state === 'correct',
			'hover:from-red-600 hover:to-red-600':
				hoverable && state === 'correct',
		}"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
defineProps({
	state: String,
	hoverable: Boolean,
})
</script>
