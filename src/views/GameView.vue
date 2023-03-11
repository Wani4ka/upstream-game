<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import Timer from '@/components/Timer.vue'
import { onMounted, ref } from 'vue'
import type {
	SerializedGameQuestion,
	ParsedGameQuestion,
} from '@/declarations/question'
import Swal, { type SweetAlertOptions } from 'sweetalert2'
import { useQuestionsStore } from '@/stores/questions'

const questions = useQuestionsStore()
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
		questions.$patch({ value: process(data.questions) })
	})

let onWin = () => {
	paused.value = true
	alert(
		"Поздравляем! На этом пока все. Заходите позже, чтобы увидеть что-то новое! Внизу сайта также есть хорошая ссылочка.",
	)
}
let failed = false
const failAlert: SweetAlertOptions = {
	position: 'top',
	icon: 'info',
	text: 'За каждый правильный ответ отсчёт вопросов начинается с начала. Отвечайте неправильно, чтобы победить!',
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
	title: '<span style="color:var(--color-heading);">Добро пожаловать в UpStream!</span>',
	html: `
		<div class="space-y-2">
			<p>
				UpStream Game - это аналог викторины от
				<a
					class="underline"
					href="https://www.youtube.com/playlist?list=PLtmHHXWOgWR7iH5lrB2ezGPamn2_H1l7Q"
					target="_blank"
					>WhatIF</a
				>.
			</p>
			<p>
				Если вы хотите внести вклад, перейдите по ссылке внизу сайта.
			</p>
			<p>
				⚠️Этот сайт <i>не связан</i> с WhatIF никоим образом. Проект предоставляется "как есть" без каких-либо гарантий.
			</p>
		</div>
	`,
	confirmButtonText: 'Понятно',
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
	alert('К сожалению, вы не справились до конца таймера :( Обновите страницу, чтобы сыграть заново.')
}
</script>

<template>
	<div v-if="questions.value.length && confirmed" class="w-full absolute -top-20">
		<Timer class="w-36 h-12 mx-auto" :length="253 * 1000" :paused="paused" @complete="lose" />
	</div>
	<TheGame
		v-if="questions.value.length && confirmed"
		ref="game"
		:show-intro="true"
		@win="onWin"
		@fail="onFail"
		@start="paused = false" />
</template>
