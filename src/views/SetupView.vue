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

		<div class="space-y-2">
			<div class="text-center">
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

			<div v-if="activeScreen === Windows.Settings">
				<p class="text-center">Скоро тут будут настройки!</p>
			</div>
		</div>

		<template #footer v-if="activeScreen === Windows.Settings">
			<Panel
				class="mx-3"
				:class="{
					'cursor-pointer': !launchBtnPressed,
					'cursor-default': launchBtnPressed,
				}"
				:hoverable="!launchBtnPressed"
				@click="launch"
				:state="launchBtnPressed ? 'incorrect' : 'default'"
			>Запустить</Panel>
		</template>
	</Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import Panel from '@/components/Panel.vue'
import { ref, computed } from 'vue'
import BreadcrumbItem from '@/components/BreadcrumbItem.vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
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
const questions = useQuestionsStore()
const launchBtnPressed = ref(false)
const confirmed = useGreeting()

function selectCategory(idx: string) {
	settings.changeCategory(idx)
	activeScreen.value = Windows.Sets
}

function selectSet(idx: string) {
	settings.changeSet(idx)
	activeScreen.value = Windows.Settings
}

function launch() {
	launchBtnPressed.value = true
	questions.fetchList(`https://q.wani4ka.ru/${settings.categoryId}/${settings.setId}.json`).then(() => {
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
