<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"
import ActionsTable from "~/components/tables/ActionsTable.vue"

const props = defineProps({
	actions: {
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
		<LoadingHolder v-if="isLoading" title="Loading actions.." />

		<ActionsTable v-if="actions.length > 0" :actions="actions" />
		
		<EmptyHolder v-else-if="!isLoading" title="This transaction doesn't contain any action" />
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
