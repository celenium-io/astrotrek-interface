<script setup>
// import ActionsTable from "~/components/tables/ActionsTable.vue"

const props = defineProps({
	actions: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Text size="13" height="140" color="tertiary">{{ actions }}</Text>
		<!-- <ActionsTable :actions="actions" /> -->
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
