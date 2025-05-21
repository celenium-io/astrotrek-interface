<script setup>
/** Services */
import { formatBytes } from "@/services/utils"

const props = defineProps({
	bytes: {
		type: Array,
	},
	hex: {
		type: Array,
	},
	cursor: {
		type: Number,
	},
	range: {
		type: Object,
	},
	size: {
		type: Number,
	},
})
const emit = defineEmits(["onSelect", "onCursorSelect"])

const viewerEl = ref()
const scrollbarEl = useTemplateRef("scrollbarEl")

const scrollOffset = ref(0)

const isSelecting = ref(false)

const onKeydown = (e) => {
	if (e.code === "Escape") {
		emit("onSelect", [null, null])
	}

	if (e.code === "PageUp") {
		e.preventDefault()
		scrollOffset.value = 0
		emit("onCursorSelect", 0)
	}

	if (e.code === "PageDown") {
		e.preventDefault()
		scrollOffset.value = props.hex.length - 32
		emit("onCursorSelect", props.bytes.length)
	}

	if (e.code === "ArrowUp" && !e.metaKey) {
		emit("onCursorSelect", props.cursor - 16)
	} else if (e.code === "ArrowUp" && e.metaKey) {
		if (scrollOffset.value === 0) return
		if (scrollOffset.value - 16 < 0) {
			scrollOffset.value = 0
		} else {
			scrollOffset.value -= 16
		}
	}

	if (e.code === "ArrowDown" && !e.metaKey) {
		emit("onCursorSelect", props.cursor + 16)
	} else if (e.code === "ArrowDown" && e.metaKey) {
		if (scrollOffset.value + 33 > props.hex.length) return
		if (scrollOffset.value + 16 > props.hex.length - 32) {
			scrollOffset.value = props.hex.length - 32
		} else {
			scrollOffset.value += 16
		}
	}

	if (e.code === "ArrowLeft") {
		emit("onCursorSelect", props.cursor - 1)
	}

	if (e.code === "ArrowRight") {
		emit("onCursorSelect", props.cursor + 1)
	}
}

onMounted(() => {
	document.addEventListener("keydown", onKeydown)
})

onBeforeUnmount(() => {
	document.removeEventListener("keydown", onKeydown)
})

const onScroll = (e) => {
	e.preventDefault()

	let delta = Number(`${e.deltaY < 0 ? "-" : ""}${Math.max(1, Math.round(Math.abs(e.deltaY) / 2))}`)

	if (delta === 0) return
	if (delta > 15) delta = 15
	if (props.hex.length <= 32) return

	if (delta > 0) {
		if (scrollOffset.value + delta + 32 > props.hex.length) {
			scrollOffset.value = props.hex.length - 32
			return
		}
	} else {
		if (scrollOffset.value + delta < 0) {
			scrollOffset.value = 0
			return
		}
	}
	scrollOffset.value += delta
}

const onMouseEnter = (e) => {
	viewerEl.value.wrapper.addEventListener("wheel", onScroll)
}

const onMouseLeave = (e) => {
	isSelecting.value = false
	viewerEl.value.wrapper.removeEventListener("wheel", onScroll)
}

const startPos = ref(0)
const onTouchStart = (e) => {
	startPos.value = e.touches[0].clientY
}
const onTouchMove = (e) => {
	if (props.hex.length <= 32) return

	e.preventDefault()

	if (e.changedTouches[0].clientY - startPos.value < 0) {
		if (scrollOffset.value + 1 <= props.hex.length - 32) {
			scrollOffset.value += 1
		} else {
			scrollOffset.value = props.hex.length - 32
		}
	} else {
		if (scrollOffset.value - 1 >= 0) {
			scrollOffset.value -= 1
		} else {
			scrollOffset.value = 0
		}
	}
}

/** Multi-select */
const startOfSelection = ref()
const isMultiSelecting = ref(false)
const onPointerDown = (idx) => {
	isSelecting.value = true

	const relativeIdx = idx + scrollOffset.value * 16
	startOfSelection.value = relativeIdx
}
const onPointerUp = (idx) => {
	isSelecting.value = false

	const relativeIdx = idx + scrollOffset.value * 16

	if (isMultiSelecting.value) {
		isMultiSelecting.value = false
		emit("onSelect", [startOfSelection.value, relativeIdx])
	} else {
		emit("onCursorSelect", relativeIdx)
	}
}
const onByteSelect = (idx) => {
	if (!isSelecting.value) {
		hoveredByteIdx.value = idx
		return
	}

	isMultiSelecting.value = true

	const relativeIdx = idx + scrollOffset.value * 16
	emit("onSelect", [startOfSelection.value, relativeIdx])
}
const isSelected = (idx) => {
	const relativeIdx = idx + scrollOffset.value * 16
	if (props.range.start === null && props.range.end === null) return
	if (props.range.start <= props.range.end) {
		return relativeIdx >= props.range.start && relativeIdx <= props.range.end
	} else {
		return relativeIdx >= props.range.end && relativeIdx <= props.range.start
	}
}

