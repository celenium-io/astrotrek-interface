<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"

/** API */
import { fetchSeries } from "@/services/api/stats"

const prevDaySeries = ref([])
const series = ref([])

const tooltip = ref({ show: false })

const txsChartEl = ref()
const test = ref()

const getTxsSeries = async ({ from, to }) => {
	const data = await fetchSeries({
		name: "tx_count",
		timeframe: "hour",
		from,
		to,
	})
	return data
}

const prepareTxsSeries = async () => {
	const data = (
		await getTxsSeries({
			from: parseInt(DateTime.now().minus({ hours: 48 }).ts / 1_000),
		})
	).reverse()
	
	prevDaySeries.value = data.slice(0, 24).map((s) => ({ date: DateTime.fromISO(s.time).toJSDate(), value: parseFloat(s.value) }))
	series.value = data.slice(24, data.length).map((s) => ({ date: DateTime.fromISO(s.time).toJSDate(), value: parseFloat(s.value) }))
	
	while (series.value.length < 24) {
		series.value.push({
			date: DateTime.fromJSDate(series.value[series.value.length - 1].date)
				.plus({ hours: 1 })
				.toJSDate(),
			value: 0,
		})
	}

	setTimeout(() => {
		prepareTxsSeries()
	}, (60 - DateTime.now().minute) * 60 * 1_000)
}

const buildChart = (chart, data, color, onEnter, onLeave) => {
	const width = chart?.getBoundingClientRect().width || 348
	const height = 100
	const marginTop = 0
	const marginRight = 0
	const marginBottom = 32
	const marginLeft = 0

	const lastPoint = series.value[series.value.findLastIndex((s) => s.value !== null)]

	const MAX_VALUE = Math.max(Math.max(...prevDaySeries.value.map((s) => s.value)), Math.max(...series.value.map((s) => s.value)))

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

	/** Pointer */
	const xScaleEfficiency = d3.scaleUtc(
		d3.extent(data, (d) => d.date),
		[marginLeft, width - marginRight],
	)

	const bisect = d3.bisector((d) => d.date).center
	const onPointermoved = (event) => {
		onEnter()

		const idx = bisect(data, xScaleEfficiency.invert(d3.pointer(event)[0]))

		tooltip.value.x = x(data[idx].date)
		tooltip.value.y = y(data[idx].value)
		tooltip.value.currentValue = series.value[idx].value || 0
		tooltip.value.prevValue = prevDaySeries.value[idx].value || 0
		tooltip.value.currentDate = DateTime.fromJSDate(data[idx].date).toFormat("hh:mm a")
		
	}
	const onPointerleft = () => {
		onLeave()
	}

	/** SVG Container */
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "none")
		.attr("style", "max-width: 100%;")
		.style("-webkit-tap-highlight-color", "transparent")
		.on("pointerenter pointermove", onPointermoved)
		.on("pointerleave", onPointerleft)
		.on("touchstart", (event) => event.preventDefault())

	/** Chart Line */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", color)
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data.filter((item) => item.value !== null)))

	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "transparent")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data.filter((item) => item.value === null).map((item) => ({ ...item, value: 0 }))))

	svg.append("circle").attr("cx", x(lastPoint.date)).attr("cy", y(lastPoint.value)).attr("fill", color).attr("r", 3)

	if (chart.children[0]) chart.children[0].remove()
	chart.append(svg.node())
}

onMounted(async () => {
	await prepareTxsSeries()

	buildChart(
		txsChartEl.value.wrapper,
		series.value,
		"var(--brand)",
		() => (tooltip.value.show = true),
		() => (tooltip.value.show = false),
	)

	buildChart(
		test.value.wrapper,
		prevDaySeries.value,
		"var(--op-10)"
	)
})

const todayTxs = computed(() => {
	return series.value.reduce((a, b) => (a += parseInt(b.value || 0)), 0)
})
</script>

<template>
	<Flex direction="column" justify="between" wide :class="$style.wrapper">
		<Flex justify="between">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Daily Transactions</Text>
				<Text size="14" weight="500" color="tertiary">Compared to the previous day</Text>
			</Flex>

			<Flex v-if="!tooltip.show" direction="column" gap="6" align="end">
				<Text size="16" weight="600" color="secondary">{{ todayTxs }}</Text>
				<Text size="13" weight="500" color="tertiary"> Today</Text>
			</Flex>
			<Flex v-else direction="column" gap="6" align="end">
				<Flex>
					<Text size="16" weight="600" color="secondary">
						{{ `${tooltip.currentValue}` }}
					</Text>
					<Text size="16" weight="600" color="tertiary">
						{{ `&nbsp/ ${tooltip.prevValue}` }}
					</Text>
				</Flex>
				<Text size="13" weight="500" color="tertiary"> {{ tooltip.currentDate }} </Text>
			</Flex>
		</Flex>

		<Flex :class="$style.chart_wrapper">
			<Transition name="fastfade">
				<div v-if="tooltip.show" :class="$style.tooltip_wrapper">
					<div
						:style="{ transform: `translate(${tooltip.x - 2}px, ${tooltip.y - 2}px)` }"
						:class="$style.dot"
					/>
					<div :style="{ transform: `translateX(${tooltip.x - 2}px)` }" :class="$style.line" />
				</div>
			</Transition>

			<Flex ref="test" wide :class="$style.chart" />
			<Flex ref="txsChartEl" wide :class="$style.chart" />

			<Flex align="center" justify="between" :class="$style.axis">
				<Text size="11" weight="600" color="tertiary" style="text-transform: uppercase">{{ DateTime.now().toFormat("ccc") }}</Text>

				<Text v-for="h in 3" size="11" weight="600" color="tertiary" style="text-transform: uppercase">
					{{
						DateTime.now()
							.set({ hours: 0, minutes: 0, seconds: 0 })
							.plus({ hours: h * 6 })
							.toFormat("T")
					}}
				</Text>

				<Text size="11" weight="600" color="tertiary" style="text-transform: uppercase">
					{{ DateTime.now().plus({ days: 1 }).toFormat("ccc") }}
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	height: 196px;

	background: var(--card-background);
	border-radius: 12px;

	padding: 16px;
}

.chart_wrapper {
	position: relative;

	height: 100px;
}

.chart {
	position: absolute;

	overflow: hidden;

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

	& .dot {
		width: 4px;
		height: 4px;
		border-radius: 50px;
		background: var(--brand);

		box-shadow: 0 0 0 2px rgba(222, 116, 10, 0.27);

		transition: all 0.15s ease;
	}

	& .line {
		position: absolute;
		top: 0;
		bottom: 32px;

		border-left: 2px dashed var(--op-20);

		transition: all 0.15s ease;
		/* will-change: transform; */
	}
}

.axis {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;

	border-top: 2px solid var(--op-5);

	padding-top: 8px;
}

@media (max-width: 1000px) {
	.wrapper {
		max-width: initial;
		width: 100%;
	}
}
</style>
