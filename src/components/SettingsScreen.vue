<template>
	<div class="space-y-3 divide-y divide-slate-500 text-center">
		<SettingsCategory title="Режим игры">
			<SelectableItem
				v-for="modId in Object.keys(modes.data)"
				:key="modId"
				:name="modes.data[modId].name"
				:selected="mode === modId"
				@select="$emit('update:mode', modId)"
			>{{ modes.data[modId].desc }}</SelectableItem>
		</SettingsCategory>
		<SettingsCategory title="Вопросы">
			<label for="steps-range" class="w-[100%] text-sm font-medium text-white text-left">Количество вопросов</label>
			<div class="w-full place-items-left">
				<input id="steps-range" type="range" :value="amount" @input="updateAmount" :min="1" :max="set.size" :step="1" class="w-[calc(100%-3.5rem)] h-2 rounded-lg appearance-none cursor-pointer bg-gray-700">
				<input type="number" :min="1" :max="set.size" :value="amount" @input="updateAmount" :step="1" class="ml-2 bg-transparent border-b rounded px-1 w-12">
				<p class="text-center">Времени на игру: <span class="font-medium">{{ minutes }}:{{ `0${seconds}`.slice(-2) }}</span></p>
			</div>
		</SettingsCategory>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, type PropType } from 'vue'
import SelectableItem from './SelectableItem.vue'
import SettingsCategory from './SettingsCategory.vue'
import type { QuestionCategory } from '@/declarations/category'
import type { QuestionSet } from '@/declarations/set'
import { useGameModes } from '@/composables/useGameModes'

const props = defineProps({
	category: {
		type: Object as PropType<QuestionCategory>,
		required: true
	},
	set: {
		type: Object as PropType<QuestionSet>,
		required: true
	},
	mode: String,
	time: Number,
	amount: {
		type: Number,
		default: 21
	}
})
const emit = defineEmits(['update:mode', 'update:time', 'update:amount'])

const updateAmount = (event: any) => emit('update:amount', parseInt(event.target.value))

const modes = useGameModes()
const compTime = computed(() => Math.round(modes.modifyTime(props.amount * 11.9047619048, props.mode)))
const minutes = computed(() => Math.floor(compTime.value / 60))
const seconds = computed(() => compTime.value % 60)

watch(compTime, newVal => emit('update:time', newVal))

</script>
