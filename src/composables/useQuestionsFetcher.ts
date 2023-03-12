import type { QuestionCategory } from "@/declarations/category"
import type { ParsedGameQuestion, SerializedGameQuestion } from "@/declarations/question"
import type { QuestionSet } from "@/declarations/set"

export type ParserFunction = (questions: SerializedGameQuestion[], params?: FetchParams) => ParsedGameQuestion[] | undefined

export type FetchParams = {
	parser?: ParserFunction
	maxQuestions?: number
}

export type IdentifiedContainer = { id: string }
export type MappedContainer<T> = { [id: string]: T }
export type ParsedContainer<T> = MappedContainer<T & {id: string}>

export const useQuestionsFetcher = () => {
	const defaultParser: ParserFunction = (data, params) => {
		let result: ParsedGameQuestion[] = []
		// step 1. shuffle
		let count = data.length
		for (let i = 0; i < count; ++i) {
			let first: number = Math.floor(Math.random() * count)
			let second: number = Math.floor(Math.random() * count)
			let tmp = data[first]
			data[first] = data[second]
			data[second] = tmp
		}
		// step 2. select no more than 21, and swap left and right randomly
		count = Math.min(count, params?.maxQuestions || 21)
		for (let i = 0; i < count; ++i) {
			let left: string, right: string, incorrect: 0 | 1
			;[left, right, incorrect] = [data[i].incorrect, data[i].correct, 0]
			if (Math.random() >= 0.5) {
				;[left, right] = [right, left]
				incorrect = 1
			}
			result.push({
				question: data[i].question,
				left,
				right,
				incorrect,
			})
		}
		return result
	}

	const fetchContainer = async <T>(url: string): Promise<ParsedContainer<T>> => {
		const data = await (await fetch(url)).json() as MappedContainer<T>
		const result: ParsedContainer<T> = {}
		for (const key in data) {
			result[key] = {
				id: key,
				...data[key]
			}
		}
		return result
	}

	const fetchCategories = async (url: string): Promise<ParsedContainer<QuestionCategory>> => fetchContainer<QuestionCategory>(url)
	const fetchSets = async (url: string): Promise<ParsedContainer<QuestionSet>> => fetchContainer<QuestionSet>(url)

	const fetchQuestions = (url: string, params?: FetchParams): Promise<ParsedGameQuestion[]> => {
		const wrappedParser: ParserFunction = (data) => {
			if (!(params && params.parser))
				return defaultParser(data, params)
			const custom = params.parser(data, params)
			return custom !== undefined ? defaultParser(data, params) : custom
		}
		return new Promise((resolve, reject) => {
			fetch(url)
			.then((resp) => resp.json())
			.then((data) => {
				const result = wrappedParser(data.questions)
				if (result === undefined) {
					reject(Error('Couldn\t parse questions even with a default parser'))
				} else resolve(result)
			})
			.catch(reject)
		})
	}
	return { fetchCategories, fetchSets, fetchQuestions }
}
