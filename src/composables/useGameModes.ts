import type { MappedContainer } from "@/declarations/container"

type AnsFunction = (correct: 0 | 1) => (0 | 1)

export type Mode = {
	id: string
	name: string
	summary: string
	desc?: string
	firstFailMsg: string
	timerMul: number
	ansFunc?: AnsFunction
}

export const useGameModes = () => {

	const data: MappedContainer<Mode> = {
		classic: {
			id: 'classic',
			name: 'Классический',
			summary: 'Дайте неправильный ответ',
			desc: 'Ответьте неправильно на все вопросы подряд до конца таймера',
			firstFailMsg: 'За каждый правильный ответ отсчёт вопросов начинается с ближайшего чекпойнта. Отвечайте неправильно, чтобы победить!',
			timerMul: 1
		},
		downstream: {
			id: 'downstream',
			name: 'DownStream',
			summary: 'Дайте правильный ответ',
			desc: 'Ответьте ПРАВИЛЬНО на все вопросы подряд до конца таймера',
			firstFailMsg: 'За каждый неправильный ответ отсчёт вопросов начинается с ближайшего чекпойнта. Отвечайте правильно, чтобы победить!',
			ansFunc: x => 1 - x as (0 | 1),
			timerMul: 0.75
		},
	}

	const modifyTime = (t: number, mode: string | undefined) => t * (mode && data[mode] ? data[mode].timerMul : 1)
	const modifyAnswer = (ans: (0 | 1), mode: string | undefined): (0 | 1) => (mode && data[mode] && data[mode].ansFunc ? (data[mode].ansFunc as AnsFunction)(ans) : ans)

	return { data, modifyTime, modifyAnswer }
}
