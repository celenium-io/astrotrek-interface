/** Services */
import { useServerURL } from "@/services/config"

export const fetchSeries = async ({ name, timeframe, from, to }) => {
	try {
		const url = new URL(`${useServerURL()}/stats/series/${name}/${timeframe}`)

		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("to", to)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchSeriesSummary = async (timeframe) => {
	try {
		const url = new URL(`${useServerURL()}/stats/summary/${timeframe}`)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupSeries = async ({ id, name, timeframe, from, to }) => {
	try {
		const url = new URL(`${useServerURL()}/stats/rollup/series/${id}/${name}/${timeframe}`)

		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("from", to)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchLastSeries = async () => {
	try {
		const url = new URL(`${useRequestURL().origin}/api/series`)

		const data = await $fetch(url.href)

		return data
	} catch (error) {
		console.error(error)
	}
}
