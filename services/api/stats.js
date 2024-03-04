/** Services */
import { useServerURL } from "@/services/config"

export const fetchSeries = async ({ table, period, column, from, to }) => {
	try {
		const url = new URL(`${useServerURL()}/stats/series/${table}/${period}`)

		if (column) url.searchParams.append("column", column)
		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("to", to)
		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
