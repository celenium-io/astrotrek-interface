<script setup>
/** Services */
import { getActionDescription, getActionTitle } from "@/services/utils/actions.js"

const props = defineProps({
	actions: {
		type: Array,
	},
	number: {
		type: Number,
	},
})
</script>

<template>
	<Flex direction="column" gap="8">
		<Flex v-for="act in actions.slice(0, Math.min(actions.length, 5))" direction="column" align="center" gap="4" wide :class="$style.action">
			<Flex align="center" gap="8" :class="$style.title_wrapper">
				<Icon name="action" size="12" color="secondary" />

				<Text size="12" weight="600" color="primary" :class="$style.title"> {{ getActionTitle(act.type) }} </Text>
			</Flex>

			<Flex align="center" :class="$style.description_wrapper">
				<Text size="12" color="tertiary" weight="500" :class="$style.description"> {{ getActionDescription(act) }} </Text>
			</Flex>
		</Flex>

		<Flex v-if="number > 5" align="center" justify="center" gap="6">
			<Text size="12" weight="500" color="support">
				View
				<Text color="tertiary"> {{ number - 5 }} more </Text>
				actions on the transaction page
			</Text>
		</Flex>
	</Flex>
</template>

<style module>
.action {
	max-width: 380px;

	align-items: start;

	padding: 2px 0;

	transition: all 0.2s ease;
}

.title_wrapper {
	max-width: 100%;
}

.title {
	width: 100%;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.description_wrapper {
	max-width: 100%
}
.description {
	width: 100%;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
