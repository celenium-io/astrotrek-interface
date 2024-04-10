<script setup>
/** Services */
import { capitalize } from "@/services/utils"
import { getActionTitle } from "@/services/utils/actions.js"

defineProps({
	actions: {
		type: Array,
		required: true,
	},
	showNumber: {
		type: Number,
		default: 2,
	},
	size: {
		type: String,
		default: "12",
	},
	height: {
		type: String,
		default: "100",
	},
	color: {
		type: String,
		default: "secondary",
	},
})

// const getActionTitle = (actionType) => {
// 	console.log(actionType.split('_'));
// 	let title
// 	actionType.split('_').forEach((el) => title+=)

// 	return actionType
// }

</script>

<template>
	<Flex align="center" direction="row" gap="4" :class="$style.wrapper">
		<Flex v-for="a in actions.slice(0, Math.min(actions.length, showNumber))">
			<Text :size="size" :height="height" weight="600" :color="color">
				{{ capitalize(getActionTitle(a)) }}
			</Text>
		</Flex>

		<Text v-if="actions.length > showNumber" size="11" weight="700" color="tertiary" :class="$style.test">
			{{ actions.length - showNumber }} more
		</Text>
	</Flex>
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
