<template>
	<div class="flex items-center">
		<font-awesome-icon v-if="icon" :icon="icon" :class="{
			'-top-0.5 align-top text-gray-200': first
		}" />
		<span
			class="text-sm font-medium text-gray-200"
			@click.prevent="onClick"
			:class="{
				'cursor-pointer hover:text-white': !disabled,
				'ml-0.5 md:ml-1': first,
				'ml-1.5 md:ml-3': !first,
			}"
			><slot/>
		</span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	icon: String,
	disabled: Boolean,
	first: Boolean
})
const emit = defineEmits(['click'])
const onClick = () => {
	if (!props.disabled)
		emit('click')
}
</script>
