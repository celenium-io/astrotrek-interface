/** Services */
import { useServerURL } from "@/services/config"

export const fetchQuotes = async () => {
	try {
		const url = new URL(`${useServerURL()}/price`)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchQuote = async ({ pair }) => {
	try {
		const url = new URL(`${useServerURL()}/price/${pair}`)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchQuotesSeries = async ({ pair, timeframe, from, to }) => {
	try {
		const url = new URL(`${useServerURL()}/price/${pair}/${timeframe}`)

		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("to", to)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
