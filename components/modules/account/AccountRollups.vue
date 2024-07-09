<script setup>
import RollupsTable from "~/components/tables/RollupsTable.vue"
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"

const props = defineProps({
	rollups: {
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
		<LoadingHolder v-if="isLoading" title="Loading rollups.." />

		<RollupsTable v-if="rollups.length > 0" :rollups="rollups" />

		<EmptyHolder v-else-if="!isLoading" title="This account didn't push anything in any rollup" />
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
