<template>
	<GameIntro
		v-if="showIntro && introActive"
		:amount="questions.length"
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
			v-if="showQuestionNumbers" />
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
import GameProgress from '@/components/GameProgress.vue'
import type { ParsedGameQuestion } from '@/declarations/question'
import { ref, computed } from 'vue'
import GameIntro from '@/components/GameIntro.vue'
import { useQuestionsStore } from '@/stores/questions'

const props = defineProps({
	showIntro: Boolean,
	customQuestions: {
		type: Array<ParsedGameQuestion>,
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
const storedQuestions = useQuestionsStore()

let questions = computed((): ParsedGameQuestion[] => props.customQuestions || storedQuestions.list)

let checkQuestionNum = () => {
	if (currentQuestion.value >= questions.value.length) {
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
	if (options.value) {
		options.value.lock()
	}
}
defineExpose({ lock })
</script>
