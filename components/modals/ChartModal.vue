<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"

/** API */
import { fetchQuote, fetchQuotesSeries } from "@/services/api/quotes"

/** Services */
import { capitalize, getNetworkName, isObject } from "@/services/utils"

/** UI */
import Modal from "@/components/ui/Modal.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Store */
import { useCacheStore } from "@/store/cache"
const cacheStore = useCacheStore()

const emit = defineEmits(["onClose"])
const props = defineProps({
	show: Boolean,
})

const chartView = ref("candles")
const timeframe = ref("hour")
const showDrawer = ref("false")
const quote = ref()
const quotesSeries = ref([])
const diff = ref(0)
const color = computed(() => diff.value >= 0 ? "green" : "red")

const tooltip = ref({ show: false })
const chartEl = ref()
const tooltipEl = ref()

const handleChangeChartView = () => {
	if (chartView.value === "line") {
		chartView.value = "candles"
	} else {
		chartView.value = "line"
	}
}

const handleChangeTimeframe = () => {
	if (timeframe.value === "hour") {
		timeframe.value = "day"
	} else {
		timeframe.value = "hour"
	}
}

const getQuote = async () => {
	quote.value = await fetchQuote({ pair: cacheStore.current?.quote?.pair })
}
const getQuoteSeries = async () => {
	const data = await fetchQuotesSeries({
		pair: quote.value?.pair,
		timeframe: timeframe.value,
		from: timeframe.value === "hour" ? parseInt(DateTime.now().minus({ weeks: 1 }).ts / 1_000) : 0,
	})

	if (data.length) {
		quotesSeries.value = data.reverse()
		const lastEl = quotesSeries.value[quotesSeries.value.length - 1]
		diff.value = ((+lastEl.close - +quotesSeries.value[0].close) / +lastEl.close * 100).toFixed(2)
	}
}
const buildChart = (chart, data) => {
	const { width, height } = chart.getBoundingClientRect()
	const margin = { top: 0, left: 32 }

	const MIN_VALUE = d3.min(data, (d) => chartView.value === "line" ? +d.close : +d.low)
	const MAX_VALUE = d3.max(data, (d) => chartView.value === "line" ? +d.close : +d.high)

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => DateTime.fromISO(d.time).toJSDate()),
		[margin.left, width]
	)
	const xBand = d3
		.scaleBand()
		.domain(data.map((d) => DateTime.fromISO(d.time).toJSDate()))
		.range([margin.left, width])
		.padding(0.1)
	const bandwidth = xBand.bandwidth()
	const y = d3.scaleLinear(
		[MIN_VALUE, MAX_VALUE],
		[height, margin.top]
	)

	const line = d3
		.line()
		.curve(d3.curveMonotoneX)
		.x((d) => x(DateTime.fromISO(d.time).toJSDate()))
		.y((d) => y(+d.close))

	const bisect = d3.bisector(function (d) {
		return DateTime.fromISO(d.time).toJSDate()
	}).center

	function onPointerEnter() {
		const elements = document.querySelectorAll("[data-index]")
		elements.forEach((el) => {
			el.style.filter = "brightness(0.6)"
		})
	}
	function onPointerMoved(event) {
		tooltip.value.show = true

		// Recover coordinate we need
		const idx = bisect(data, x.invert(d3.pointer(event)[0]))
		const selectedCData = data[idx]
		const xPosition = chartView.value === "line" ? x(DateTime.fromISO(selectedCData?.time).toJSDate()) : xBand(DateTime.fromISO(selectedCData?.time).toJSDate())
		const yPosition = y(selectedCData?.close)

		if (chartView.value === "line") {
			focus.style("opacity", 1)
			focusLineH.style("opacity", 1)
			focusLineV.style("opacity", 1)
			focus
				.attr("cx", xPosition)
				.attr("cy", y(selectedCData?.close))
			focusLineV
				.attr("x1", xPosition)
				.attr("y1", 0)
				.attr("x2", xPosition)
				.attr("y2", height)
			focusLineH
				.attr("x1", 0)
				.attr("y1", yPosition)
				.attr("x2", width)
				.attr("y2", yPosition)
		} else {
			focusLineV.style("opacity", 1)
			focusLineV
				.attr("x1", xPosition + bandwidth / 2)
				.attr("y1", 0)
				.attr("x2", xPosition + bandwidth / 2)
				.attr("y2", height)
			
				const elements = document.querySelectorAll("[data-index]")
				elements.forEach((el) => {
					if (+el.getAttribute("data-index") === idx) {
						el.style.filter = "brightness(1.2)"
					} else {
						el.style.filter = "brightness(0.6)"
					}
				})
		}
		
		let tooltipWidth = tooltipEl.value?.wrapper ? tooltipEl.value?.wrapper?.getBoundingClientRect()?.width : 100
		let tooltipHeight = tooltipEl.value?.wrapper ? tooltipEl.value?.wrapper?.getBoundingClientRect()?.height : 14
		tooltip.value.x = (xPosition + tooltipWidth) > width + 30 ? xPosition - tooltipWidth - 5 : xPosition + 5
		tooltip.value.y = y(selectedCData?.close) - tooltipHeight
		
		tooltip.value.data = selectedCData
		tooltip.value.date = DateTime.fromISO(selectedCData?.time).setLocale("en").toFormat("HH:mm, LLL dd")
	}

	function onPointerleft() {
		tooltip.value.show = false
		focus.style("opacity", 0)
		focusLineH.style("opacity", 0)
		focusLineV.style("opacity", 0)
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
		.on("pointerenter", onPointerEnter)
		.on("pointermove", onPointerMoved)
		.on("pointerleave", onPointerleft)
		.on("touchstart", (event) => event.preventDefault())

	/** Add axes */
	svg.append("g")
		.attr("transform", "translate(0," + (height) + ")")
		.attr("color", "var(--op-20)")
		.call(
			d3
				.axisBottom(x)
				.ticks(Math.min(data.length, 6))
				.tickFormat(d3.timeFormat(["hour", "day"].includes("hour") ? "%b %d" : "%b"))
		)

	svg.append("g")
		.attr("transform", `translate(0,0)`)
		.attr("color", "var(--op-20)")
		.call(d3.axisRight(y).ticks(5).tickSize(width).tickFormat(val => `$${val}`))
		.call((g) => g.select(".domain").remove())
		.call((g) => g.selectAll(".tick line").attr("stroke-opacity", 0.7).attr("stroke-dasharray", "10, 10"))
		.call((g) => g.selectAll(".tick text").attr("x", 4).attr("dy", -4))
	
	const focus = svg
		.append('g')
		.append('circle')
			.style("fill", "var(--brand)")
			.style('filter', "drop-shadow(0px 0px 4px var(--brand))")
			.attr('r', 4)
			.style("opacity", 0)
			.style("transition", "all 0.2s ease" )

	const focusLineH = svg
		.append('g')
		.append('line')
			.style("stroke-width", 2)
			.style("stroke-dasharray", "4 4")
			.style("stroke", "var(--op-15)")
			.style("fill", "none")
			.style("opacity", 0)
	
	const focusLineV = svg
		.append('g')
		.append('line')
			.style("stroke-width", 2)
			.style("stroke-dasharray", "4 4")
			.style("stroke", "var(--op-15)")
			.style("fill", "none")
			.style("opacity", 0)
	
	/** Chart Line */
	if (chartView.value === "line") {
		const path = svg.append("path")
			.attr("fill", "none")
			.attr("stroke", "var(--brand)")
			// .attr("stroke", `var(--${color.value})`)
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

	} else {
		const candles = svg
			.append("g")
			.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", d =>
				`translate(${xBand(DateTime.fromISO(d.time).toJSDate())},0)`
			)

		candles
			.append("line")
				.attr("x1", bandwidth / 2)
				.attr("x2", bandwidth / 2)
				.attr("y1", d => y(d.high))
				.attr("y2", d => y(d.low))
				.attr("stroke", "var(--op-50)")
				.attr("stroke-width", 1)

		candles
			.append("rect")
				.attr("data-index", (d, i) => i)
				.attr("x", 0)
				.attr("width", bandwidth)
				.attr("y", d => y(Math.max(d.open, d.close)))
				.attr("height", d =>
					Math.abs(y(d.open) - y(d.close))
				)
				.attr("fill", d =>
					d.close >= d.open ? "var(--green)" : "var(--red)"
				)

		candles.selectAll("rect")
			.attr("height", 0)
			.attr("y", y(d => d.open))
			.transition()
			.duration(1000)
			.attr("y", d => y(Math.max(d.open, d.close)))
			.attr("height", d => Math.abs(y(d.open) - y(d.close)))

		if (chart.children[0]) chart.children[0].remove()
		chart.append(svg.node())
	}
}

