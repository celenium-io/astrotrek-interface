<script setup>
const props = defineProps({
	modelValue: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	protected: { type: Boolean, default: false },
	color: { type: String, default: "var(--brand)" },
})
const emit = defineEmits(["update:modelValue"])

const toggle = () => {
	if (props.disabled || props.protected) return

	emit("update:modelValue", !props.modelValue)
}
</script>

<template>
	<div
		@click="toggle"
		:class="[$style.wrapper, modelValue && $style.active]"
		:style="{ background: modelValue ? props.color : '' }"
		tabindex="1"
	>
		<div v-if="!disabled" :class="[$style.slider, modelValue && $style.active]" />

		<div v-else :class="$style.lock">
			<Icon name="lock" size="12" />
		</div>
	</div>
</template>

<style module>
.wrapper {
	position: relative;

	min-width: 32px;
	height: 18px;

	background: var(--op-10);
	border-radius: 50px;
	cursor: pointer;

	transition: all 0.2s ease;
}

.wrapper:focus {
	/* box-shadow: rgba(10, 222, 113, 30%) 0px 0px 0px 3px; */
	outline: none;
}

.slider {
	position: absolute;
	top: 4px;
	left: 4px;

	width: 10px;
	height: 10px;

	background: rgba(255, 255, 255, 0.9);
	border-radius: 50px;

	transition: all 0.1s ease;
}

.lock {
	display: flex;
	align-items: center;
	justify-content: center;

	height: 100%;

	cursor: not-allowed;
}

.lock svg {
	fill: var(--txt-primary);
}

.wrapper.active {
	background: var(--brand);
}

.wrapper.active .slider {
	left: 16px;
}

.wrapper:active .slider {
	width: 14px;
}

.wrapper.active:active .slider {
	width: 12px;
}
</style>
