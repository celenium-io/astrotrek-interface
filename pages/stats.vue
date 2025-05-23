<script setup>
/** Components */
import StatsBarChart from "@/components/ui/Charts/StatsBarChart.vue"
import HighlightCard from "@/components/ui/Charts/HighlightCard.vue"
import StatsLineChart from "@/components/ui/Charts/StatsLineChart.vue"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Statistics - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/stats",
		},
	],
	meta: [
		{
			name: "description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Statistics - Astria Explorer",
		},
		{
			property: "og:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/stats`,
		},
		{
			property: "og:image",
			content: "/img/seo/statistics.png",
		},
		{
			name: "twitter:title",
			content: "Statistics - Astria Explorer",
		},
		{
			name: "twitter:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/statistics.png",
		},
	],
})

const series = ref([
	{
		name: "bps",
		title: "Bytes/sec",
		data: [],
		units: "bytes",
		tooltip: "Bytes",
	},
	{
		name: "tps",
		title: "Txs/hour",
		data: [],
		tooltip: "Txs",
	},
	{
		name: "tx_count",
		title: "Txs Count",
		data: [],
		tooltip: "Txs",
	},
	{
		name: "bytes_in_block",
		title: "Bytes In Block",
		data: [],
		units: "bytes",
		tooltip: "Bytes",
	},
	{
		name: "data_size",
		title: "Data Usage",
		data: [],
		units: "bytes",
		tooltip: "Usage",
	},
])

const selectedChart = ref(series.value[0])

const periods = ref([
	{
		title: "31d",
		value: 31,
		timeframe: "day",
	},
	{
		title: "7d",
		value: 7,
		timeframe: "day",
	},
	{
		title: "24h",
		value: 24,
		timeframe: "hour",
	},
])

const selectedHighlightPeriodIdx = ref(0)
const selectedHighlightPeriod = computed(() => periods.value[selectedHighlightPeriodIdx.value])

const selectedChartPeriodIdx = ref(2)
const selectedChartPeriod = computed(() => periods.value[selectedChartPeriodIdx.value])

const chartViews = ref(["line-chart", "bar-chart"])
const selectedChartView = ref(chartViews.value[1])
</script>

<template>
	<Flex direction="column" gap="12" wide :class="$style.wrapper">
		<Flex align="center" gap="8">
			<Text
				v-for="(p, idx) in periods"
				@click="selectedHighlightPeriodIdx = idx"
				size="13"
				color="tertiary"
				:class="[$style.period, selectedHighlightPeriod.title === p.title && $style.active_period]"
			>
				{{ p.title }}
			</Text>
		</Flex>

		<Flex align="center" gap="10" :class="$style.small_charts_wrapper">
			<HighlightCard
				v-for="s in series"
				@click="selectedChart = s"
				:active="s.name === selectedChart.name"
				:series="s"
				:period="selectedHighlightPeriod"
			/>
		</Flex>

		<Flex align="center" justify="between" style="margin: 20px 0px 10px 0px">
			<Text size="16" weight="600" color="primary"> {{ selectedChart.title }} </Text>

			<Flex align="center" gap="16">
				<Flex align="center" gap="8">
					<Icon
						v-for="v in chartViews"
						@click="selectedChartView = v"
						:name="v"
						size="16"
						color="tertiary"
						:class="[$style.period, selectedChartView === v && $style.active_period]"
					/>
				</Flex>

				<Flex align="center" gap="8">
					<Text
						v-for="(p, idx) in periods"
						@click="selectedChartPeriodIdx = idx"
						size="13"
						color="tertiary"
						:class="[$style.period, selectedChartPeriod.title === p.title && $style.active_period]"
					>
						{{ p.title }}
					</Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.selected_chart">
			<StatsLineChart
				v-if="selectedChartView === 'line-chart'"
				:series="selectedChart"
				:period="selectedChartPeriod"
				:height="380"
				:class="$style.selected_chart"
			/>

			<StatsBarChart
				v-else-if="selectedChartView === 'bar-chart'"
				:series="selectedChart"
				:period="selectedChartPeriod"
				:height="380"
				:class="$style.selected_chart"
			/>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 60px;
	margin-bottom: 120px;
}

.selected_chart {
	min-width: 100%;

	position: relative;
	border-radius: 8px 8px 8px 8px;
	background: rgba(255, 255, 255, 1%);
}

.small_charts_wrapper {
	width: 100%;

	overflow-x: auto;
}

::-webkit-scrollbar {
	height: 2px;
}

.small_chart {
	min-width: 250px;

	background: rgba(255, 255, 255, 1%);
	border-radius: 8px 8px 8px 8px;

	cursor: pointer;

	&:hover {
		background: rgba(255, 255, 255, 2%);
	}

	&:active {
		transform: scale(101%);
		transition: all 0.3s ease;
	}
}

.small_chart_selected {
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: rgba(255, 255, 255, 2%);
}

.period {
	cursor: pointer;

	padding-bottom: 2px;
}
.active_period {
	color: var(--txt-primary);
	fill: var(--txt-primary);

	border-bottom: 1px solid var(--txt-primary);
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
