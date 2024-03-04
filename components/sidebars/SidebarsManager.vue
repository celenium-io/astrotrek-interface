<script setup>
/** Sidebars */
import BlockSidebar from "./BlockSidebar.vue"
import TxSidebar from "./TxSidebar.vue"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()
</script>

<template>
	<BlockSidebar :show="sidebarsStore.sidebars.block" @onClose="sidebarsStore.close('block')" />
	<TxSidebar :show="sidebarsStore.sidebars.tx" @onClose="sidebarsStore.close('tx')" />
</template>
