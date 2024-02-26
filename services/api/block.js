/** Services */
import { useServerURL } from "@/services/config"

export const fetchBlocks = async ({ limit, offset }) => {
	try {
		const url = new URL(`${useServerURL()}/block`)

		url.searchParams.append("stats", true)
		url.searchParams.append("sort", "desc")

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchBlocksCount = async () => {
	try {
		const url = new URL(`${useServerURL()}/block/count`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchLatestBlocks = async () => {
	try {
		const url = new URL(`${useServerURL()}/block`)

		url.searchParams.append("stats", true)
		url.searchParams.append("sort", "desc")
		url.searchParams.append("limit", 5)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchBlockByHeight = async (height) => {
	try {
		const data = await useFetch(`${useServerURL()}/block/${height}?stats=true`)

		return data
	} catch (error) {
		console.error(error)
	}
}
