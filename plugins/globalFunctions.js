/** Services */
import { comma, midHash, shortHash, splitAddress } from "@/services/utils"

export default defineNuxtPlugin((nuxtApp) => {

	const getDisplayName = (type, id, entity, slash = true, formatFn) => {
		if (entity?.hash) {
			id = entity.hash
		}

		switch (type) {
			case 'addresses':
				if (entity?.celestials?.name) {
					return entity.celestials.name
				}
				
				return typeof formatFn === 'function'
					? formatFn(id)
					: slash
						? midHash(id)
						: id
			// case 'blocks':
			// 	return comma(id)
			// case 'rollups':
			// 	return getShortNamespaceID(id)
			// case 'txs':
			// 	return slash ? shortHash(id) : id
			default:
				return id
		}
	}

	nuxtApp.provide('getDisplayName', getDisplayName)
})
