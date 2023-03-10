<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import { onMounted, ref } from 'vue'
import type {
	SerializedGameQuestion,
	ParsedGameQuestion,
} from '@/declarations/question'
import Swal, { type SweetAlertOptions } from 'sweetalert2'

let questions = ref<ParsedGameQuestion[]>([])

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

fetch('https://storage.yandexcloud.net/questions/original/s04e21.json')
	.then((resp) => resp.json())
	.then((data) => {
		questions.value = process(data)
	})

let onWin = () => {
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

let confirmed = ref(false)
const alerts = Swal.mixin({
	background: 'var(--color-background)',
	color: 'var(--color-text)',
})

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
	showDenyButton: true,
	denyButtonText: 'Controls',
	denyButtonColor: '#581c87',
	preConfirm: () => {
		confirmed.value = true
		return true
	},
	preDeny: () => true,
}

const controlsAlert: SweetAlertOptions = {
	icon: 'info',
	title: '<span style="color:var(--color-heading);">Controls</span>',
	html: `
		<div class="space-y-2">
			<p>
				You'll be prompted with a question and two options. You have to answer <i>incorrectly</i> to advance.
			</p>
			<p>
				<span class="font-black">ProTip</span>: When using PC, you can use your arrow keys to answer!
			</p>
		</div>
	`,
	confirmButtonText: 'Got it',
	confirmButtonColor: '#1e3a8a',
	showDenyButton: false,
	preConfirm: () => true,
}

welcomeAlert.preDeny = () => {
	alerts.update(controlsAlert)
	return false
}
controlsAlert.preConfirm = () => {
	alerts.update(welcomeAlert)
	return false
}

onMounted(() => {
	alerts.fire({backdrop: false, ...welcomeAlert})
})
</script>

<template>
	<TheGame v-if="confirmed" :questions="questions" @win="onWin" @fail="onFail" />
</template>
