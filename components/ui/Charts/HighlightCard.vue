<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"
import { useDebounceFn } from "@vueuse/core"

/** UI */
import Button from "@/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

/** Services */
import { abbreviate, formatBytes } from "@/services/utils"

/** API */
import { fetchSeries } from "@/services/api/stats"

const props = defineProps({
	series: {
		type: Object,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
})

const isLoading = ref(false)

const currentTotal = computed(() => currentData.value?.reduce((sum, item) => sum + item.value, 0))
const previousTotal = computed(() => previousData.value?.reduce((sum, item) => sum + item.value, 0))
const totalDiff = computed(() => {
	let diff = currentTotal.value - previousTotal.value
	let side = diff > 0 ? 'rise' : diff < 0 ? 'fall' : 'stay'
	diff = Math.round(Math.abs(diff / (previousTotal.value ? previousTotal.value : 1) * 100))

	return { side: side, diff: diff }
})

const currentData = ref()
const previousData = ref()

// /** Charts */
const chartWrapperEl = ref()
const chartEl = ref()

const buildChart = (chart, data) => {
	const width = chartWrapperEl.value.wrapper.getBoundingClientRect().width
	const height = 30
	const marginTop = 0

	const MAX_VALUE = d3.max(data, (d) => d.value) ? d3.max(data, (d) => d.value) : 1

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => d.date),
		[0, width]
		// [marginLeft, width - marginRight],
	)
	const y = d3.scaleLinear(
		[0, MAX_VALUE],
		[height, marginTop]
	)
	const line = d3
		.line()
		.x((d) => x(d.date))
		.y((d) => y(d.value))


	/** SVG Container */
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "none")
		.attr("style", "max-width: 100%;  height: intrinsic;")
		.style("-webkit-tap-highlight-color", "transparent")

	/** Chart Line */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--brand)")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data.slice(0, data.length)))

	if (chart.children[0]) chart.children[0].remove()
	chart.append(svg.node())
}

const drawChart = async () => {
	buildChart(
		chartEl.value.wrapper,
		props.series.data,
	)
}

const debouncedRedraw = useDebounceFn((e) => {
	drawChart()
}, 500)

onMounted(async () => {
	window.addEventListener("resize", debouncedRedraw)

	drawChart()
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", debouncedRedraw)
})


watch(
	() => props.series.data,
	() => {
		console.log(`${props.series.title} last item:`, props.series.data[props.series.data.length - 1]);
		drawChart()
	},
)

</script>

<template>
	<Flex align="center" :class="$style.card_wrapper">
		<Flex align="center" direction="column" justify="between" :class="[$style.card, active && $style.card_active]">
			<Flex align="start" justify="between" wide>
				<Text size="12" color="secondary"> {{ series.title }} </Text>

				<Flex align="center" gap="2" :style="{ color: 'var(--txt-secondary)' }">
					<Text size="12"> {{ series.summary.diff > 0 ? '+' : series.summary.diff < 0 ? '-' : '' }} </Text>
					<Text size="12"> {{ abbreviate(Math.abs(series.summary.diff), 0) }} </Text>
					<Text size="12">%</Text>
				</Flex>
			</Flex>

			<Flex align="center" justify="between" wide>
				<Text size="20" weight="600" color="primary" :class="$style.diff">
					{{ series.units === 'bytes' ? formatBytes(series.summary.total) : abbreviate(series.summary.total, 2) }}
				</Text>

				<Flex ref="chartWrapperEl" direction="column" :class="$style.chart_wrapper">
					<Flex ref="chartEl" :class="$style.chart" />
				</Flex>
			</Flex>
		</Flex>

	</Flex>
</template>

<style module>
.card_wrapper {
	margin-bottom: 16px;

	background: none;
}

.card {
	min-height: 120px;
	width: 250px;

	cursor: pointer;

	border-radius: 12px;
	overflow: hidden;

	padding: 12px;

	transition: all 0.2s ease;

	&:hover {
		filter: brightness(80%);
		background: var(--card-background);
	}

	&:active {
		scale: 0.98;
	}
}

.card_active {
	background: var(--card-background);
}

.diff {
	padding: 0px 0px 8px 2px;
}

.chart_wrapper {
	width: 90px;
}

.chart {
	& svg {
		overflow: visible;
	}
}
</style>
