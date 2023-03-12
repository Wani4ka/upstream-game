import { useQuestionsFetcher, type FetchParams } from '@/composables/useQuestionsFetcher'
import type { ParsedGameQuestion } from '@/declarations/question'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuestionsStore = defineStore('questions', () => {
	const name = ref('')
	const list = ref<ParsedGameQuestion[]>([])

	const fetcher = useQuestionsFetcher()

	function setName(newName: string) {
		name.value = newName
	}
	function setList(newList: ParsedGameQuestion[]) {
		list.value = newList
	}
	async function fetchList(url: string, params?: FetchParams) {
		setList(await fetcher.fetchQuestions(url, params))
	}

	return { name, list, setName, setList, fetchList }
})
