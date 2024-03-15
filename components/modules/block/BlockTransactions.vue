<script setup>
import TransactionsTable from "~/components/tables/TransactionsTable.vue"

const props = defineProps({
	txs: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<TransactionsTable :txs="txs" />
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-8);

	padding: 8px 0 8px 0;
}
</style>
