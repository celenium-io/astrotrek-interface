import { base64Decode, strToHex } from "./index.js";
import { getCeleniumLink } from "@/services/constants"

export const getNamespaceID = (rollup) => {
	if (!rollup) return ""

	return getRollupHex(rollup.hash).slice(0, 20)
}

export const getNamespaceLink = (namespaceID) => {
	if (!namespaceID) return ""

	let link = getCeleniumLink()

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
