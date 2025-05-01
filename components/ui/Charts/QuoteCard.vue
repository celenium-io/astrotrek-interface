<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"
import { useDebounceFn } from "@vueuse/core"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** API */
import { fetchQuotesSeries } from "@/services/api/quotes"

/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()

const props = defineProps({
	quote: {
		type: Object,
		required: true,
	},
})

const isLoading = ref(false)
const quotesSeries = ref([])
const diff = ref(0)
const color = computed(() => diff.value >= 0 ? "green" : "red")

const tooltip = ref({ show: false })
const chartEl = ref()
const tooltipEl = ref()

const getQuoteSeries = async () => {
	isLoading.value = true

	try {
		const data = await fetchQuotesSeries({
			pair: props.quote?.pair,
			timeframe: "hour",
			from: parseInt(DateTime.now().minus({ days: 1 }).ts / 1_000),
		})

		if (data.length) {
			quotesSeries.value = data.reverse()
			const lastEl = quotesSeries.value[quotesSeries.value.length - 1]
			diff.value = ((+lastEl.close - +quotesSeries.value[0].close) / +lastEl.close * 100).toFixed(2)
		}
		
	} finally {
		isLoading.value = false
	}
}
const buildChart = (chart, data) => {
	const { width, height } = chart.getBoundingClientRect()
	const marginTop = 0

	const MAX_VALUE = d3.max(data, (d) => +d.close)
	const MIN_VALUE = d3.min(data, (d) => +d.close)

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => DateTime.fromISO(d.time).toJSDate()),
		[0, width]
	)
	const y = d3.scaleLinear(
		[MIN_VALUE, MAX_VALUE],
		[height, marginTop]
	)
	
	const line = d3
		.line()
		.curve(d3.curveMonotoneX)
		.x((d) => x(DateTime.fromISO(d.time).toJSDate()))
		.y((d) => y(+d.close))

	const bisect = d3.bisector(function (d) {
		return DateTime.fromISO(d.time).toJSDate()
	}).center

	function onPointerMoved(event) {
		tooltip.value.show = true

		focus.style("opacity", 1)
		focusLine.style("opacity", 1)

		// Recover coordinate we need
		const idx = bisect(data, x.invert(d3.pointer(event)[0]))
		const selectedCData = data[idx]
		const xPosition = x(DateTime.fromISO(selectedCData.time).toJSDate())
		focus
			.attr("cx", xPosition)
			.attr("cy", y(selectedCData.close))
		focusLine
			.attr("x1", xPosition)
			.attr("y1", 0)
			.attr("x2", xPosition)
			.attr("y2", height)
		
		let tooltipWidth = tooltipEl.value?.wrapper ? tooltipEl.value?.wrapper?.getBoundingClientRect()?.width : 100
		let tooltipHeight = tooltipEl.value?.wrapper ? tooltipEl.value?.wrapper?.getBoundingClientRect()?.height : 14
		tooltip.value.x = (xPosition + tooltipWidth) > width + 30 ? xPosition - tooltipWidth - 5 : xPosition + 5
		tooltip.value.y = y(selectedCData.close) - tooltipHeight
		
		tooltip.value.value = selectedCData.close
		tooltip.value.date = DateTime.fromISO(selectedCData.time).setLocale("en").toFormat("HH:mm")
	}

	function onPointerleft() {
		tooltip.value.show = false
		focus.style("opacity", 0)
		focusLine.style("opacity", 0)
	}

	/** SVG Container */
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "none")
		.attr("style", "max-width: 100%;  height: intrinsic;")
		.style("-webkit-tap-highlight-color", "transparent")
		.on("pointerenter pointermove", onPointerMoved)
		.on("pointerleave", onPointerleft)
		.on("touchstart", (event) => event.preventDefault())

	const focus = svg
		.append('g')
		.append('circle')
			.style("fill", `var(--${color.value})`)
			.style('filter', `drop-shadow(0px 0px 4px var(--${color.value}))`)
			.attr('r', 4)
			.style("opacity", 0)
			.style("transition", "all 0.2s ease" )

	const focusLine = svg
		.append('g')
		.append('line')
			.style("stroke-width", 2)
			.style("stroke-dasharray", "4 4")
			.style("stroke", "var(--op-15)")
			.style("fill", "none")
			.style("opacity", 0)
	
	/** Chart Line */
	const path = svg.append("path")
		.attr("fill", "none")
		.attr("stroke", `var(--${color.value})`)
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data))

	if (chart.children[0]) chart.children[0].remove()
	chart.append(svg.node())

	const totalLength = path.node().getTotalLength()
	path
		.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(1_000)
		.ease(d3.easeLinear)
		.attr("stroke-dashoffset", 0)

}

