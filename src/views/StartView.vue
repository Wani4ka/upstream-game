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
import { useCheckpointsModifier } from '@/composables/useCheckpointsModifier'

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

const parseNumber = (input: string, name: string, int?: boolean, min?: number, max?: number) => {
	const answer = parseInt(input)
	if (isNaN(answer) || !isFinite(answer))
		throw new Error(`invalid ${name}`)
	if (int !== undefined && Math.floor(answer) !== answer)
		throw new Error(`${name} should be an integer`)
	if (min !== undefined && answer < min)
		throw new Error(`${name} should be no less than ${min}`)
	if (max !== undefined && answer > max)
		throw new Error(`${name} should be no more than ${max}`)
	return answer
}

const getCheckpointsModifier = useCheckpointsModifier()

function parseParams() {
	if (route.query.gm) {
		game.mode = route.query.gm as string
		if (!modes.data[game.mode])
			throw new Error(`Invalid game mode, possible values are ${Object.keys(modes.data)}`)
	}
	if (route.query.qs) {
		questionsAmount.value = parseNumber(route.query.qs as string, 'questions amount', true, 1)
	}
	if (route.query.cp) {
		game.checkpointsPeriod = parseNumber(route.query.cp as string, 'checkpoints period', true, 0, Math.floor(questionsAmount.value / 2))
	}
	game.time = Math.round(modes.modifyTime(questionsAmount.value * 11.9047619048, game.mode) * getCheckpointsModifier(game.checkpointsPeriod, questionsAmount.value))
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
