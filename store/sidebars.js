/**
 * Vendor
 */
import { defineStore, acceptHMRUpdate } from "pinia"

export const useSidebarsStore = defineStore("sidebars", () => {
	const sidebars = reactive({
		block: false,
		rollup: false,
		tx: false,
	})

	const entity = ref({})

	const open = (target, obj) => {
		if (!sidebars[target]) {
			sidebars[target] = true
			entity.value = obj
		} else {
			sidebars[target] = false
			entity.value = {}
		}
	}

	const close = (target) => {
		if (!sidebars[target]) return

		sidebars[target] = false
		entity.value = {}
	}

	return { entity, sidebars, open, close }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSidebarsStore, import.meta.hot))
}
