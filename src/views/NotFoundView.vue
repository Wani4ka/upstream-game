<template>
	<Game
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
import Game from '@/components/Game.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

let counter = ref(0)
const router = useRouter()

function goToMain() {
	router.push('/play')
}
</script>
