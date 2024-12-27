/** Services */
import { useServerURL } from "@/services/config"

export const fetchAccounts = async ({ asset, limit, offset, sort = "desc" }) => {
	try {
		const url = new URL(`${useServerURL()}/address`)

		if (asset) url.searchParams.append("asset", asset)
		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountByHash = async (hash) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountTransactions = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/txs`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountActions = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/actions`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountFees = async ({hash, limit, offset}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/fees`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountRollups = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/rollups`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountBridgeRoles = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/roles`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAccountDeposits = async ({hash, limit, offset, sort}) => {
	try {
		const url = new URL(`${useServerURL()}/address/${hash}/deposits`)

        if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
