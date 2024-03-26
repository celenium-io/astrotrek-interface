<script setup>
import RawDataModal from "./RawDataModal.vue";
/**
 * Store
 */
import { useModalsStore } from "@/store/modals"
const modalsStore = useModalsStore()
</script>

<template>
    <RawDataModal :show="modalsStore.modals.rawData" @onClose="modalsStore.close('rawData')" />
</template>
