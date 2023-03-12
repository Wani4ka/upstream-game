import { useQuestionsFetcher } from '@/composables/useQuestionsFetcher'
import type { QuestionCategory } from '@/declarations/category'
import type { QuestionSet } from '@/declarations/set'
import { defineStore } from 'pinia'
import { computed, ref, reactive, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
	const defaultCategoriesURL = 'https://gist.githubusercontent.com/Wani4ka/e432da083bd900539c01a6ac0f9e67cb/raw/446a6a1be9dcce3268760b5aa7ff427827487f6f/all.json'

	const categories = ref<{[id: string]: QuestionCategory}>({})
	const categoryIds = computed(() => Object.keys(categories.value).sort((a, b) => categories.value[a].name.localeCompare(categories.value[b].name) || categories.value[a].id.localeCompare(categories.value[b].name)))
	const categoryId = ref('')
	const category = computed(() => categories.value[categoryId.value])
	const sets = ref<{[id: string]: QuestionSet}>({})
	const setIds = computed(() => Object.keys(sets.value).sort((a, b) => sets.value[a].name.localeCompare(sets.value[b].name) || sets.value[a].id.localeCompare(sets.value[b].name)))
	const setId = ref('')
	const set = computed(() => sets.value[setId.value])
	const fetching = reactive({
		categories: false,
		sets: false
	})
	const fetcher = useQuestionsFetcher()
	
	fetching.categories = true
	fetcher.fetchCategories(defaultCategoriesURL).then((cats) => categories.value = cats).finally(() => fetching.categories = false)

	function changeCategory(newCategory: string) {
		if (!categories.value[newCategory]) {
			throw new Error(`Category not found, possible values are ${Object.keys(categories)}`)
		}
		categoryId.value = newCategory
	}
	function changeSet(newSet: string) {
		if (!sets.value[newSet]) {
			throw new Error(`Set not found, possible values are ${Object.keys(sets)}`)
		}
		setId.value = newSet
	}

	watch(categoryId, async newCategory => {
		setId.value = ''
		sets.value = {}
		if (!newCategory)
			return
		while (fetching.sets) {} // i'm really sorry for this((
		fetching.sets = true
		try {
			const fetchedSets = await fetcher.fetchSets(category.value.sets_url)
			if (categoryId.value === newCategory)
				sets.value = fetchedSets
		} catch (e) {
			alert(e)
		} finally {
			fetching.sets = false
		}
	})

	return {
		categories, categoryIds, categoryId, category,
		sets, setIds, setId, set,
		changeCategory, changeSet, fetching
	}
})