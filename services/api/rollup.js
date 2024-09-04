/** Services */
import { useServerURL } from "@/services/config"

export const fetchRollups = async ({ limit, offset, sort = "desc" }) => {
	try {
		const url = new URL(`${useServerURL()}/rollup`)

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupByHash = async (hash) => {
	try {
		const url = new URL(`${useServerURL()}/rollup/${hash}`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupActions = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/rollup/${hash}/actions`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupAddresses = async ({hash, limit, offset}) => {
	try {
		const url = new URL(`${useServerURL()}/rollup/${hash}/addresses`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupBridges = async ({ hash, limit, offset }) => {
	try {
		const url = new URL(`${useServerURL()}/rollup/${hash}/bridges`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