watch(
	() => timeframe.value,
	async () => {
		await getQuoteSeries()
		buildChart(
			chartEl.value.wrapper,
			quotesSeries.value,
		)
	}
)

watch(
	() => chartView.value,
	async () => {
		buildChart(
			chartEl.value.wrapper,
			quotesSeries.value,
		)
	}
)

watch(
	() => props.show,
	async () => {
		if (props.show) {
			showDrawer.value = false
			await getQuote()
			await getQuoteSeries()
			buildChart(
				chartEl.value.wrapper,
				quotesSeries.value,
			)

		} else {
			quotesSeries.value = []
			showDrawer.value = false
		}
	},
)
</script>

<template>
	<Modal :show="show" @onClose="emit('onClose')" width="1200" disable-trap>
		<Flex direction="column" gap="16" wide :class="$style.wrapper">
			<Flex align="center" gap="16">
				<Text size="16" weight="600" color="secondary"> {{ quote?.pair?.replace("_", "/") }} </Text>

				<Tooltip>
					<Icon
						@click="showDrawer = true"
						name="info"
						size="16"
						scale="1.2"
						color="secondary"
						:class="$style.drawer_action"
					/>

					<template #content>
						Show details
					</template>
				</Tooltip>
			</Flex>

			<Flex align="start" justify="between" gap="48">
				<Flex align="start" direction="column" gap="8">
					<Text size="20" weight="600" color="primary"> {{ `$${quote?.price?.value}` }} </Text>

					<Flex v-if="!!diff" align="center" gap="4">
						<Text size="14" :color="color"> {{ `${Math.abs(diff)}%` }} </Text>
						<Icon name="arrow-narrow-up-right" :color="color" :style="{ transform: `${diff >= 0 ? '' : 'scaleY(-1)'}` }"></Icon>
					</Flex>
					<Skeleton v-else w="30" h="14" />
				</Flex>

				<Flex align="center" gap="24">
					<Flex align="center" gap="12">
						<Text size="13" color="secondary">Chart view</Text>

						<Flex
							@click="handleChangeChartView"
							align="center"
							gap="12"
							:class="$style.chart_selector"
							:style="{
								background: `linear-gradient(to ${chartView === 'line' ? 'right' : 'left'}, var(--op-3) 50%, transparent 50%)`,
							}"
						>
							<Icon
								name="line-chart"
								size="14"
								scale="1.2"
								:style="{ fill: `${chartView === 'line' ? 'var(--brand)' : 'var(--txt-tertiary)'}` }"
							/>

							<Icon
								name="candle-chart"
								size="14"
								scale="1.3"
								:style="{ fill: `${chartView === 'candles' ? 'var(--brand)' : 'var(--txt-tertiary)'}` }"
							/>
						</Flex>
					</Flex>

					<Flex align="center" gap="12">
						<Text size="13" color="secondary">Group By</Text>

						<Flex
							@click="handleChangeTimeframe"
							align="center"
							gap="12"
							:class="$style.chart_selector"
							:style="{
								background: `linear-gradient(to ${timeframe === 'hour' ? 'right' : 'left'}, var(--op-3) 50%, transparent 50%)`,
							}"
						>
							<Text
								size="13"
								:style="{ color: `${timeframe === 'hour' ? 'var(--brand)' : 'var(--txt-tertiary)'}` }"
							>
								1H
							</Text>

							<Text
								size="13"
								:style="{ color: `${timeframe === 'day' ? 'var(--brand)' : 'var(--txt-tertiary)'}` }"
							>
								1D
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.chart_wrapper">
				<Transition name="fastfade">
					<div v-if="tooltip.show" :class="$style.tooltip_wrapper">
						<Flex
							v-if="chartView === 'line'"
							ref="tooltipEl"
							align="center"
							justify="between"
							gap="12"
							:style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
							:class="$style.tooltip"
						>
							<Text size="12" weight="600" color="primary"> {{ `$${tooltip.data.close}` }} </Text>
								
							<Text size="12" weight="500" color="tertiary">
								{{ tooltip.date }}
							</Text>
						</Flex>

						<Flex
							v-else
							ref="tooltipEl"
							direction="column"
							gap="8"
							:style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
							:class="$style.tooltip"
						>
							<Flex align="center" justify="end" wide>
								<Text size="12" color="tertiary">
									{{ tooltip.date }}
								</Text>
							</Flex>

							<div
								:class="$style.divider_candles"
								:style="{background: `linear-gradient(90deg, rgba(10, 222, 113, 0%) 0%, ${tooltip.data.open < tooltip.data.close ? 'var(--green)' : 'var(--red)'}, rgba(10, 222, 113, 0%) 100%)`}"
							/>

							<Flex align="center" justify="between" gap="24">
								<Text size="12" color="secondary"> Open </Text>
								<Text size="12" color="primary"> {{ `$${tooltip.data?.open}` }} </Text>
							</Flex>
							<Flex align="center" justify="between" gap="12">
								<Text size="12" color="secondary"> High </Text>
								<Text size="12" color="primary"> {{ `$${tooltip.data?.high}` }} </Text>
							</Flex>
							<Flex align="center" justify="between" gap="12">
								<Text size="12" color="secondary"> Low </Text>
								<Text size="12" color="primary"> {{ `$${tooltip.data?.low}` }} </Text>
							</Flex>
							<Flex align="center" justify="between" gap="12">
								<Text size="12" color="secondary"> Close </Text>
								<Text size="12" color="primary"> {{ `$${tooltip.data?.close}` }} </Text>
							</Flex>
							
						</Flex>
					</div>
				</Transition>

				<Flex ref="chartEl" :class="$style.chart" />
			</Flex>

			<Transition name="slide">
				<div v-if="showDrawer" :class="$style.drawer">
					<Flex direction="column" gap="16">
						<Flex align="center" justify="between" gap="12">
							<Flex align="center" gap="12">
								<Icon name="quotes" size="14" color="secondary" />

								<Text size="14" weight="600" color="primary">
									Details
								</Text>
							</Flex>

							<Icon
								@click="showDrawer = false"
								name="chevron-double"
								size="16"
								color="secondary"
								:class="$style.drawer_action"
								:style="{ transform: 'rotate(90deg)' }"
							/>
						</Flex>

						<Flex align="start" direction="column" gap="8">
							<Text size="14" weight="600" color="secondary"> {{ quote?.pair?.replace("_", "/") }} </Text>

							<Flex align="center" gap="8">
								<Text size="13" color="primary"> {{ `$${quote?.price?.value}` }} </Text>

								<Flex align="center" gap="8">
									<Text size="12" :color="color"> {{ `${Math.abs(diff)}%` }} </Text>
									<Icon name="arrow-narrow-up-right" :color="color" :style="{ transform: `${diff >= 0 ? '' : 'scaleY(-1)'}` }"></Icon>
								</Flex>
							</Flex>
						</Flex>

						<div :class="$style.divider" />

						<Flex direction="column" gap="12">
							<Flex align="center" justify="between">
								<Text size="12" color="tertiary"> Base </Text>
								<Text size="12" color="primary"> {{ quote?.base }} </Text>
							</Flex>
							<Flex align="center" justify="between">
								<Text size="12" color="tertiary"> Qoute </Text>
								<Text size="12" color="primary"> {{ quote?.quote }} </Text>
							</Flex>
							<Flex align="center" justify="between">
								<Text size="12" color="tertiary"> Decimals </Text>
								<Text size="12" color="primary"> {{ quote?.decimals }} </Text>
							</Flex>
							<Flex align="center" justify="between">
								<Text size="12" color="tertiary"> Receiving quotes </Text>
								<Text size="12" color="primary"> {{ quote?.enabled ? 'Enabled' : 'Disabled' }} </Text>
							</Flex>
							<Flex align="center" justify="between">
								<Text size="12" color="tertiary"> Min provider count </Text>
								<Text size="12" color="primary"> {{ quote?.min_provider_count }} </Text>
							</Flex>
						</Flex>

						<div :class="$style.divider" />

						<Flex direction="column" gap="12">
							<Text size="13" color="secondary" weight="600"> Providers </Text>

							<Flex direction="column" gap="12" :class="$style.providers">
								<Flex v-for="p in quote.providers" direction="column" gap="8" :class="$style.provider">
									<Flex align="center" justify="between">
										<Text size="12" color="tertiary"> Name </Text>
										<Text size="12" color="primary"> {{ p.provider }} </Text>
									</Flex>
									<Flex align="center" justify="between">
										<Text size="12" color="tertiary"> Off-chain ticker </Text>
										<Text size="12" color="primary"> {{ p.off_chain_ticker }} </Text>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</div>
			</Transition>
		</Flex>
	</Modal>
