<script setup>
/** Services */
import { comma } from "@/services/utils"

const props = defineProps({
	text: {
		type: String,
		required: true,
	},
})

const renderText = computed(() => comma(props.text))
const charsLength = computed(() => renderText.value.split("").length)
</script>

<template>
	<Flex :class="$style.chars">
		<template v-for="char in charsLength">
			<div v-if="!isNaN(renderText[char - 1])" :class="$style.char">
				<div :style="{ '--v': parseInt(renderText[char - 1]) }" :class="$style.track">
					<span>9</span>
					<span v-for="num in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]">
						{{ num }}
					</span>
					<span>0</span>
				</div>
			</div>
			<Text v-else size="16" color="tertiary" weight="600"> , </Text>
		</template>
	</Flex>
</template>

<style module>
.chars {
}

.char {
	height: 16px;

	overflow: hidden;
}

.track {
	display: flex;
	flex-direction: column;

	translate: 0 calc((var(--v) + 1) * (16px * -1));
	transition: translate 1.5s
		linear(
			0,
			0.0009 8.51%,
			-0.0047 19.22%,
			0.0016 22.39%,
			0.023 27.81%,
			0.0237 30.08%,
			0.0144 31.81%,
			-0.0051 33.48%,
			-0.1116 39.25%,
			-0.1181 40.59%,
			-0.1058 41.79%,
			-0.0455,
			0.0701 45.34%,
			0.9702 55.19%,
			1.0696 56.97%,
			1.0987 57.88%,
			1.1146 58.82%,
			1.1181 59.83%,
			1.1092 60.95%,
			1.0057 66.48%,
			0.986 68.14%,
			0.9765 69.84%,
			0.9769 72.16%,
			0.9984 77.61%,
			1.0047 80.79%,
			0.9991 91.48%,
			1
		);

	& span {
		font-size: 16px;
		line-height: 1;
		font-weight: 600;

		font-variant: tabular-nums;

		background: linear-gradient(rgba(255, 255, 255, 70%) 50%, rgba(255, 255, 255, 30%));
		background-attachment: fixed;
		background-clip: text;
		color: transparent;
		transform-style: flat;
	}
}
</style>
