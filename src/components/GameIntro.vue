<template>
	<div class="w-[75vw] max-w-4xl mx-auto">
		<GameQuestion>
			<p>{{ modes.data[mode].summary }} на этот и еще {{ amount }} {{ formatCount(amount, 'вопрос', 'вопросов', 'вопроса') }}{{ checkpoints ? '' : ' подряд' }} до истечения таймера, чтобы победить.</p>
			<p v-if="checkpoints > 0">Чекпойнты расставлены на каждом{{ checkpoints > 1 ? ` ${checkpoints}-м` : '' }} вопросе. Если вы ошибетесь, то {{ checkpoints > 1 ? 'вернетесь к последнему пройденному чекпойнту' : 'будете отвечать на этот же вопрос снова' }}.</p>
			<p v-if="!isMobile()">Вы можете использовать стрелки <font-awesome-icon icon="fa-solid fa-caret-left"/><font-awesome-icon icon="fa-solid fa-caret-right"/> для выбора ответа.</p>
			<p>Вы готовы?</p>
		</GameQuestion>
		<GameOptions
			ref="options"
			left="Да"
			right="Нет"
			:incorrect="modes.modifyAnswer(1, mode)"
			@proceed="succeed"
			@fail="fail"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="0"
			:current="1"
			:from="0"
			:checkpoints="checkpoints"
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
import { useGameModes } from '@/composables/useGameModes'

	defineProps({
		amount: {
			type: Number,
			required: true
		},
		checkpoints: {
			type: Number,
			default: 0
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
	const modes = useGameModes()

	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	}

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
