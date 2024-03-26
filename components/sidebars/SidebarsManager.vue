<script setup>
/** Sidebars */
import BlockSidebar from "./BlockSidebar.vue"
import RollupSidebar from "./RollupSidebar.vue";
import TxSidebar from "./TxSidebar.vue"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()
</script>

<template>
	<BlockSidebar :show="sidebarsStore.sidebars.block" :block="sidebarsStore.entity" @onClose="sidebarsStore.close('block')" />
	<RollupSidebar :show="sidebarsStore.sidebars.rollup" :rollup="sidebarsStore.entity" @onClose="sidebarsStore.close('rollup')" />
	<TxSidebar :show="sidebarsStore.sidebars.tx" :tx="sidebarsStore.entity" @onClose="sidebarsStore.close('tx')" />
</template>
