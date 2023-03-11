export function useCountFormat() {
	function formatCount(amount: number, single: string, plural: string, plural2to4 = plural): string {
		amount = Math.floor(Math.abs(amount))
		let lastTwo = amount % 100
		if (lastTwo > 10 && lastTwo < 20) {
			return plural2to4
		}
		let lastOne = amount % 10
		if (lastOne == 1) {
			return single
		}
		if (lastOne >= 2 && lastOne <= 4) {
			return plural2to4
		}
		return plural
	}
	return { formatCount }
}
