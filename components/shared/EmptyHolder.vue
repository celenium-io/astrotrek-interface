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

	padding: 18px 0 18px 0;
}
</style>
