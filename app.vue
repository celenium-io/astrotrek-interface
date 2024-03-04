<script setup>
/** Components */
import ModalsManager from "@/components/modals/ModalsManager.vue"
import SidebarsManager from "@/components/sidebars/SidebarsManager.vue"
</script>

<template>
	<NuxtLoadingIndicator :height="2" color="#dd5022" />
	<NuxtLayout>
		<NuxtPage />

		<div id="tooltip" />
		<div id="modal" />
		<div id="dropdown" />

		<ClientOnly>
			<ModalsManager />
			<SidebarsManager />
			<Notifications />
		</ClientOnly>
	</NuxtLayout>
</template>
