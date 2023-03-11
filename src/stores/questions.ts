import type { ParsedGameQuestion } from '@/declarations/question'
import { defineStore } from 'pinia'

export const useQuestionsStore = defineStore('questions', {
	state: () => {
		return {
			value: [] as ParsedGameQuestion[]
		}
	}
})
