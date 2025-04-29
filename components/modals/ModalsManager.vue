<script setup>
import ChartModal from "./ChartModal.vue"
import ConstantsModal from "./ConstantsModal.vue"
import RawDataModal from "./RawDataModal.vue"

/**
 * Store
 */
import { useModalsStore } from "@/store/modals"
const modalsStore = useModalsStore()
</script>

<template>
    <ChartModal :show="modalsStore.modals.chart" @onClose="modalsStore.close('chart')" />
    <ConstantsModal :show="modalsStore.modals.constants" @onClose="modalsStore.close('constants')" />
    <RawDataModal :show="modalsStore.modals.rawData" @onClose="modalsStore.close('rawData')" />
</template>
