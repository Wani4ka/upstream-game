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
			@proceed="openQuestion(currentQuestion + 1)"
			@fail="openQuestion(0)"
		></GameOptions>
	</div>
</template>

<script setup lang="ts">
import GameQuestion from '@/components/GameQuestion.vue'
import GameOptions from '@/components/GameOptions.vue'
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
let options = ref()

let checkQuestionNum = () => {
	if (currentQuestion.value >= props.questions.length) {
		emit('win')
	} else if (!currentQuestion.value) {
		emit('fail')
	}
}

function openQuestion(val: number) {
	setTimeout(() => {
		currentQuestion.value = val
		options.value.reset()
		checkQuestionNum()
	}, 500)
}
</script>
