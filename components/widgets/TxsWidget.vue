<script setup>
/** Vendor */
import * as d3 from "d3"
import { DateTime } from "luxon"

/** API */
import { fetchSeries } from "@/services/api/stats"

const prevDaySeries = ref([])
const series = ref([])

const txsChartEl = ref()
const test = ref()

const getTxsSeries = async ({ from, to }) => {
	const data = await fetchSeries({
		table: "tx_count",
		period: "hour",
		from,
		to,
	})
	return data
}

const prepareTxsSeries = async () => {
	const data = (
		await getTxsSeries({
			from: parseInt(DateTime.now().minus({ days: 1 }).set({ hours: 0, minutes: 0, seconds: 0 }).ts / 1_000),
		})
	).reverse()
	prevDaySeries.value = data.slice(0, 25).map((s) => ({ date: DateTime.fromISO(s.time).toJSDate(), value: parseFloat(s.value) }))
	series.value = data.slice(25, data.length).map((s) => ({ date: DateTime.fromISO(s.time).toJSDate(), value: parseFloat(s.value) }))

	while (series.value.length < 24) {
		series.value.push({
			date: DateTime.fromJSDate(series.value[series.value.length - 1].date)
				.plus({ hours: 1 })
				.toJSDate(),
			value: null,
		})
	}

	setTimeout(() => {
		prepareTxsSeries()
	}, (60 - DateTime.now().minute) * 60 * 1_000)
}

const buildChart = (chart, data, color, onEnter, onLeave) => {
	const width = chart.getBoundingClientRect().width
	const height = 100
	const marginTop = 0
	const marginRight = 0
	const marginBottom = 32
	const marginLeft = 0

	const lastPoint = series.value[series.value.findLastIndex((s) => s.value !== null)]

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

	/** SVG Container */
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "none")
		.attr("style", "max-width: 100%;")
		.style("-webkit-tap-highlight-color", "transparent")

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
	buildChart(txsChartEl.value.wrapper, series.value, "var(--brand)")
	buildChart(test.value.wrapper, prevDaySeries.value, "var(--op-10)")
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

			<Text size="16" weight="600" color="secondary">{{ todayTxs }}</Text>
		</Flex>

		<Flex :class="$style.chart_wrapper">
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
	max-width: 380px;
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

	& svg {
		overflow: visible;
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
