<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"
import { useDebounceFn } from "@vueuse/core"

/** UI */
import Button from "@/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

/** Services */
import { formatBytes } from "@/services/utils"

const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	period: {
		type: Object,
		required: true,
	},
	units: {
		type: String,
		default: '',
	},
	tooltip: {
		type: String,
		default: '',
	},
})

/** Charts */
const chartWrapperEl = ref()
const chartEl = ref()

/** Tooltip */
const showSeriesTooltip = ref(false)
const tooltipEl = ref()
const tooltipXOffset = ref(0)
const tooltipYOffset = ref(0)
const tooltipYDataOffset = ref(0)
const tooltipDynamicXPosition = ref(0)
const tooltipText = ref("")

const badgeEl = ref()
const badgeText = ref("")
const badgeOffset = ref(0)

const buildChart = (chart, data, onEnter, onLeave) => {
	const width = chartWrapperEl.value.wrapper.getBoundingClientRect().width
	const height = 180
	const marginTop = 0
	const marginRight = 0
	const marginBottom = 24
	const marginLeft = 40

	const MAX_VALUE = d3.max(data, (d) => d.value) ? d3.max(data, (d) => d.value) : 1

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => d.date),
		[marginLeft, width - marginRight],
	)
	const y = d3.scaleLinear([0, MAX_VALUE], [height - marginBottom - 6, marginTop])
	const line = d3
		.line()
		.x((d) => x(d.date))
		.y((d) => y(d.value))

	/** Tooltip */
	const bisect = d3.bisector((d) => d.date).center
	const onPointermoved = (event) => {
		onEnter()

		const idx = bisect(data, x.invert(d3.pointer(event)[0]))

		tooltipXOffset.value = x(data[idx].date)
		tooltipYDataOffset.value = y(data[idx].value)
		tooltipYOffset.value = event.layerY
		// tooltipText.value = data[idx].value

		if (tooltipEl.value) {
			if (idx > parseInt(props.period.value / 2)) {
				tooltipDynamicXPosition.value = tooltipXOffset.value - tooltipEl.value.wrapper.getBoundingClientRect().width - 16
			} else {
				tooltipDynamicXPosition.value = tooltipXOffset.value + 16
			}
		}

		badgeText.value =
			props.period.timeframe === "day"
				? DateTime.fromJSDate(data[idx].date).toFormat("LLL dd")
				: DateTime.fromJSDate(data[idx].date).set({ minutes: 0 }).toFormat("hh:mm a")

		if (!badgeEl.value) return
		if (idx < 2) {
			badgeOffset.value = 0
		} else if (idx > props.period.value - 3) {
			badgeOffset.value = badgeEl.value.getBoundingClientRect().width
		} else {
			badgeOffset.value = badgeEl.value.getBoundingClientRect().width / 2
		}
	}
	const onPointerleft = () => {
		onLeave()
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

	/** Vertical Lines */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${marginLeft},${height - marginBottom + 2} L${marginLeft},${height - marginBottom - 5}`)
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${width - 1},${height - marginBottom + 2} L${width - 1},${height - marginBottom - 5}`)

	/** Default Horizontal Line  */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${0},${height - marginBottom - 6} L${width},${height - marginBottom - 6}`)

	/** Chart Line */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--brand)")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data.slice(0, data.length - 1)))
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--brand)")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("stroke-dasharray", "8")
		.attr("d", line(data.slice(data.length - 2, data.length)))

	svg.append("circle")
		.attr("cx", x(data[data.length - 1]?.date))
		.attr("cy", y(data[data.length - 1]?.value))
		.attr("fill", "var(--brand)")
		.attr("r", 3)

	if (chart.children[0]) chart.children[0].remove()
	chart.append(svg.node())
}

const drawChart = () => {
	buildChart(
		chartEl.value.wrapper,
		props.data,
		() => (showSeriesTooltip.value = true),
		() => (showSeriesTooltip.value = false),
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
	() => props.data,
	() => {
		drawChart()
	},
)


</script>

<template>
	<Flex direction="column" gap="4">
		<Flex justify="between" gap="32" :class="$style.data">
			<Flex direction="column" gap="20" wide>
				<Text size="13" weight="600" color="primary"> {{ title }} </Text>

				<Flex ref="chartWrapperEl" direction="column" :class="$style.chart_wrapper">
					<Flex direction="column" justify="between" :class="[$style.axis, $style.y]">
						<Text
							v-if="data.length"
							size="12"
							weight="600"
							color="tertiary"
							:style="{ opacity: Math.max(...data.map((d) => d.value)) ? 1 : 0 }"
						>
							{{ units === 'bytes' ? formatBytes(Math.max(...data.map((d) => d.value)), 0) : Math.max(...data.map((d) => d.value)) }}
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
							{{ units === 'bytes' ? formatBytes(Math.round(Math.max(...data.map((d) => d.value)) / 2), 0) : Math.round(Math.max(...data.map((d) => d.value)) / 2) }}
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
								:style="{ transform: `translate(${tooltipXOffset - 3}px, ${tooltipYDataOffset - 4}px)` }"
								:class="$style.dot"
							/>
							<div :style="{ transform: `translateX(${tooltipXOffset}px)` }" :class="$style.line" />
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
								v-if="tooltip"
								ref="tooltipEl"
								:style="{ transform: `translate(${tooltipDynamicXPosition}px, ${tooltipYDataOffset - 40}px)` }"
								direction="column"
								gap="8"
								:class="$style.tooltip"
							>
								<Flex align="center" gap="16">
									<Text size="12" weight="600" color="secondary"> {{ tooltip }} </Text>
									<Text size="12" weight="600" color="primary"> {{ units === 'bytes' ? formatBytes(tooltipText) : tooltipText }} </Text>
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
	background: var(--op-1);

	padding: 16px;
}

.chart_wrapper {
	position: relative;

	height: 180px;
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
