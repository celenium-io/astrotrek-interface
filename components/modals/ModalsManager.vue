<script setup>
import ConstantsModal from "./ConstantsModal.vue"
import RawDataModal from "./RawDataModal.vue"

/**
 * Store
 */
import { useModalsStore } from "@/store/modals"
const modalsStore = useModalsStore()
</script>

<template>
	<ConstantsModal :show="modalsStore.modals.constants" @onClose="modalsStore.close('constants')" />
	<RawDataModal :show="modalsStore.modals.rawData" @onClose="modalsStore.close('rawData')" />
</template>
