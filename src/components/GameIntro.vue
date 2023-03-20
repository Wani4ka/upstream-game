<template>
	<div class="w-[75vw] max-w-4xl mx-auto">
		<GameQuestion>
			<p>Дайте {{ mode === 'downstream' ? 'правильный' : 'неправильный' }} ответ на этот и еще {{ amount }} {{ formatCount(amount, 'вопрос', 'вопросов', 'вопроса') }} подряд до истечения таймера, чтобы победить.</p>
			<p>Вы можете использовать стрелки <font-awesome-icon icon="fa-solid fa-caret-left"/><font-awesome-icon icon="fa-solid fa-caret-right"/> для выбора ответа, если они у вас есть.</p>
			<p>Вы готовы?</p>
		</GameQuestion>
		<GameOptions
			ref="options"
			left="Да"
			right="Нет"
			:incorrect="mode === 'downstream' ? 0 : 1"
			@proceed="succeed"
			@fail="fail"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="0"
			:current="1"
			:from="0"
			:to="amount"
			v-if="showQuestionNumbers" />
	</div>
</template>

<script setup lang="ts">
	import GameQuestion from '@/components/GameQuestion.vue'
	import GameOptions from '@/components/GameOptions.vue'
	import GameProgress from '@/components/GameProgress.vue'
	import { ref } from 'vue'
	import { useCountFormat } from '@/composables/useCountFormat'

	defineProps({
		amount: {
			type: Number,
			required: true
		},
		showQuestionNumbers: {
			type: Boolean,
			default: true
		},
		mode: {
			type: String,
			default: 'classic'
		}
	})

	const emit = defineEmits(['succeed', 'fail'])
	let questionProgressState = ref('')
	let options = ref()
	let { formatCount } = useCountFormat()

	function succeed() {
		emit('succeed')
		questionProgressState.value = 'lime'
	}

	function fail() {
		emit('fail')
		questionProgressState.value = 'red'
		setTimeout(() => {
			questionProgressState.value = ''
			if (options.value) {
				options.value.reset()
			}
		}, 500)
	}
</script>
