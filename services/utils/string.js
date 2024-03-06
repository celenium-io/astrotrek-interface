export const space = (s) => {
	if (!s.length) return ""
	return s.match(/.{1,4}/g).join(" ")
}

export const capitalize = (s) => {
	if (!s.length) return ""
	return s.charAt(0).toUpperCase() + s.slice(1)
}
