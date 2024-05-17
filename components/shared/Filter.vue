<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"
import CheckBox from "~/components/ui/CheckBox.vue"
import Popover from "~/components/ui/Popover.vue"

/** Services */
import { capitalize } from "@/services/utils"
import { getActionTitle } from "@/services/utils/actions.js"
import { ActionTypes } from "@/services/constants/actionTypes"

defineProps({
	statuses: {
		type: Object,
		required: false,
	},
	actionTypes: {
		type: Object,
		required: false,
	},
	// showNumber: {
	// 	type: Number,
	// 	default: 2,
	// },
	// size: {
	// 	type: String,
	// 	default: "12",
	// },
	// height: {
	// 	type: String,
	// 	default: "100",
	// },
	// color: {
	// 	type: String,
	// 	default: "secondary",
	// },
})

</script>

<template>
	<Popover width="200">
		<Button size="mini" type="tertiary" :class="$style.extBtn">
			<Icon name="filter" size="24" color="brand" />
			<!-- <Text color="brand">Action Types</Text> -->
		</Button>

		<template #content>
			<Flex direction="column" gap="12">
				<Text size="12" weight="500" color="secondary">Filter by Status</Text>

				<!-- <Flex direction="column" gap="8">
					<Checkbox v-model="filters.status.success">
						<Text size="12" weight="500" color="primary">Success</Text>
					</Checkbox>
					<Checkbox v-model="filters.status.failed">
						<Text size="12" weight="500" color="primary">Failed</Text>
					</Checkbox>
				</Flex> -->

				<Button type="secondary" size="mini" wide>Apply</Button>
			</Flex>
		</template>
	</Popover>
</template>

<style module>
.wrapper {
	text-overflow: ellipsis;
	overflow: hidden;
}

.test {
	box-shadow: inset 0 0 0 1px var(--op-5);
	border-radius: 4px;

	padding: 3px 5px;
}
</style>
