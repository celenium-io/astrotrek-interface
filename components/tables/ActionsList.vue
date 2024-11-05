<script setup>
/** UI */
import Tooltip from "~/components/ui/Tooltip.vue"

/** Services */
import { getActionDescription, getActionTitle, getAssetName } from "@/services/utils/actions.js"
import { spaces } from "@/services/utils"

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
			<Flex align="center" justify="between" wide :class="$style.title_wrapper">
				<Flex align="center" gap="8" :class="$style.title">
					<Icon name="action" size="12" color="secondary" />

					<Text size="12" weight="600" color="primary"> {{ getActionTitle(act.type) }} </Text>
				</Flex>

				<Tooltip v-if="act.fee" side="left">
					<Text size="12" weight="500" color="tertiary" :class="$style.fee"> {{ `${spaces(act.fee.amount)} ${getAssetName(act.fee.asset)}` }} </Text>

					<template #content>
						<Flex align="start" direction="column" gap="4">
							<Text size="12" weight="500" color="tertiary"> Action fee: </Text>
							<Text size="12" weight="500" color="tertiary"> {{ `${spaces(act.fee.amount)} ${getAssetName(act.fee.asset)}` }} </Text>
						</Flex>
					</template>
				</Tooltip>
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
	min-width: 70%;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.fee {
	max-width: 100px;

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
