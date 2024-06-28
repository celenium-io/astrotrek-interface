<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"
import { useDebounceFn } from "@vueuse/core"

/** UI */
import Button from "@/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

/** Services */
import { formatBytes, spaces } from "@/services/utils"

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
	height: {
		type: Number,
		default: 180,
	}
})

const isLoading = ref(false)

const loadSeries = async (period) => {
	isLoading.value = true

	let rawData = await fetchSeries({
		name: props.series.name,
		timeframe: period.timeframe,
		from: parseInt(
			DateTime.now().minus({
				days: period.timeframe === "day" ? period.value : 0,
				hours: period.timeframe === "hour" ? period.value : 0,
			}).ts / 1_000
		),
	})

	let resultData = []
	let seriesMap = {}
	rawData.forEach((item) => {
		seriesMap[DateTime.fromISO(item.time).toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")] =
			props.series.name === 'tps' ? item.value * 3600 : item.value
	})

	for (let i = 1; i < period.value + 1; i++) {
		const dt = DateTime.now().minus({
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

const data = ref([])

/** Charts */
const chartWrapperEl = ref()
const chartEl = ref()

/** Tooltip */
const showSeriesTooltip = ref(false)
const tooltipEl = ref()
const tooltipXOffset = ref(0)
const tooltipYOffset = ref(0)
const tooltipYDataOffset = ref(0)
const tooltipText = ref("")

const badgeEl = ref()
const badgeText = ref("")
const badgeOffset = ref(0)

const buildChart = (chart, data, onEnter, onLeave) => {
	const width = chartWrapperEl.value.wrapper.getBoundingClientRect().width
	const height = props.height
	const marginTop = 0
	const marginRight = 0
	const marginBottom = 24
	const marginLeft = 60
	const barWidth = Math.round((width - marginLeft - marginRight) / (data.length) - 10)

	const MAX_VALUE = d3.max(data, (d) => d.value) ? d3.max(data, (d) => d.value) : 1

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => d.date),
		[marginLeft, width - marginRight - barWidth],
	)
	const y = d3.scaleLinear([0, MAX_VALUE], [height - marginBottom - 6, marginTop])

	/** Tooltip */
	const bisect = d3.bisector((d) => d.date).center


	let prevIdx = -1

	const onPointermoved = (event) => {
		onEnter()

		const idx = bisect(data, x.invert(d3.pointer(event)[0] - barWidth / 2))

		if (prevIdx !== idx) {
			chart.children[0].children[idx + 1].classList.add('bar_hover')
			chart.children[0].children[prevIdx + 1].classList.remove('bar_hover')

			prevIdx = idx
		}

		tooltipXOffset.value = x(data[idx].date)
		tooltipYDataOffset.value = y(data[idx].value)
		tooltipYOffset.value = event.layerY
		tooltipText.value = data[idx].value

		badgeText.value =
			props.period.timeframe === "day"
				? DateTime.fromJSDate(data[idx].date).toFormat("LLL dd")
				: DateTime.fromJSDate(data[idx].date).set({ minutes: 0 }).toFormat("hh:mm a")

		if (!badgeEl.value) return
		if (idx === 0) {
			if (props.period.timeframe === "day") {
				badgeOffset.value = badgeEl.value.getBoundingClientRect().width - 20
			} else {
				badgeOffset.value = badgeEl.value.getBoundingClientRect().width - barWidth - 7
			}
		} else if (idx === props.period.value - 1) {
			if (props.period.timeframe === "day") {
				badgeOffset.value = badgeEl.value.getBoundingClientRect().width / 2 - barWidth + 17
			} else {
				badgeOffset.value = badgeEl.value.getBoundingClientRect().width / 2
			}
		} else {
			badgeOffset.value = badgeEl.value.getBoundingClientRect().width / 2 - barWidth / 2
		}
	}

	const onPointerleft = (event) => {
		onLeave()

		chart.children[0].children[prevIdx + 1].classList.remove('bar_hover')
		prevIdx = -1

		badgeText.value = ""
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
		.on("pointerenter pointermove", onPointermoved)
		.on("pointerleave", onPointerleft)
		.on("touchstart", (event) => event.preventDefault())

	/** Default Horizontal Line  */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${0},${height - marginBottom - 6} L${width},${height - marginBottom - 6}`)

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", d => x(new Date(d.date)))
		.attr("y", d => y(d.value))
		.attr("width", barWidth)
		.attr("height", d => height - marginBottom - 5 - y(d.value))

	if (chart.children[0]) chart.children[0].remove()
	chart.append(svg.node())
}

const drawChart = async () => {
	data.value = await loadSeries(props.period)

	buildChart(
		chartEl.value.wrapper,
		data.value,
		() => (showSeriesTooltip.value = true),
		() => (showSeriesTooltip.value = false),
	)
}

const debouncedRedraw = useDebounceFn((e) => {
	drawChart()
}, 500)

onMounted(async () => {
	window.addEventListener("resize", debouncedRedraw)

	await drawChart()
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", debouncedRedraw)
})

watch(
	() => [props.series, props.period],
	async () => {
		await drawChart()
	},
)
</script>

<template>
	<Flex direction="column" gap="4">
		<Flex justify="between" gap="32" :class="$style.data">
			<Flex direction="column" gap="20" wide>
				<Text size="13" weight="600" color="primary"> {{ title }} </Text>

				<Flex ref="chartWrapperEl" direction="column" :class="$style.chart_wrapper" :style="{ height: height + 'px' }">
					<Flex direction="column" justify="between" :class="[$style.axis, $style.y]">
						<Text
							v-if="data.length"
							size="12"
							weight="600"
							color="tertiary"
							:style="{ opacity: Math.max(...data.map((d) => d.value)) ? 1 : 0 }"
						>
							{{ series.units === 'bytes' ? formatBytes(Math.max(...data.map((d) => d.value)), 0) : spaces(Math.max(...data.map((d) => d.value))) }}
						</Text>
						<Skeleton v-else-if="!data.length" w="32" h="12" />

						<Text
							v-if="data.length"
							size="12"
							weight="600"
							color="tertiary"
							:style="{
								opacity:
									Math.round(Math.max(...data.map((d) => d.value)) / 2) !==
									Math.max(...data.map((d) => d.value))
										? 1
										: 0,
							}"
						>
							{{ series.units === 'bytes' ? formatBytes(Math.round(Math.max(...data.map((d) => d.value)) / 2), 0) : spaces(Math.round(Math.max(...data.map((d) => d.value)) / 2)) }}
						</Text>
						<Skeleton v-else-if="!data.length" w="24" h="12" />

						<Text v-if="data.length" size="12" weight="600" color="tertiary"> 0 </Text>
						<Skeleton v-else-if="!data.length" w="16" h="12" />
					</Flex>

					<Flex :class="[$style.axis, $style.x]">
						<Flex align="end" justify="between" wide>
							<Text v-if="period.timeframe === 'day'" size="12" weight="600" color="tertiary">
								{{
									DateTime.now()
										.minus({ days: period.value - 1 })
										.toFormat("LLL dd")
								}}
							</Text>
							<Text v-else size="12" weight="600" color="tertiary">
								{{ DateTime.now().minus({ hours: period.value - 1 }).set({ minutes: 0 }).toFormat("hh:mm a") }}
							</Text>

							<Text size="12" weight="600" color="tertiary">{{ period.timeframe === "day" ? "Today" : "Now" }}</Text>
						</Flex>
					</Flex>

					<Transition name="fastfade">
						<div v-if="showSeriesTooltip" :class="$style.tooltip_wrapper">
							<div
								ref="badgeEl"
								:style="{ transform: `translateX(${tooltipXOffset - badgeOffset}px)` }"
								:class="$style.badge"
							>
								<Text size="12" weight="600" color="secondary">
									{{ badgeText }}
								</Text>
							</div>
							<Flex
								v-if="series.tooltip"
								ref="tooltipEl"
								:style="{ transform: `translate(${tooltipXOffset}px, ${tooltipYDataOffset - 40}px)` }"
								direction="column"
								gap="8"
								:class="$style.tooltip"
							>
								<Flex align="center" gap="16">
									<Text size="12" weight="600" color="secondary"> {{ series.tooltip }} </Text>
									<Text size="12" weight="600" color="primary"> {{ series.units === 'bytes' ? formatBytes(tooltipText) : tooltipText }} </Text>
								</Flex>
							</Flex>
						</div>
					</Transition>

					<Flex ref="chartEl" :class="$style.chart" />
				</Flex>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.data {
	border-radius: 4px 4px 8px 8px;
	background: var(--chart-background);

	padding: 16px;
}

.chart_wrapper {
	position: relative;
}

.chart {
	position: absolute;

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
