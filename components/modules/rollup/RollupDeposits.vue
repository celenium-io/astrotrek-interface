<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "@/components/shared/LoadingHolder.vue"
import DepositsTable from "~/components/tables/DepositsTable.vue"

const props = defineProps({
	deposits: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	}
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading deposits.." />

		<DepositsTable v-if="deposits.length > 0" :isLoading="isLoading" :deposits="deposits" />

		<EmptyHolder v-else-if="!isLoading" title=" This rollup did not wire any deposits" />
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