const drawChart = async () => {
	buildChart(
		chartEl.value.wrapper,
		quotesSeries.value,
	)
}

const openChartmodal = () => {
	cacheStore.current.quote = props.quote
	modalsStore.open("chart")
}

const debouncedRedraw = useDebounceFn((e) => {
	drawChart()
}, 500)

onMounted(async () => {
	window.addEventListener("resize", debouncedRedraw)

	await getQuoteSeries()

	drawChart()
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", debouncedRedraw)
})
</script>

<template>
	<Flex align="center" :class="$style.card_wrapper">
		<Flex align="center" direction="column" gap="16" :class="$style.card">
			<Flex align="center" justify="between" wide>
				<Text size="16" weight="600" color="secondary"> {{ quote.pair?.replace("_", "/") }} </Text>

				<Tooltip position="end">
					<Icon
						@click="openChartmodal"
						name="expand"
						size="16"
						color="secondary"
						:class="$style.expand_icon"
					/>

					<template #content>
						Expand quote card
					</template>
				</Tooltip>
			</Flex>

			<Flex align="start" direction="column" gap="8" wide>
				<Text size="20" weight="600" color="primary"> {{ `$${quote.price?.value}` }} </Text>

				<Flex v-if="!!diff" align="center" gap="4">
					<Text size="14" :color="color"> {{ `${Math.abs(diff)}%` }} </Text>
					<Icon name="arrow-narrow-up-right" :color="color" :style="{ transform: `${diff >= 0 ? '' : 'scaleY(-1)'}` }"></Icon>
				</Flex>
				<Skeleton v-else w="30" h="14" />
			</Flex>

			<Flex :class="$style.chart_wrapper">
				<Transition name="fastfade">
					<div v-if="tooltip.show" :class="$style.tooltip_wrapper">
						<Flex
							ref="tooltipEl"
							align="center"
							justify="between"
							gap="12"
							:style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
							:class="$style.tooltip"
						>
							<Text size="12" weight="600" color="primary"> {{ `$${tooltip.value}` }} </Text>
								
							<Text size="12" weight="500" color="tertiary">
								{{ tooltip.date }}
							</Text>
						</Flex>
					</div>
				</Transition>

				<Flex ref="chartEl" :class="$style.chart" />
			</Flex>

			<Flex v-if="quotesSeries.length" align="center" justify="between" wide>
				<Text size="12" color="tertiary"> {{ DateTime.fromISO(quotesSeries[0]?.time).setLocale("en").toFormat("H:mm, d MMM") }} </Text>

				<Text size="12" color="tertiary"> {{ DateTime.fromISO(quotesSeries[quotesSeries.length - 1]?.time).setLocale("en").toFormat("H:mm, d MMM") }} </Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.card_wrapper {
	margin-bottom: 16px;

	background: var(--op-3);
}

.card {
	height: 280px;
	min-width: 330px;

	/* cursor: pointer; */

	/* background: var(--card-background); */
	border-radius: 12px;
	overflow: hidden;

	padding: 24px;

	transition: all 0.2s ease;

	box-shadow: inset 0 0 0 1px var(--op-5);
}

.expand_icon {
	cursor: pointer;

	&:hover {
		fill: var(--txt-primary);
		scale: 1.1;
	}

	&:active {
		scale: 1;
	}
}

.chart_wrapper {
	position: relative;
	width: 100%;
	height: 250px;
}

.chart {
	position: absolute;
	width: 100%;
	height: 100%;

	& svg {
		overflow: visible;
	}
}

.tooltip_wrapper {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	& .tooltip {
		min-width: 100px;
		pointer-events: none;
		position: absolute;
		z-index: 10;

		background: var(--card-background);
		border-radius: 6px;
		box-shadow: inset 0 0 0 1px var(--op-5), 0 14px 34px rgba(0, 0, 0, 15%), 0 4px 14px rgba(0, 0, 0, 5%);

		padding: 10px;

		transition: all 0.2s ease;
	}
}

@media (max-width: 800px) {
	.data {
		flex-direction: column;
	}
}
</style>
