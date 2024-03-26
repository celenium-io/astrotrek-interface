<script setup>
/** Services */
import { getActionDescription, getActionTitle } from "@/services/utils/actions.js"

const props = defineProps({
	actions: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" gap="6">
		<Flex v-for="act in actions.slice(0, Math.min(actions.length, 5))" justify="between" align="center" wide :class="$style.action">
			<Flex align="center" gap="8">
				<Icon name="action" size="12" color="secondary" />

				<Text size="12" weight="600" color="primary"> {{ getActionTitle(act) }} </Text>

				<Text size="12" color="tertiary" weight="500" :class="$style.description"> {{ getActionDescription(act) }} </Text>
			</Flex>
		</Flex>

		<Flex v-if="actions.length > 5" align="center" gap="6">
			<Text size="12" weight="500" color="tertiary"> {{ actions.length - 5 }} more.</Text>
			<Text size="12" weight="500" color="support"> View all actions on the transaction page </Text>
		</Flex>
	</Flex>
</template>

<style module>
.action {
	padding: 2px 0;

	transition: all 0.2s ease;
}

.description {
	width: 285px;
	padding-left: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
