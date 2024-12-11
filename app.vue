<script setup>
/** Services */
import Socket from "@/services/api/socket"

/** Components */
import ModalsManager from "@/components/modals/ModalsManager.vue"
import SidebarsManager from "@/components/sidebars/SidebarsManager.vue"

/** API */
import { fetchHead } from "@/services/api/main"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

onMounted(async () => {
	const head = await fetchHead()
	if (head) appStore.lastHead = head

	Socket.init()

	window.onbeforeunload = function () {
		Socket.close()
	}
})
</script>

<template>
	<NuxtLoadingIndicator :height="2" color="#dd5022" />
	<NuxtLayout>
		<NuxtPage />

		<div id="tooltip" />
		<div id="modal" />
		<div id="dropdown" />
		<div id="popover" />

		<ClientOnly>
			<ModalsManager />
			<SidebarsManager />
			<Notifications />
		</ClientOnly>
	</NuxtLayout>
</template>
