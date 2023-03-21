<template>
	<Card class="h-[75vh] w-[50vw] min-w-[300px]" v-if="confirmed">

		<template #header>
			<nav class="inline-flex mb-4">
			<div class="flex flex-wrap gap-1 items-center md:space-x-3 align-middle">
				<BreadcrumbItem :disabled="activeScreen === Windows.Categories" @click="activeScreen = Windows.Categories" icon="fa-solid fa-home" :first="true">
					UpStream Game
				</BreadcrumbItem>
				<BreadcrumbItem v-if="activeScreen !== Windows.Categories" :disabled="activeScreen === Windows.Sets" @click="activeScreen = Windows.Sets" icon="fa-solid fa-chevron-right">
					{{ settings.category.name }}
				</BreadcrumbItem>
				<BreadcrumbItem v-if="activeScreen === Windows.Settings" :disabled="true" icon="fa-solid fa-chevron-right">
					{{ settings.set.name }}
				</BreadcrumbItem>
			</div>
			</nav>
		</template>

		<div class="space-y-2 flex flex-col place-items-center">
			<div class="text-center" v-if="$refs">
				<p v-if="settings.fetching.categories">Загрузка списка категорий...</p>
				<p v-if="settings.fetching.sets">Загрузка списка вопросов...</p>
				<div class="bg-red-900 border-t border-b border-red-500 px-4 py-3" v-if="isEmpty">
					<p class="font-bold text-white">Кажется, тут пусто...</p>
					<p class="text-sm">Попробуйте вернуться назад.</p>
				</div>
			</div>

			<SelectableItem
				v-if="activeScreen === Windows.Categories"
				v-for="id in settings.categoryIds"
				:key="id"
				:name="settings.categories[id].name"
				:badge="settings.categories[id].size.toString()"
				@select="selectCategory(settings.categories[id].id)"
			>{{ settings.categories[id].desc }}</SelectableItem>

			<SelectableItem
				v-if="activeScreen === Windows.Sets"
				v-for="id in settings.setIds"
				:key="id"
				:name="settings.sets[id].name"
				:badge="settings.sets[id].size.toString()"
				@select="selectSet(settings.sets[id].id)"
			>{{ settings.sets[id].desc }}</SelectableItem>

			<SettingsScreen
				v-model:mode="questions.mode"
				v-model:time="questions.time"
				v-model:amount="questionsAmount"
				:category="settings.category"
				:set="settings.set"
				v-if="activeScreen === Windows.Settings" />
		</div>

		<template #footer v-if="activeScreen === Windows.Settings">
			<div class="flex flex-row gap-1 md:gap-3">
				<Panel class="basis-1/3 cursor-pointer" :hoverable="true" :state="'default'" @click="copyToClipboard">
					Экспортировать
				</Panel>
				<Panel
					class="basis-2/3"
					:class="{
						'cursor-pointer': !launchBtnPressed,
						'cursor-default': launchBtnPressed,
					}"
					:hoverable="!launchBtnPressed"
					@click="launch"
					:state="launchBtnPressed ? 'incorrect' : 'default'"
				>Запустить</Panel>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import Panel from '@/components/Panel.vue'
import { ref, computed } from 'vue'
import BreadcrumbItem from '@/components/BreadcrumbItem.vue'
import SettingsScreen from '@/components/SettingsScreen.vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useSettingsStore } from '@/stores/settings'
import SelectableItem from '@/components/SelectableItem.vue'
import { useGreeting } from '@/composables/useGreeting'

const router = useRouter()

enum Windows {
	Categories,
	Sets,
	Settings,
}

const activeScreen = ref(Windows.Categories)
const settings = useSettingsStore()
const questions = useGameStore()
const launchBtnPressed = ref(false)
const confirmed = useGreeting()
const questionsAmount = ref(21)

function selectCategory(idx: string) {
	settings.changeCategory(idx)
	activeScreen.value = Windows.Sets
}

function selectSet(idx: string) {
	settings.changeSet(idx)
	activeScreen.value = Windows.Settings
}

function copyToClipboard() {
	let url = `${window.location.origin}/start/${settings.categoryId}/${settings.setId}`
	let params = []
	if (questions.mode !== 'classic')
		params.push(['gm', questions.mode])
	if (questionsAmount.value !== 21)
		params.push(['qs', questionsAmount.value])
	if (params) {
		url += `?${params[0][0]}=${params[0][1]}`
		for (let i = 1; i < params.length; ++i)
			url += `&${params[i][0]}=${params[i][1]}`
	}
	navigator.clipboard.writeText(url).then(() => alert('Ссылка на генерацию игры скопирована в буфер обмена!'))
}

function launch() {
	launchBtnPressed.value = true
	questions.fetchList(`https://q.wani4ka.ru/${settings.categoryId}/${settings.setId}.json`, {
		maxQuestions: questionsAmount.value
	}).then(() => {
		questions.setName(`${settings.category.name}, ${settings.set.name}`)
		router.push('/play')
	})
}

const isEmpty = computed(() => {
	switch (activeScreen.value) {
		case Windows.Categories:
			return !settings.fetching.categories && !settings.categories
		case Windows.Sets:
			return !settings.fetching.sets && !settings.sets
		default:
			return false
	}
})
</script>
