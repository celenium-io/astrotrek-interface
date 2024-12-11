/** Vendor */
import { defineStore, acceptHMRUpdate } from "pinia"

/** API */
import { fetchEnums } from "@/services/api/main.js"

/** Constants */
import { defaultEnums } from "@/services/constants/enums.js"

export const useEnumStore = defineStore("enums", () => {
	const enums = ref({
		status: defaultEnums.status,
		actionTypes: defaultEnums.action_type,
	})

	const init = async () => {
		let data = await fetchEnums()

		if (data) {
			enums.value.status = data.status
			enums.value.actionTypes = data.action_type
		}
	}

	return { enums, init }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useEnumStore, import.meta.hot))
}
