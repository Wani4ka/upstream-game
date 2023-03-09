export interface SerializedGameQuestion {
	question: string
	incorrect: string
	correct: string
}

export interface ParsedGameQuestion {
	question: string
	left: string
	right: string
	incorrect: 0 | 1
}
