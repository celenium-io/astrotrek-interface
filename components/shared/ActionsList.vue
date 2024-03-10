<script setup>
/** Services */
import { capitalize } from "@/services/utils"

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
        default: "13"
    },
    height: {
        type: String,
        default: "160"
    },
    color: {
        type: String,
        default: "tertiary"
    }
})
</script>

<template>
    <Flex align="center" direction="row" gap="4" :class="$style.actions_wrapper">
        <div v-for="a in actions.slice(0, Math.min(actions.length, showNumber))">
            <Text :size="size" :height="height" weight="600" :color="color">
                {{ capitalize(a) }}
            </Text>
        </div>
        <Text
            v-if="actions.length > showNumber"
            :size="size"
            weight="600"
            :color="color"
        >
            ... +{{ actions.length - showNumber }}
        </Text>
    </Flex>
</template>

<style module>
.wrapper {
	width: fit-content;
}

.actions_wrapper {
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
