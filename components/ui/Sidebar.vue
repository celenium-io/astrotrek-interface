<script setup>
/**
 * Composable
 */
import { useOutside } from "@/composables/outside"

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["onClose"])

const sidebar = ref()
let removeOutside = null

const handleClose = () => {
	emit("onClose")
}

const onKeydown = (e) => {
	if (e.code === "Escape") handleClose()
}

watch(
	() => props.show,
	() => {
		if (props.show) {
			nextTick(() => {
				removeOutside = useOutside(sidebar.value.wrapper, () => {
					handleClose()
				})
			})

			window.addEventListener("keydown", onKeydown)
		} else {
			if (removeOutside) {
				removeOutside()
			}

			window.removeEventListener("keydown", onKeydown)
		}
	},
)
</script>

<template>
	<Transition name="sidebar">
		<Flex v-if="show" ref="sidebar" :class="$style.wrapper">
			<slot />

			<Icon @click="handleClose()" name="close" size="16" color="secondary" :class="$style.close_icon" />
		</Flex>
	</Transition>
</template>

<style module>
.wrapper {
	position: relative;

	width: 420px;

	position: fixed;
	top: 16px;
	right: 16px;
	bottom: 16px;

	border-radius: 12px;
	background: var(--card-background);
	box-shadow: inset 0 0 0 1px var(--op-5);

	padding: 20px;
}

.close_icon {
	position: absolute;
	top: 24px;
	right: 24px;
	box-sizing: content-box;

	border-radius: 5px;
	cursor: pointer;

	padding: 4px;

	transition: all 0.1s ease;

	&:hover {
		background: var(--op-5);
	}
}
</style>
