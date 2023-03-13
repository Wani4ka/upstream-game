<template>
	<Panel
		:no-center="true"
		:hoverable="true"
		:skew-size="3"
		class="mx-1 cursor-pointer"
		@click="$emit('select')">
		<p class="text-xl text-white w-fit">
			{{ name }}<div v-if="badge" class="inline items-center w-fit px-1 h-fit text-xs text-white bg-yellow-700 rounded-full -top-1 -right-1">{{ badge }}</div>
		</p>
		<p class="leading-none"><slot/></p>
	</Panel>
</template>

<script setup lang="ts">
import Panel from '@/components/Panel.vue'
defineProps({
	selected: Boolean,
	name: String,
	badge: String
})
defineEmits(['select'])
</script>
