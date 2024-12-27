/** Services */
import { useServerURL } from "@/services/config"

export const fetchHead = async () => {
	try {
		const data = await $fetch(`${useServerURL()}/head`)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchConstants = async () => {
	try {
		const data = await $fetch(`${useServerURL()}/constants`)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchAssets = async ({ limit, offset, sort_by, sort }) => {
	try {

		const url = new URL(`${useServerURL()}/asset`)

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort_by) url.searchParams.append("sort_field", sort_by)
		if (sort) url.searchParams.append("sort", sort)
		
		const data = await $fetch(url.href)

		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchEnums = async () => {
	try {
		const data = await $fetch(`${useServerURL()}/enums`)
		return data
	} catch (error) {
		console.error(error)
	}
}
