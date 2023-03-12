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
	<!-- <div
		class="m-[1px] outline outline-1 p-1 select-none cursor-pointer rounded-lg"
		:class="{
			'bg-blue-900 cursor-default': selected,
			'bg-blue-700 hover:bg-blue-800 cursor-pointer': !selected,
		}"
		@click="$emit('select')">
		<p class="text-xl text-white w-fit">
			{{ name }}<div v-if="badge" class="inline items-center w-fit px-1 h-fit text-xs text-white bg-red-500 rounded-full -top-1 -right-1">{{ badge }}</div>
		</p>
		<p class="leading-none"><slot/></p>
	</div> -->
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
