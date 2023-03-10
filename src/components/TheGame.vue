<template>
	<div class="container p-6 md:min-w-[700px]">
		<GameQuestion v-if="currentQuestion < questions.length">
			<span v-if="showQuestionNumbers">{{ currentQuestion + 1 }}. </span
			>{{ questions[currentQuestion].question }}
		</GameQuestion>
		<GameOptions
			v-if="currentQuestion < questions.length"
			ref="options"
			:left="questions[currentQuestion].left"
			:right="questions[currentQuestion].right"
			:incorrect="questions[currentQuestion].incorrect"
			@proceed="openQuestion(currentQuestion + 1, 'lime')"
			@fail="openQuestion(0, 'red')"
		></GameOptions>
		<GameProgress
			:custom-state="questionProgressState"
			:max="maxAnswers"
			:current="currentQuestion + 1"
			:from="1"
			:to="questions.length"
			v-if="showQuestionNumbers" />
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
import GameProgress from './GameProgress.vue'
import type { ParsedGameQuestion } from '@/declarations/question'
import { ref } from 'vue'

const props = defineProps({
	questions: {
		type: Array<ParsedGameQuestion>,
		required: true,
	},
	showQuestionNumbers: {
		type: Boolean,
		default: true,
	},
})
const emit = defineEmits(['win', 'fail'])
let currentQuestion = ref(0)
let maxAnswers = ref(0)
let questionProgressState = ref('')
let options = ref()

let checkQuestionNum = () => {
	if (currentQuestion.value >= props.questions.length) {
		emit('win')
	} else if (!currentQuestion.value) {
		emit('fail')
	}
}

function openQuestion(val: number, tempState: string = '') {
	questionProgressState.value = tempState
	setTimeout(() => {
		maxAnswers.value = Math.max(maxAnswers.value, currentQuestion.value)
		currentQuestion.value = val
		questionProgressState.value = ''
		options.value.reset()
		checkQuestionNum()
	}, 500)
}
</script>
