<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"
import { useDebounceFn } from "@vueuse/core"

/** UI */
import Button from "@/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

/** Services */
import { abbreviate, formatBytes, spaces } from "@/services/utils"

/** API */
import { fetchSeries } from "@/services/api/stats"

const props = defineProps({
	series: {
		type: Object,
		required: true,
	},
	period: {
		type: Object,
		required: true,
	},
	active: {
		type: Boolean,
		default: false,
	},
})

const isLoading = ref(false)

const loadSeries = async (period, previous) => {
	isLoading.value = true

	let rawData = await fetchSeries({
		name: props.series.name,
		timeframe: period.timeframe,
		from: parseInt(
			previous
			? DateTime.now().minus({
				days: period.timeframe === "day" ? period.value * 2 : 0,
				hours: period.timeframe === "hour" ? period.value * 2 : 0,
			}).ts / 1_000
			: DateTime.now().minus({
				days: period.timeframe === "day" ? period.value : 0,
				hours: period.timeframe === "hour" ? period.value : 0,
			}).ts / 1_000
		),
		to: parseInt(
			previous
			? DateTime.now().minus({
				days: period.timeframe === "day" ? period.value : 0,
				hours: period.timeframe === "hour" ? period.value : 0,
			}).ts / 1_000
			: ''
		),
	})

	let resultData = []
	let seriesMap = {}
	rawData.forEach((item) => {
		seriesMap[DateTime.fromISO(item.time).toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")] =
			item.value
	})

	for (let i = 1; i < period.value + 1; i++) {
		const dt = previous
			? DateTime.now().minus({
				days: period.timeframe === "day" ? period.value * 2 - i : 0,
				hours: period.timeframe === "hour" ? period.value * 2 - i : 0,
			})
			: DateTime.now().minus({
				days: period.timeframe === "day" ? period.value - i : 0,
				hours: period.timeframe === "hour" ? period.value - i : 0,
			})
		resultData.push({
			date: dt.toJSDate(),
			value: parseInt(seriesMap[dt.toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")]) || 0,
		})
	}

	isLoading.value = false

	return resultData
}

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
	currentData.value = await loadSeries(props.period, false)
	previousData.value = await loadSeries(props.period, true)

	buildChart(
		chartEl.value.wrapper,
		currentData.value,
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
	() => props.period,
	() => {
		drawChart()
	},
)
</script>

<template>
	<Flex align="center" :class="$style.card_wrapper">
		<Flex align="center" direction="column" justify="between" :class="[$style.card, active && $style.card_active]">
			<Flex align="start" justify="between" wide>
				<Text size="12" color="secondary"> {{ series.title }} </Text>

				<Flex align="center" gap="2" :style="{ color: totalDiff.side === 'rise' ? 'var(--green)' : totalDiff.side === 'fall' ? 'var(--red)' : 'var(--txt-primary)' }">
					<Text size="12"> {{ totalDiff.side === 'rise' ? '+' : totalDiff.side === 'fall' ? '-' : '' }} </Text>
					<Text size="12"> {{ totalDiff.diff > 999 ? '999' : totalDiff.diff }} </Text>
					<Text size="12">%</Text>
				</Flex>
			</Flex>

			<Flex align="center" justify="between" wide>
				<Text size="20" weight="600" color="primary" :class="$style.diff">
					{{ series.units === 'bytes' ? formatBytes(currentTotal) : abbreviate(currentTotal) }}
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
	min-height: 100px;
	width: 250px;

	cursor: pointer;

	/* background: var(--card-background); */
	border-radius: 12px;
	overflow: hidden;

	padding: 12px;

	transition: all 0.2s ease;

	/* box-shadow: inset 0 0 0 1px var(--op-5); */

	&:hover {
		/* opacity: 0.75; */
		filter: brightness(80%);
		/* box-shadow: inset 0 0 0 1px var(--brand); */
		background: var(--card-background);
	}

	&:active {
		scale: 0.98;
	}
}

.card_active {
	background: var(--card-background);
	box-shadow: inset 0 0 0 1px var(--brand);
}

.diff {
	padding: 0px 0px 8px 2px;
}
.data {
	border-radius: 4px 4px 8px 8px;
	background: var(--chart-background);

	padding: 16px;
}

.chart_wrapper {
	width: 100px;
	/* position: relative; */
}

.chart {
	/* position: absolute; */

	& svg {
		overflow: visible;
	}
}

.axis {
	position: absolute;
	top: 0;
	right: 0;

	&.x {
		bottom: 6px;
		left: 40px;
	}

	&.y {
		bottom: 34px;
		left: 0;
	}
}

.tooltip_wrapper {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	& .dot {
		width: 6px;
		height: 6px;
		border-radius: 50px;
		background: var(--brand);

		box-shadow: 0 0 0 4px rgba(222, 116, 10, 0.27);

		transition: all 0.15s ease;
	}

	& .line {
		position: absolute;
		top: 0;
		bottom: 32px;

		border-left: 1px dashed var(--op-10);

		transition: all 0.15s ease;
	}

	& .badge {
		position: absolute;
		bottom: 4px;

		background: var(--op-3);

		transition: all 0.15s ease;
	}

	& .tooltip {
		pointer-events: none;
		position: absolute;
		z-index: 10;

		background: var(--op-3);
		border-radius: 6px;
		box-shadow: inset 0 0 0 1px var(--op-5), 0 14px 34px rgba(0, 0, 0, 15%), 0 4px 14px rgba(0, 0, 0, 5%);

		padding: 8px;

		transition: all 0.2s ease;
	}
}

@media (max-width: 800px) {
	.data {
		flex-direction: column;
	}
}
</style>
