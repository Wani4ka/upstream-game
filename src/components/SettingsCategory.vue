<template>
	<div>
		<h3 class="text-3xl font-medium mb-2 text-white">{{ title }}</h3>
		<div class="flex flex-col place-items-center space-y-2">
			<slot/>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		title: String
	})
</script>