</template>

<style module>
.wrapper {
	padding: 18px;
}

.chart_wrapper {
	position: relative;
	width: 100%;
	height: 500px;
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

.chart_selector {
	padding: 4px 6px 4px 6px;
	box-shadow: inset 0 0 0 1px var(--op-10);
	border-radius: 5px;
	cursor: pointer;
	transition: all 1s ease-in-out;
}

.drawer {
	position: absolute;
	top: 0;
	left: 0;
	width: 300px;
	height: 100%;
	background: var(--card-background);
	border-radius: 6px;
	border: 1px solid var(--op-5);
	padding: 16px;
	z-index: 11;
}

.drawer_action {
	cursor: pointer;

	&:hover {
		fill: var(--txt-primary);
		scale: 1.1;
	}

	&:active {
		scale: 1;
	}
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}

.divider_candles {
	width: 100%;
	height: 2px;
}

.providers {
	max-height: 350px;
	overflow-y: auto;
	overscroll-behavior: contain;
}

.provider {
	padding: 8px;
	box-shadow: inset 0 0 0 1px var(--op-10), 0 14px 34px rgba(0, 0, 0, 15%), 0 4px 14px rgba(0, 0, 0, 5%);
	border-radius: 6px;
}

::-webkit-scrollbar {
    width: 3px;
}

@media (max-height: 900px) {
	.modules {
		max-height: 600px;
	}
}

@media (max-height: 750px) {
	.modules {
		max-height: 400px;
	}
}
</style>
