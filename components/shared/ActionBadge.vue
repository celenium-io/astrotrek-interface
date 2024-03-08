<script setup>
/** UI */
import Badge from "@/components/ui/Badge.vue"

/** Services */
import { ActionIconMap } from "@/services/constants/actions"
import { capitalize } from "@/services/utils"

defineProps({
	action: {
		type: String,
		required: true,
	},
    size: {
        type: [String, Number],
        default: 13
    },
    height: {
        type: [String, Number],
        default: "20px"
    },
    color: {
        type: String,
        default: "tertiary"
    }
})
</script>

<template>
	<Badge :class="$style.wrapper">
		<Icon
			:name="
				ActionIconMap[action.toLowerCase()]
					? ActionIconMap[action.toLowerCase()]
					: 'tx'
			"
			size="13"
			color="secondary"
		/>

		<Text :size="size" :height="height" weight="600" :color="color" :class="$style.text">
			{{ capitalize(action) }}
		</Text>

		<!-- <Text v-if="types.length > 1" size="12" weight="600" color="primary" :class="$style.badge"> +{{ types.length - 1 }} </Text> -->
	</Badge>
</template>

<style module>
.wrapper {
	width: fit-content;
}

.text {
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
