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
