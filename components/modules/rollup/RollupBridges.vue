<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "@/components/shared/LoadingHolder.vue"
import BridgesTable from "~/components/tables/BridgesTable.vue"

const props = defineProps({
	bridges: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	}
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading bridges.." />

		<BridgesTable v-if="bridges.length > 0" :isLoading="isLoading" :bridges="bridges" />

		<EmptyHolder v-else-if="!isLoading" title="This rollup is not associated with any bridge" />
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
