<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import Timer from '@/components/Timer.vue'
import { onMounted, ref } from 'vue'
import type {
	SerializedGameQuestion,
	ParsedGameQuestion,
} from '@/declarations/question'
import Swal, { type SweetAlertOptions } from 'sweetalert2'

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

fetch('https://gist.githubusercontent.com/Wani4ka/0ba2c2c48b1ce13a66960991c836474c/raw/4458c27c003c02d05e2463a23346aeff530737a3/s04e23.json')
	.then((resp) => resp.json())
	.then((data) => {
		questions.value = process(data.questions)
	})

let onWin = () => {
	paused.value = true
	alert(
		"Congratulations! That's it for now. Stay tuned for more updates! You can check out the footer for some links.",
	)
}
let failed = false
const failAlert: SweetAlertOptions = {
	position: 'top',
	icon: 'info',
	text: 'Each time you give a correct answer, you\'ll be sent back to the beginning. Keep giving incorrect answers to win!',
	background: 'var(--color-background)',
	color: 'var(--color-text)',
	showConfirmButton: false,
	timer: 3000,
	backdrop: false
}
let onFail = () => {
	if (!failed) {
		Swal.fire(failAlert)
		failed = true
	}
}

let confirmed = ref(false)

const welcomeAlert: SweetAlertOptions = {
	icon: 'info',
	title: '<span style="color:var(--color-heading);">Welcome to UpStream!</span>',
	html: `
		<div class="space-y-2">
			<p>
				UpStream Game is recreation of a quiz by
				<a
					class="underline"
					href="https://www.youtube.com/playlist?list=PLtmHHXWOgWR7iH5lrB2ezGPamn2_H1l7Q"
					target="_blank"
					>WhatIF</a
				>.
			</p>
			<p>
				If you'd like to contribute, check out the GitHub repository in footer. I'm really bad at frontend.
			</p>
			<p>
				⚠️Please note that this website is <i>not</i> affiliated with WhatIF in any way. The project is provided "as is" without warranty of any kind.
			</p>
		</div>
	`,
	confirmButtonText: 'Got it',
	confirmButtonColor: '#1e3a8a',
	backdrop: false,
	background: 'var(--color-background)',
	color: 'var(--color-text)',
}

onMounted(() => {
	Swal.fire(welcomeAlert).then((d:any) => confirmed.value = d.isConfirmed)
})

let game = ref()

function lose() {
	if (game.value) {
		game.value.lock()
	}
	alert('Unfortunately you\'ve lost :( Please refresh the page to play again.')
}
</script>

<template>
	<div v-if="questions.length && confirmed" class="w-full absolute -top-20">
		<Timer class="w-36 h-12 mx-auto" :length="13 * 1000" :paused="paused" @complete="lose" />
	</div>
	<TheGame
		v-if="questions.length && confirmed"
		ref="game"
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
