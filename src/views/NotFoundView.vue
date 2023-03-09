<template>
	<TheGame
		:questions="[
			{
				question: 'Looks like you\'re lost.\nDo you wanna play a game?',
				left: 'Yes',
				right: 'No',
				incorrect: 1,
			},
		]"
		:show-question-numbers="false"
		@win="goToMain"
		@fail="++counter"
	></TheGame>
	<div v-if="counter > 0" class="text-center animate-pulse">
		UpStream is a game where you have to give
		<span class="font-bold">incorrect</span> answer to questions. Try to
		answer "No"!
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
