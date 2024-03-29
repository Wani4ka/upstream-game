<template>
	<GameIntro
		v-if="showIntro && introActive"
		:amount="questions.length"
		:checkpoints="checkpoints"
		:mode="mode"
		@succeed="start"
		@fail="$emit('fail')" />

	<div v-if="!(showIntro && introActive)" class="w-[75vw] max-w-4xl mx-auto">
		<GameQuestion v-if="currentQuestion < questions.length">{{ questions[currentQuestion].question }}
		</GameQuestion>
		<GameOptions
			v-if="currentQuestion < questions.length"
			ref="options"
			:left="questions[currentQuestion].left"
			:right="questions[currentQuestion].right"
			:incorrect="modes.modifyAnswer(questions[currentQuestion].incorrect, mode)"
			@proceed="answer(true, 'lime')"
			@fail="answer(false, 'red')"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="maxAnswers"
			:checkpoints="checkpoints"
			:current="currentQuestion + 1"
			:from="1"
			:to="questions.length"
			v-if="showQuestionNumbers" />
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
import GameProgress from '@/components/GameProgress.vue'
import type { ParsedGameQuestion } from '@/declarations/question'
import { ref } from 'vue'
import GameIntro from '@/components/GameIntro.vue'
import { useGameModes } from '@/composables/useGameModes'

const props = defineProps({
	showIntro: Boolean,
	questions: {
		type: Array<ParsedGameQuestion>,
		required: true,
	},
	checkpoints: {
		type: Number,
		default: 0,
	},
	showQuestionNumbers: {
		type: Boolean,
		default: true,
	},
	mode: {
		type: String,
		default: 'classic'
	}
})
const emit = defineEmits(['win', 'fail', 'start'])
let introActive = ref(true)
let currentQuestion = ref(0)
let maxAnswers = ref(0)
let questionProgressState = ref('')
let options = ref()
const modes = useGameModes()

let checkQuestionNum = () => {
	if (currentQuestion.value >= props.questions.length) {
		emit('win')
	} else if (!currentQuestion.value) {
		emit('fail')
	}
}

function start() {
	emit('start')
	setTimeout(() => {
		introActive.value = false
	}, 3000)
}

const snapToCheckpoint = (current: number) => {
	if (!props.checkpoints)
		return 0
	return props.checkpoints * Math.floor(current / props.checkpoints)
}

function answer(incorrect: boolean, tempState: string = '') {
	questionProgressState.value = tempState
	const nextQuestion = incorrect ? currentQuestion.value + 1 : snapToCheckpoint(currentQuestion.value)
	setTimeout(() => {
		maxAnswers.value = Math.max(maxAnswers.value, currentQuestion.value)
		currentQuestion.value = nextQuestion
		questionProgressState.value = ''
		options.value.reset()
		checkQuestionNum()
	}, 500)
}

const lock = () => {
	if (options.value) {
		options.value.lock()
	}
}
defineExpose({ lock })
</script>
