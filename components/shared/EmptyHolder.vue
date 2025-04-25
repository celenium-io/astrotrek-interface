<script setup>
const props = defineProps({
	icon: {
		type: String,
		default: "search",
	},
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: false,
	},
})
</script>

<template>
	<Flex direction="column" align="center" justify="center" gap="12" :class="$style.wrapper">
		<Icon :name="icon" size="16" color="primary" :class="$style.icon_badge" />
		<Text size="13" weight="600" color="tertiary"> {{ title }} </Text>
		<Text v-if="subtitle" size="13" weight="500" color="tertiary"> {{ subtitle }} </Text>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;

	padding: 18px 0 18px 0;
}

.icon_badge {
	box-sizing: content-box;
	border-radius: 8px;
	background: linear-gradient(var(--op-10), var(--op-5));

	padding: 6px;
}
</style>
