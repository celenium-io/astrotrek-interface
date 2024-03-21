<script setup>
const props = defineProps({
	icon: {
		type: String,
		default: 'search',
	},
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: false,
	}
})
</script>

<template>
	<Flex direction="column" align="center" justify="center" gap="12" :class="$style.wrapper">
		<Icon :name="icon" size="20" color="tertiary"></Icon>
		<Text size="14" color="secondary"> {{ title }} </Text>
		<Text v-if="subtitle" size="14" color="tertiary"> {{ subtitle }} </Text>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	/* box-shadow: inset 0 0 0 1px var(--op-5); */
	/* background: var(--op-8); */

	padding: 12px 0 12px 0;
}
</style>
