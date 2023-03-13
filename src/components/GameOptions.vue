<template>
	<div class="flex flex-row space-x-10 mt-3">
		<Panel
			class="basis-1/2"
			:class="{ 'cursor-pointer': !confirmed }"
			:hoverable="!confirmed"
			:state="states[0].value"
			@mousedown.left.prevent="press(0)"
			@mouseup.left.prevent="press(0)"
			>{{ left }}</Panel
		>
		<Panel
			class="basis-1/2"
			:class="{ 'cursor-pointer': !confirmed }"
			:hoverable="!confirmed"
			:state="states[1].value"
			@mousedown.left.prevent="press(1)"
			@mouseup.left.prevent="press(1)"
			>{{ right }}</Panel
		>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Panel from '@/components/Panel.vue'

const props = defineProps({
	left: String,
	right: String,
	incorrect: Number,
})
const emit = defineEmits(['proceed', 'fail'])

let selected = ref(-1)
let confirmed = ref(false)
let locked = ref(false)

const reset = () => {
	locked.value = false
	selected.value = -1
	confirmed.value = false
	processClasses()
}
const lock = () => {
	locked.value = true
	confirmed.value = true
	processClasses()
}
defineExpose({ reset, lock })

watch(confirmed, (val: boolean) => {
	if (!val || locked.value) {
		return
	}
	emit(selected.value === props.incorrect ? 'proceed' : 'fail')
})

let states = [ref('default'), ref('default')]

function processClasses() {
	if (selected.value === -1) {
		states[0].value = 'default'
		states[1].value = 'default'
		return
	}
	if (!confirmed.value) {
		states[selected.value].value = 'selected'
		states[1 - selected.value].value = 'default'
		return
	}
	states[selected.value].value =
		selected.value === props.incorrect ? 'incorrect' : 'correct'
	states[1 - selected.value].value = 'default'
}

function press(direction: number) {
	if (confirmed.value) {
		return
	}
	if (selected.value === direction) {
		confirmed.value = true
	} else {
		selected.value = direction
	}
	processClasses()
}

let keydownHandler = (evt: KeyboardEvent): void => {
	if (evt.key == 'ArrowLeft') {
		press(0)
		evt.preventDefault()
	} else if (evt.key == 'ArrowRight') {
		press(1)
		evt.preventDefault()
	}
}

onMounted(() => window.addEventListener('keydown', keydownHandler))
onUnmounted(() => window.removeEventListener('keydown', keydownHandler))
</script>
