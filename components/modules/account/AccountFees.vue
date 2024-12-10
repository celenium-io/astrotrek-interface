<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"
import FeesTable from "~/components/tables/FeesTable.vue"

const props = defineProps({
	fees: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading fees.." />

		<FeesTable v-if="fees.length > 0" :fees="fees" />
		
		<EmptyHolder v-else-if="!isLoading" title="This account didn't pay fee" />
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
