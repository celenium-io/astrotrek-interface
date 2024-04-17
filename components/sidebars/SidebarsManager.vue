<script setup>
/** Sidebars */
import AccountSidebar from "./AccountSidebar.vue"
import BlockSidebar from "./BlockSidebar.vue"
import RollupSidebar from "./RollupSidebar.vue";
import TxSidebar from "./TxSidebar.vue"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()
</script>

<template>
	<AccountSidebar :show="sidebarsStore.sidebars.account" :account="sidebarsStore.entity" @onClose="sidebarsStore.close('account')" />
	<BlockSidebar :show="sidebarsStore.sidebars.block" :block="sidebarsStore.entity" @onClose="sidebarsStore.close('block')" />
	<RollupSidebar :show="sidebarsStore.sidebars.rollup" :rollup="sidebarsStore.entity" @onClose="sidebarsStore.close('rollup')" />
	<TxSidebar :show="sidebarsStore.sidebars.tx" :tx="sidebarsStore.entity" @onClose="sidebarsStore.close('tx')" />
</template>