/** Hover byte */
const hoveredByteIdx = ref(null)
const onPointerLeave = () => {
	hoveredByteIdx.value = null
}

const decode = (byte) => {
	const charCode = parseInt(`0x${byte}`, 16)
	if ((charCode >= 0 && charCode <= 31) || (charCode >= 127 && charCode <= 159)) {
		return "."
	} else {
		return String.fromCharCode.apply(null, new Uint8Array([charCode]))
	}
}

const handleClickScrollbar = (e) => {
	const scrollbarMiddleOffset = 32 / props.hex.length / 2
	const scrollbarHeight = scrollbarEl.value.wrapper.getBoundingClientRect().height
	const offset = e.layerY / scrollbarHeight + scrollbarMiddleOffset
	const result = Math.round(offset * props.hex.length - 32)

	if (result < 0) {
		scrollOffset.value = 0
	} else if (result > props.hex.length - 32) {
		scrollOffset.value = props.hex.length - 32
	} else {
		scrollOffset.value = result
	}
}

const isThumbDraging = ref(false)
const onMoveThumb = (e) => {}
const onStartThumbDraging = () => {
	isThumbDraging.value = true
	document.addEventListener("pointermove", onMoveThumb)
	document.addEventListener("pointerup", clearThumbDraging)
}
const clearThumbDraging = () => {
	isThumbDraging.value = false
	document.removeEventListener("pointermove", onMoveThumb)
	document.removeEventListener("pointerup", clearThumbDraging)
}
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" justify="between" :class="$style.top">
			<Flex align="center" gap="8">
				<Icon name="hex" size="16" color="brand" />
				<Text size="12" weight="700" color="primary" mono>Hex Viewer</Text>
			</Flex>

			<Text size="12" color="tertiary" mono>Cursor: {{ cursor }}</Text>
		</Flex>

		<Flex
			ref="viewerEl"
			@mouseenter="onMouseEnter"
			@mouseleave="onMouseLeave"
			@pointerleave="onPointerLeave"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			justify="between"
			:class="$style.viewer"
		>
			<Flex direction="column" :class="$style.data">
				<Flex :class="$style.row">
					<Text size="14" weight="500" color="support" mono :class="$style.row_id">&nbsp;&nbsp;&nbsp;</Text>

					<Text
						v-for="columnIdx in 16"
						size="14"
						weight="500"
						color="tertiary"
						mono
						:class="[$style.column_id, columnIdx === 8 && $style.margin]"
					>
						{{ (columnIdx - 1).toString(16).padStart(2, "0") }}
					</Text>

					<Text size="14" weight="500" color="tertiary" mono :class="$style.label">ASCII</Text>
				</Flex>
				<Flex v-for="rowIdx in Math.min(hex.length, 32)" :class="$style.row">
					<Text size="14" weight="500" color="tertiary" mono :class="$style.row_id">
						{{ (rowIdx - 1 + scrollOffset).toString(16).padStart(2, "0") }}0
					</Text>
					<Text
						v-for="(byte, byteIdx) in hex[rowIdx - 1 + scrollOffset]
							.concat(Array(16 - hex[rowIdx - 1 + scrollOffset].length))
							.fill(null, hex[rowIdx - 1 + scrollOffset].length, 16)"
						@pointerenter="() => onByteSelect((rowIdx - 1) * 16 + byteIdx)"
						@pointerdown="() => onPointerDown((rowIdx - 1) * 16 + byteIdx)"
						@pointerup="() => onPointerUp((rowIdx - 1) * 16 + byteIdx)"
						size="14"
						weight="500"
						color="primary"
						mono
						:class="[
							$style.byte,
							byte == '00' && $style.empty,
							cursor === (rowIdx - 1) * 16 + byteIdx + scrollOffset * 16 && $style.cursor,
							hoveredByteIdx === (rowIdx - 1) * 16 + byteIdx && $style.hover,
							byteIdx === 7 && $style.margin,
							isSelected((rowIdx - 1) * 16 + byteIdx) && $style.selected,
						]"
					>
						{{ byte }}
					</Text>

					<Text
						v-for="(byte, byteIdx) in hex[rowIdx - 1 + scrollOffset]"
						@pointerenter="() => onByteSelect((rowIdx - 1) * 16 + byteIdx, bytes[idx + scrollOffset * 16])"
						size="14"
						weight="600"
						color="tertiary"
						mono
						:class="[
							$style.char,
							parseInt(`0x${byte}`, 16) >= 32 && parseInt(`0x${byte}`, 16) <= 126 && $style.highlight,
							hoveredByteIdx === (rowIdx - 1) * 16 + byteIdx && $style.hover,
							byteIdx === 0 && $style.margin,
							isSelected((rowIdx - 1) * 16 + byteIdx) && $style.selected,
						]"
					>
						{{ decode(byte) }}
					</Text>
				</Flex>
			</Flex>

			<Flex v-if="hex.length > 32" @click="handleClickScrollbar" ref="scrollbarEl" justify="center" :class="$style.scrollbar">
				<div
					@pointerdown="onStartThumbDraging"
					:style="{ height: `${(32 * 100) / hex.length}%`, top: `${(scrollOffset * 100) / hex.length}%` }"
					:class="$style.thumb"
				/>
			</Flex>
		</Flex>

		<Flex align="center" justify="between" :class="$style.bottom">
			<Text size="12" color="tertiary" mono>{{ formatBytes(size) }}</Text>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	height: fit-content;
	border-radius: 8px;
	background: var(--card-background);
	box-shadow: 0 0 0 1px var(--op-10);
	overflow: hidden;

	user-select: none;
}

