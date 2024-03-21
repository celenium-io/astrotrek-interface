<script setup>
import TransactionsTable from "~/components/tables/TransactionsTable.vue"
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"

const props = defineProps({
	txs: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
		default: false,
	}
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading transactions . ." />

		<TransactionsTable v-if="txs.length > 0" :txs="txs" />

		<EmptyHolder v-else title="This block doesn't contain any transaction . ." />
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);

	/* padding: 8px 0 8px 0; */
}
</style>
