<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import Timer from '@/components/Timer.vue'
import { ref } from 'vue'
import type {
	SerializedGameQuestion,
	ParsedGameQuestion,
} from '@/declarations/question'

let questions = ref<ParsedGameQuestion[]>([])
let paused = ref(true)

let process = (data: SerializedGameQuestion[]): ParsedGameQuestion[] => {
	let result: ParsedGameQuestion[] = []
	// step 1. shuffle
	let count = data.length
	for (let i = 0; i < count; ++i) {
		let first: number = Math.floor(Math.random() * count)
		let second: number = Math.floor(Math.random() * count)
		let tmp = data[first]
		data[first] = data[second]
		data[second] = tmp
	}
	// step 2. select no more than 21, and swap left and right randomly
	count = Math.min(count, 21)
	for (let i = 0; i < count; ++i) {
		let left: string, right: string, incorrect: 0 | 1
		;[left, right, incorrect] = [data[i].incorrect, data[i].correct, 0]
		if (Math.random() >= 0.5) {
			;[left, right] = [right, left]
			incorrect = 1
		}
		result.push({
			question: data[i].question,
			left,
			right,
			incorrect,
		})
	}
	return result
}

fetch('/db.json')
	.then((resp) => resp.json())
	.then((data) => {
		let arr = process(data)
		arr[-1] = {
			'question': 'ggg',
			'left': 'Lets go!',
			'right': 'Nooo',
			'incorrect': 1
		}
		questions.value = arr
	})

let onWin = () => {
	paused.value = true
	alert(
		"Congratulations! That's it for now. Stay tuned for more updates! You can check out the footer for some links.",
	)
}
let failed = false
let onFail = () => {
	if (!failed) {
		alert(
			"Each time you give a correct answer, you'll be sent back to the beginning. Keep giving incorrect answers to win!",
		)
		failed = true
	}
}
</script>

<template>
	<div class="w-full absolute -top-20">
		<Timer class="w-36 h-12 mx-auto" :length="153 * 1000" :paused="paused" />
	</div>
	<TheGame
		v-if="questions.length"
		:start-from="-1"
		:questions="questions"
		:intro="{
			question: `See that timer? Give ${questions.length+1} incorrect answer(s) in a row before the timer runs out in order to win.\nYou can use left/right arrow keys if available.\nAre you ready?`,
			left: 'Yes',
			right: 'No',
			incorrect: 1
		}"
		@win="onWin"
		@fail="onFail"
		@start="paused = false" />
</template>
