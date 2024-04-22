<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"
import BlocksTable from "~/components/tables/BlocksTable.vue";

const props = defineProps({
	blocks: {
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
		<LoadingHolder v-if="isLoading" title="Loading blocks.." />

		<BlocksTable v-if="blocks.length > 0" :blocks="blocks" />
		
		<EmptyHolder v-else-if="!isLoading" title="This validator didn't produce any block" />
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}
</style>
