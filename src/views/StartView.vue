<template>
	<Card class="w-96 text-center" v-if="!error">
		{{ message }}
	</Card>
	<Card class="w-96 text-red-800 bg-red-400" :custom-bg="true" v-if="error">
		<template #header>
			<p class="font-medium text-xl">Произошла ошибка при загрузке:</p>
		</template>
		{{ error }}
		<template #footer>
			<Panel class="text-slate-300 cursor-pointer" state="correct" :hoverable="true" @click="$router.push('/play')">Настроить новую игру</Panel>
		</template>
	</Card>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Panel from '@/components/Panel.vue'
import { useGameStore } from '@/stores/game'
import { useGameModes } from '@/composables/useGameModes'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()
const game = useGameStore()
const error = ref()
const questionsAmount = ref(21)
const modes = useGameModes()

const message = computed(() => {
	if (!settings.category) {
		return 'Загрузка'
	} else if (!settings.set) {
		return `Загрузка категории "${settings.category.name}"`
	} else if (!game.questions) {
		return `Загрузка вопросов из набора "${settings.category.name}, ${settings.set.name}"`
	} else return 'Все готово! Запуск игры...'
})

function parseParams() {
	if (route.query.gm) {
		game.mode = route.query.gm as string
		if (!modes.data[game.mode])
			throw new Error(`Invalid game mode, possible values are ${Object.keys(modes.data)}`)
	}
	if (route.query.qs) {
		questionsAmount.value = parseInt(route.query.qs as string)
		if (isNaN(questionsAmount.value) || !isFinite(questionsAmount.value) || questionsAmount.value <= 0 || Math.floor(questionsAmount.value) !== questionsAmount.value)
			throw new Error('Invalid questions amount')
	}
	game.time = Math.round(modes.modifyTime(questionsAmount.value * 11.9047619048, game.mode))
}

try {
	parseParams()
} catch (err) {
	error.value = err
}

watch(settings.fetching, newVal => {
	if (newVal.categories || newVal.sets || error.value)
		return
	try {
		if (settings.category) {
			settings.changeSet(route.params.set as string)
			game.fetchList(`https://q.wani4ka.ru/${settings.categoryId}/${settings.setId}.json`, {
				maxQuestions: questionsAmount.value
			}).then(() => {
				game.setName(`${settings.category.name}, ${settings.set.name}`)
				router.push('/play')
			})
		} else {
			settings.changeCategory(route.params.category as string)
		}
	} catch (err) {
		error.value = err
	}
})
</script>
