export interface SerializedGameQuestion {
	q: string
	inc: string
	cor: string
}

export interface ParsedGameQuestion {
	question: string
	left: string
	right: string
	incorrect: 0 | 1
}
