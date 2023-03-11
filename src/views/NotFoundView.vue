<template>
	<TheGame
		:questions="[
			{
				question: 'Хотите сыграть в викторину?',
				left: 'Да',
				right: 'Нет',
				incorrect: 1,
			},
		]"
		:show-question-numbers="false"
		@win="goToMain"
		@fail="++counter"
	/>
	<div v-if="counter > 0" class="text-center animate-pulse mt-10">
		UpStream - это игра, где нужно давать
		<span class="font-bold">неправильные</span> ответы на вопросы. Попробуйте ответить "Нет"!
	</div>
</template>

<script setup lang="ts">
import TheGame from '@/components/TheGame.vue'
import { ref } from 'vue'

let counter = ref(0)

function goToMain() {
	window.location.href = '/play'
}
</script>
