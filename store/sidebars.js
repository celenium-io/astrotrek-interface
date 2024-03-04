/**
 * Vendor
 */
import { defineStore, acceptHMRUpdate } from "pinia"

export const useSidebarsStore = defineStore("sidebars", () => {
	const sidebars = reactive({
		block: false,
		tx: false,
	})

	const open = (target) => {
		if (!sidebars[target]) {
			sidebars[target] = true
		} else {
			sidebars[target] = false
		}
	}

	const close = (target) => {
		if (!sidebars[target]) return

		sidebars[target] = false
	}

	return { sidebars, open, close }
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSidebarsStore, import.meta.hot))
}
