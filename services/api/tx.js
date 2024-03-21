/** Services */
import { useServerURL } from "@/services/config"

export const fetchTransactions = async ({ limit, offset, sort, sort_by, action_types, status }) => {
	try {
		const url = new URL(`${useServerURL()}/tx`)

		if (action_types) url.searchParams.append("action_types", action_types)
		if (status) url.searchParams.append("status", status)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)
		if (sort_by) url.searchParams.append("sort_by", sort_by)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchLatestTransactions = async () => {
	try {
		const url = new URL(`${useServerURL()}/tx`)

        url.searchParams.append("limit", 5)
		url.searchParams.append("sort", 'desc')

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTransactionsByBlock = async ({ limit, offset, sort, height, from, status, action_types }) => {
	try {
		const url = new URL(`${useServerURL()}/tx`)

		url.searchParams.append("height", height)
		if (status) url.searchParams.append("status", status)
		if (action_types) url.searchParams.append("action_types", action_types)
		if (from) url.searchParams.append("from", from)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTxsCount = async () => {
	try {
		const url = new URL(`${useServerURL()}/tx/count`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTxByHash = async (hash) => {
	try {
		const url = new URL(`${useServerURL()}/tx/${hash}`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTxActions = async ({hash, limit, offset}) => {
	try {
		const url = new URL(`${useServerURL()}/tx/${hash}/actions`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
