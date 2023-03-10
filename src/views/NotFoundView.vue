<template>
	<TheGame
		:questions="[
			{
				question: 'Do you wanna play a quiz?',
				left: 'Yes',
				right: 'No',
				incorrect: 1,
			},
		]"
		:show-question-numbers="false"
		@win="goToMain"
		@fail="++counter"
	/>
	<div v-if="counter > 0" class="text-center animate-pulse mt-10">
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
