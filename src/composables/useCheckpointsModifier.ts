const getCheckpointsModifier = (checkpoints: number, questions: number) => {
	if (!checkpoints)
		return 1
	return 0.5 + 0.375 * (checkpoints - 1) / Math.floor(questions / 2 - 1)
}
export const useCheckpointsModifier = () => {
	return getCheckpointsModifier
}
