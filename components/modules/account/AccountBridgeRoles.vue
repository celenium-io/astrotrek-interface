<script setup>
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "@/components/shared/LoadingHolder.vue"
import RolesTable from "~/components/tables/RolesTable.vue"

const props = defineProps({
	roles: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	}
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading bridge roles.." />

		<RolesTable v-if="roles.length > 0" :isLoading="isLoading" :roles="roles" />

		<EmptyHolder v-else-if="!isLoading" title="This account has no role" />
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
