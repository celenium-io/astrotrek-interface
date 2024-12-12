<script setup>
/** Composable */
import { useOutside } from "@/composables/outside.js"

let removeOutside = null

const props = defineProps({
	open: {
		type: Boolean,
		default: false,
	},
	width: {
		type: [String, Number],
		default: null,
	},
	height: {
		type: [String, Number],
		default: null,
	},
	side: {
		type: String,
		default: "bottom",
		validator: (value) => {
			return ["right", "bottom", "left"].includes(value)
		},
	},
	position: {
		type: String,
		default: "start",
		validator: (value) => {
			return ["start", "center", "end"].includes(value)
		},
	},
	blockOutside: {
		type: Boolean,
		default: false,
	},
})
const emit = defineEmits(["onClose"])

const triggerEl = ref()
const cardEl = ref()

const popoverStyles = reactive({})

const onClose = () => {
	emit("onClose")
}

const onKeydown = (e) => {
	if (e.code === "Escape") onClose()
}

watch(
	() => props.open,
	() => {
		if (props.open) {
			const triggerRect = triggerEl.value.getBoundingClientRect()

			switch (props.position) {
				case "start":
					popoverStyles.right = `${window.innerWidth - triggerRect.x - triggerRect.width}px`
					break
				case "center":
					popoverStyles.left = `${triggerRect.x - Math.round(props.width / 2) + Math.round(triggerRect.width / 2)}px`
					break
				case "end":
					popoverStyles.left = `${triggerRect.x}px`
					break
			}

			switch (props.side) {
				case "bottom":
					popoverStyles.top = `${triggerRect.y + triggerRect.height + 8}px`
					break
				
				case "right":
					delete popoverStyles.right
					popoverStyles.top = `${triggerRect.top}px`
					popoverStyles.left = `${triggerRect.right + 16}px`
					break
				case "left":
					delete popoverStyles.left
					popoverStyles.top = `${triggerRect.top}px`
					popoverStyles.right = `${window.innerWidth - triggerRect.x + 16}px` //`${triggerRect.left}px`
					break
			}

			// popoverStyles[props.side] = `${props.side === "left" ? triggerRect.x : window.innerWidth - triggerRect.x - triggerRect.width}px`

			document.addEventListener("scroll", onClose)
			document.addEventListener("keydown", onKeydown)

			nextTick(() => {
				removeOutside = useOutside(cardEl.value, onClose)
			})
		} else {
			document.removeEventListener("scroll", onClose)
			document.removeEventListener("keydown", onKeydown)
			removeOutside()
		}
	},
)

watch(
	() => props.blockOutside,
	() => {
		if (props.blockOutside) {
			document.removeEventListener("scroll", onClose)
			document.removeEventListener("keydown", onKeydown)
			removeOutside()
		} else {
			document.addEventListener("scroll", onClose)
			document.addEventListener("keydown", onKeydown)

			nextTick(() => {
				removeOutside = useOutside(cardEl.value, onClose)
			})
		}
	}
)
</script>

<template>
	<Flex>
		<div ref="triggerEl" :style="{width: '100%'}">
			<slot />
		</div>

		<ClientOnly>
			<teleport to="#popover">
				<div v-if="open" :class="$style.canvas" />

				<Transition name="fastfade">
					<div v-if="open" :style="popoverStyles" :class="$style.popover">
						<div ref="cardEl" :style="{ width: `${width}px`, maxHeight: `${height}px` }" :class="$style.card">
							<slot name="content" />
						</div>
					</div>
				</Transition>
			</teleport>
		</ClientOnly>
	</Flex>
</template>

<style module>
.popover {
	position: fixed;
	z-index: 2010;
}

.canvas {
	position: fixed;
	inset: 0;
	z-index: 2005;
}

.card {
	display: flex;
	overflow: hidden;

	border-radius: 6px;
	background: var(--card-background);
	box-shadow: inset 0 0 0 1px var(--op-5), 0 14px 34px rgba(0, 0, 0, 15%), 0 4px 14px rgba(0, 0, 0, 5%);

	padding: 12px;
}
</style>
