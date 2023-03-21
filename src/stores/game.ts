import { useQuestionsFetcher, type FetchParams } from '@/composables/useQuestionsFetcher'
import type { ParsedGameQuestion } from '@/declarations/question'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
	const name = ref('')
	const questions = ref<ParsedGameQuestion[]>([])
	const checkpointsPeriod = ref(0)
	const mode = ref('classic')
	const time = ref(250)

	const fetcher = useQuestionsFetcher()

	function setName(newName: string) {
		name.value = newName
	}
	function setList(newList: ParsedGameQuestion[]) {
		questions.value = newList
	}
	async function fetchList(url: string, params?: FetchParams) {
		setList(await fetcher.fetchQuestions(url, params))
	}

	return { name, questions, checkpointsPeriod, mode, time, setName, setList, fetchList }
})
