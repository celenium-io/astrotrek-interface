import { base64Decode, capitalize, capitalizeAndReplaceUnderscore, formatBytes, midHash, strToHex } from "./index.js";
import { getCeleniumLink } from "@/services/constants"

export const getNamespaceID = (rollup) => {
	if (!rollup) return ""

	return getRollupHex(rollup.hash).slice(0, 20)
}

export const getNamespaceLink = (network, namespaceID) => {
	if (!network || !namespaceID) return ""

	let link = getCeleniumLink(network)

	return `${link}namespace/000000000000000000000000000000000000${namespaceID}`
}

export const getRollupHashSafeURL = (rollupHash) => {
	if (!rollupHash) return ""

	let hash = rollupHash
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
	
	return hash
}

export const getRollupHex = (rollupHash) => {
	if (!rollupHash) return ""

	return strToHex(base64Decode(rollupHash))
}
