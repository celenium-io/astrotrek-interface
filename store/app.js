import { useModalsStore } from "./modals"

export const useAppStore = defineStore("app", () => {
	const modalsStore = useModalsStore()

	const head = ref()

	const latestBlocks = ref([])
	const lastHead = ref({})
	const isLatestBlocksLoaded = ref(false)
	const isPaused = ref(false)

	const theme = ref("")

	const showNavigation = ref(false)

	const confirmation = ref(null)
	const createConfirmation = (metadata) => {
		confirmation.value = metadata

		modalsStore.open("confirmation")
	}

	return { head, latestBlocks, lastHead, isPaused, isLatestBlocksLoaded, theme, showNavigation, confirmation, createConfirmation }
})
