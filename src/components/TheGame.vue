<template>
	<div class="w-[75vw] max-w-4xl mx-auto">
		<!-- Fake game to confirm that player is ready -->
		<GameQuestion v-if="intro && introActive"><p v-for="(line, idx) in intro.question.split('\n')" :key="idx">{{ line }}</p></GameQuestion>
		<GameOptions
			v-if="intro && introActive"
			ref="optionsIntro"
			:left="intro.left"
			:right="intro.right"
			:incorrect="intro.incorrect"
			@proceed="start"
			@fail="failIntro"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="0"
			:current="1"
			:from="0"
			:to="questions.length"
			v-if="showQuestionNumbers && intro && introActive" />

		<!-- Real game -->
		<GameQuestion v-if="!(intro && introActive) && currentQuestion < questions.length">
			{{ questions[currentQuestion].question }}
		</GameQuestion>
		<GameOptions
			v-if="!(intro && introActive) && currentQuestion < questions.length"
			ref="options"
			:left="questions[currentQuestion].left"
			:right="questions[currentQuestion].right"
			:incorrect="questions[currentQuestion].incorrect"
			@proceed="answer(true, 'lime')"
			@fail="answer(false, 'red')"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="maxAnswers"
			:current="currentQuestion + 1"
			:from="1"
			:to="questions.length"
			v-if="!(intro && introActive) && showQuestionNumbers" />
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
import GameProgress from './GameProgress.vue'
import type { ParsedGameQuestion } from '@/declarations/question'
import { ref } from 'vue'

const props = defineProps({
	intro: Object as () => ParsedGameQuestion,
	questions: {
		type: Array<ParsedGameQuestion>,
		required: true,
	},
	showQuestionNumbers: {
		type: Boolean,
		default: true,
	},
})
const emit = defineEmits(['win', 'fail', 'start'])
let introActive = ref(true)
let currentQuestion = ref(0)
let maxAnswers = ref(0)
let questionProgressState = ref('')
let options = ref()
let optionsIntro = ref()

let checkQuestionNum = () => {
	if (currentQuestion.value >= props.questions.length) {
		emit('win')
	} else if (!currentQuestion.value) {
		emit('fail')
	}
}

function start() {
	emit('start')
	questionProgressState.value = 'lime'
	setTimeout(() => {
		questionProgressState.value = ''
		introActive.value = false
	}, 3000)
}
function failIntro() {
	emit('fail')
	questionProgressState.value = 'red'
	setTimeout(() => {
		questionProgressState.value = ''
		optionsIntro.value.reset()
	}, 500)
}

function answer(incorrect: boolean, tempState: string = '') {
	questionProgressState.value = tempState
	const nextQuestion = incorrect ? currentQuestion.value + 1 : Math.min(currentQuestion.value, 0)
	setTimeout(() => {
		maxAnswers.value = Math.max(maxAnswers.value, currentQuestion.value)
		currentQuestion.value = nextQuestion
		questionProgressState.value = ''
		options.value.reset()
		checkQuestionNum()
	}, 500)
}

const lock = () => {
	if (optionsIntro.value) {
		optionsIntro.value.lock()
	}
	if (options.value) {
		options.value.lock()
	}
}
defineExpose({ lock })
</script>