.top {
	height: 32px;

	background: var(--app-background);
	border-radius: 8px;

	padding: 0 8px;
}

.viewer {
	flex: 1;
}

.data {
	padding: 12px 0 12px 12px;
}

.row {
	& .row_id {
		text-transform: uppercase;
		line-height: 18px;

		margin-right: 8px;
	}

	& .column_id {
		width: 24px;
		line-height: 18px;

		text-transform: uppercase;
		text-align: center;

		&.margin {
			margin-right: 4px;
		}
	}

	& .byte {
		width: 24px;
		line-height: 18px;

		text-align: center;
		text-transform: uppercase;

		transition: none;

		&.hover {
			background: var(--darken-orange);
		}

		&.empty {
			color: var(--txt-support);
		}

		&.margin {
			margin-right: 4px;
		}

		&.cursor {
			background: var(--op-15);

			animation: blink 2s infinite;
			animation-timing-function: unset;
		}

		&.selected {
			background: var(--darken-orange);
		}
	}

	& .char {
		width: 12px;
		line-height: 18px;

		text-align: center;

		transition: none;

		&.highlight {
			color: var(--txt-primary);
		}

		&.margin {
			margin-left: 8px;
		}

		&.hover {
			background: var(--darken-orange);
		}

		&.selected {
			background: var(--darken-orange);
		}
	}

	& .label {
		line-height: 18px;

		margin-left: 8px;
	}
}

@keyframes blink {
	0% {
		box-shadow: inset 0 -4px 0 -2px var(--hexedit-marker-cursor-blink-background, transparent);
	}

	50% {
		box-shadow: inset 0 -4px 0 -2px var(--hexedit-marker-cursor-blink-background, #fff);
	}

	100% {
		box-shadow: inset 0 -4px 0 -2px var(--hexedit-marker-cursor-blink-background, transparent);
	}
}

.labels {
}

.label {
	min-width: 24px;

	text-align: center;
	line-height: 22px;

	text-transform: uppercase;

	&:nth-child(8) {
		margin-right: 6px;
	}
}

.row_labels {
	margin-top: 22px;
}

.row_label {
	line-height: 20px;
	text-transform: uppercase;
}

.ascii_preview {
	display: flex;
	flex-wrap: wrap;

	max-width: 176px;

	& span {
		width: 11px;
		max-width: 11px;
		max-height: 20px;

		line-height: 20px;
		text-align: center;

		&.selected {
			color: var(--txt-primary);
			background: var(--op-5);
		}
	}
}

.scrollbar {
	position: relative;

	width: 16px;
	overflow: hidden;

	background: var(--app-background);

	margin-left: 8px;
}

.thumb {
	position: absolute;

	width: 8px;
	height: 10px;

	background: var(--op-20);
	cursor: pointer;

	&:hover {
		background: var(--op-50);
	}
}

.bottom {
	background: var(--app-background);

	padding: 10px 12px;
}

@media (max-width: 720px) {
	.label {
		font-size: 10px;
	}

	.row_id {
		display: none;
	}

	.row {
		& .column_id {
			font-size: 10px;
			width: 16px;
		}

		& .byte {
			font-size: 10px;
			width: 16px;

			&.margin {
				margin: 0;
			}
		}

		& .char {
			font-size: 10px;
			width: 8px !important;
		}
	}

	.data {
		padding: 4px 0 4px 4px;
	}

	.bottom {
		& span {
			font-size: 10px;
		}
	}
}
</style>
