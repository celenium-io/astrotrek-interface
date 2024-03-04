export const shortHash = (hash) => {
	if (hash.length > 16) {
		return `${hash.slice(0, 4)} ••• ${hash.slice(-4)}`
	} else {
		return hash
	}
}
