<template>
	<div class="container p-6 md:min-w-[700px]">
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

		<!-- Real game -->
		<GameQuestion v-if="!(intro && introActive) && currentQuestion < questions.length">
			<span v-if="showQuestionNumbers">{{ currentQuestion + 1 }}. </span
			>{{ questions[currentQuestion].question }}
		</GameQuestion>
		<GameOptions
			v-if="!(intro && introActive) && currentQuestion < questions.length"
			ref="options"
			:left="questions[currentQuestion].left"
			:right="questions[currentQuestion].right"
			:incorrect="questions[currentQuestion].incorrect"
			@proceed="answer(true)"
			@fail="answer(false)"
		></GameOptions>
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
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
	setTimeout(() => {
		introActive.value = false
	}, 3000)
}
function failIntro() {
	emit('fail')
	setTimeout(() => {
		optionsIntro.value.reset()
	}, 500)
}

function answer(incorrect: boolean) {
	const nextQuestion = incorrect ? currentQuestion.value + 1 : Math.min(currentQuestion.value, 0)
	setTimeout(() => {
		currentQuestion.value = nextQuestion
		options.value.reset()
		checkQuestionNum()
	}, 500)
}
</script>
