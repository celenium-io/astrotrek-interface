<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "~/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

/** Components */
import SmallLineChart from "~/components/modules/stats/SmallLineChart.vue"
import LineChart from "@/components/ui/Charts/LineChart.vue"
import BarChart from "@/components/ui/Charts/BarChart.vue"

/** API */
import { fetchSeries } from "@/services/api/stats"
import { onBeforeMount } from "vue"

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
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:title",
			content: "Statistics - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/stats`,
		},
		{
			property: "og:image",
			content: "/img/seo/validators.png",
		},
		{
			name: "twitter:title",
			content: "Statistics - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/validators.png",
		},
	],
})

const series = ref([
	{
		name: 'data_size',
		title: 'Data Usage',
		data: [],
		units: 'bytes',
		tooltip: 'Usage',
	},
	{
		name: 'tps',
		title: 'Txs/sec',
		data: [],
		tooltip: 'Txs',
	},
	{
		name: 'bps',
		title: 'Bytes/sec',
		data: [],
		units: 'bytes',
		tooltip: 'Bytes',
	},
	{
		name: 'tx_count',
		title: 'Txs Count',
		data: [],
		tooltip: 'Txs',
	},
	{
		name: 'bytes_in_block',
		title: 'Bytes In Block',
		data: [],
		units: 'bytes',
		tooltip: 'Bytes',
	},
])
const selectedChart = ref({})

const periods = ref([
	{
		title: "Last 24 hours",
		value: 24,
		timeframe: "hour",
	},
	{
		title: "Last 7 days",
		value: 7,
		timeframe: "day",
	},
	{
		title: "Last 31 days",
		value: 31,
		timeframe: "day",
	},
])
const selectedPeriodIdx = ref(1)
const selectedPeriod = computed(() => periods.value[selectedPeriodIdx.value])

const initialPeriod = ref({
	title: "Last 7 days",
	value: 7,
	timeframe: "day",
})

const isLoading = ref(true)

const loadData = async () => {
	isLoading.value = true

	series.value.forEach(async (s) => {
		s.data = await loadSeries(s, initialPeriod.value)
		s.period = initialPeriod.value
	})

	selectedChart.value = series.value[0]

	isLoading.value = false
}

const loadSeries = async (s, period) => {
	let rawData = await fetchSeries({
		name: s.name,
		timeframe: period.timeframe,
		from: parseInt(
			DateTime.now().minus({
				days: period.timeframe === "day" ? period.value : 0,
				hours: period.timeframe === "hour" ? period.value : 0,
			}).ts / 1_000,
		),
	})

	let resultData = []
	let seriesMap = {}
	rawData.forEach((item) => {
		seriesMap[DateTime.fromISO(item.time).toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")] =
			item.value
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

	return resultData
}

const selectChart = async (s) => {
	// JSON.parse(JSON.stringify(s))
	selectedChart.value = s

	if (s.period !== selectedPeriod.value) {
		selectedChart.value.period = selectedPeriod.value
		selectedChart.value.data = await loadSeries(selectedChart.value, selectedPeriod.value)
	}
}

await loadData()

watch(
	() => selectedPeriod.value,
	async () => {
		selectedChart.value.period = selectedPeriod.value
		selectedChart.value.data = await loadSeries(selectedChart.value, selectedPeriod.value)
	},
)
</script>

<template>
	<Flex direction="column" gap="12" wide :class="$style.wrapper">
		<Flex align="center" justify="between">
			<Text color="primary"> {{ selectedChart.title }} </Text>

			<Flex align="center" gap="6" :class="$style.pagination">
				<Dropdown>
					<Button size="mini" type="secondary">
						{{ selectedPeriod.title }}
						<Icon name="chevron" size="14" color="secondary" />
					</Button>

					<template #popup>
						<DropdownItem v-for="(period, idx) in periods" @click="selectedPeriodIdx = idx">
							<Flex align="center" gap="8">
								<Icon :name="idx === selectedPeriodIdx ? 'check' : ''" size="12" color="secondary" />
								{{ period.title }}
							</Flex>
						</DropdownItem>
					</template>
				</Dropdown>
			</Flex>
		</Flex>
		<Flex align="center" :class="$style.selected_chart">
			<LineChart
				:data="selectedChart.data"
				:period="selectedChart.period || selectedPeriod"
				:units="selectedChart.units"
				:tooltip="selectedChart.tooltip"
				height="380"
				:class="$style.selected_chart"
			/>
		</Flex>

		<Flex>
			<BarChart
				:data="selectedChart.data"
				:period="selectedChart.period || selectedPeriod"
				:units="selectedChart.units"
				:tooltip="selectedChart.tooltip"
				height="380"
				:class="$style.selected_chart"
			/>
		</Flex>

		<Flex align="center" gap="10" :class="$style.small_charts_wrapper">
			<SmallLineChart
				v-for="s in series"
				@click="selectChart(s)"
				:data="s.data"
				:title="s.title"
				:period="initialPeriod"
				:units="s.units"
				:class="[$style.small_chart, selectedChart === s && $style.small_chart_selected]"
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
	min-height: 380px;

	overflow-x: auto;
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

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
