<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import Timer from '@/components/Timer.vue'
import { ref } from 'vue'
import Swal, { type SweetAlertOptions } from 'sweetalert2'
import { useQuestionsStore } from '@/stores/questions'
import { useGreeting } from '@/composables/useGreeting'

const questions = useQuestionsStore()
const paused = ref(true)
const confirmed = useGreeting()
const game = ref()

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

function lose() {
	if (game.value) {
		game.value.lock()
	}
	alert('К сожалению, вы не справились до конца таймера :( Обновите страницу, чтобы сыграть заново.')
}
</script>

<template>
	<div v-if="confirmed">
		<div class="w-full absolute -top-36 select-none">
			<div class="text-center text-2xl text-white font-medium mb-10">
				{{ questions.name }}
			</div>
			<Timer class="w-36 h-12 mx-auto" :length="253 * 1000" :paused="paused" @complete="lose" />
		</div>
		<TheGame
			ref="game"
			:show-intro="true"
			@win="onWin"
			@fail="onFail"
			@start="paused = false" />
	</div>
</template>
