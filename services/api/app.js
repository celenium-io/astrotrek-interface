/** Services */
import { useServerURL } from "@/services/config"

export const fetchApps = async ({ limit, offset, sort }) => {
	try {
		const url = new URL(`${useServerURL()}/app`)

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAppBySlug = async (slug) => {
	try {
		const url = new URL(`${useServerURL()}/app/${slug}`)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}
