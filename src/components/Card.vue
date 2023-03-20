<template>
	<div class="rounded-lg p-3 flex flex-col" :class="{'soft': !customBg}">
		<div class="mt-2" v-if="!!$slots.header">
			<slot name="header"/>
		</div>
		<div class="overflow-x-hidden overflow-y-auto h-full space-y-1">
			<slot/>
		</div>
		<div class="mt-2" v-if="!!$slots.footer">
			<slot name="footer"/>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	customBg: Boolean
})
</script>