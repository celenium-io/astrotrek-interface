export const formatBytes = (bytes, decimals = 2, format = "string") => {
	if (!+bytes) return "0 Byte"

	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]

	const i = Math.floor(Math.log(bytes) / Math.log(1024))

	switch (format) {
		case "string":
			return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(dm))} ${sizes[i]}`
		case "number":
			return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm))
		case "unit":
			return sizes[i]
		default:
			return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(dm))} ${sizes[i]}`
	}
}

export const numToPercent = (num) => {
	return (num * 100).toFixed(0) + "%"
}

export const strToHex = (str) => {
	let hex = ""
	for (let i = 0; i < str.length; i++) {
		const charCode = str.charCodeAt(i)
		const hexValue = charCode.toString(16)

		hex += hexValue.padStart(2, "0")
	}
	return hex
}

export const hexToBase64 = (hex) => {
	if (!hex?.length) return ""

	let binary = hex.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('')

	return btoa(binary)
}

export const shortHex = (hex) => {
	if (!hex?.length) return ""

	if (hex.length > 16) {
		return `${hex.slice(0, 4)} ••• ${hex.slice(-4)}`
	} else {
		return hex
	}
}

export const shortHash = (hash) => {
	if (!hash?.length) return ""
	
	if (hash.length > 16) {
		if (hash.startsWith("astria")) {
			return `astria ••• ${hash.slice(-4)}`
		}

		return `${hash.slice(0, 4)} ••• ${hash.slice(-4)}`
	} else {
		return hash
	}
}

export const midHash = (hash) => {
	if (!hash) return ""
	
	if (hash.length > 24) {
		if (hash.startsWith("astria")) {
			return `astria ••• ${hash.slice(-8,-4)} ${hash.slice(-4)}`
		}

		return `${hash.slice(0, 4)} ${hash.slice(4, 8)} ••• ${hash.slice(-8,-4)} ${hash.slice(-4)}`
	} else {
		return hash
	}
}

export const splitAddress = (address, charCount = 4) => {
	if (address.startsWith("astria")) {
		return `astria...${address.slice(-charCount)}`
	}

	return `${address.slice(0, charCount)}...${address.slice(-charCount)}`
}


export const getNetworkName = () => {
	const { hostname } = useRequestURL()

	switch (hostname) {
		case "astrotrek.io":
			return "Mainnet"

		case "dusk.astrotrek.io":
			return "Dusk"

		case "dawn.astrotrek.io":
			return "Dawn"

		case "dev.astrotrek.io":
			return "Development"

		case "localhost":
			return "Local"

		default:
			return "Unknown"
	}
}

export function reverseMapping(obj) {
	const reversedObj = {}
	Object.entries(obj).forEach(([key, value]) => {
		reversedObj[value] = key
	})
	return reversedObj
}

export function isObject(input) {
	return typeof input === 'object' && input !== null && !Array.isArray(input)
}


export const getNativeAsset = () => {
	let network = getNetworkName()

	switch (network) {
		case "Mainnet":
			return "transfer/channel-0/utia"

		default:
			return "nria"
	}
}
