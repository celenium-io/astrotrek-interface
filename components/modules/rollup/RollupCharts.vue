<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchRollupSeries } from "@/services/api/stats.js";

/** Services */
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** UI */
import LineChart from "@/components/ui/Charts/LineChart.vue"

const props = defineProps({
	rollup: {
		type: Object,
		required: true,
	},
	period: {
		type: Object,
		required: true,
	},
	hide: {
		type: Array,
		default: [],
	}
})

const getRollupSeries = async (name) => {
	const resultData = []
	const rawData = await fetchRollupSeries({
		id: getRollupHashSafeURL(props.rollup?.hash),
		name: name,
		timeframe: props.period.timeframe,
		from: parseInt(
			DateTime.now().minus({
				days: props.period.timeframe === "day" ? props.period.value : 0,
				hours: props.period.timeframe === "hour" ? props.period.value : 0,
			}).ts / 1_000,
		),
	})

	const seriesMap = {}
	rawData.forEach((item) => {
		seriesMap[DateTime.fromISO(item.time).toFormat(props.period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")] =
			item.value
	})

	for (let i = 1; i < props.period.value + 1; i++) {
		const dt = DateTime.now().minus({
			days: props.period.timeframe === "day" ? props.period.value - i : 0,
			hours: props.period.timeframe === "hour" ? props.period.value - i : 0,
		})
		resultData.push({
			date: dt.toJSDate(),
			value: parseInt(seriesMap[dt.toFormat(props.period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")]) || 0,
		})
	}

	return resultData
}

const sizeSeries = ref([])
const actionsSeries = ref([])

const fetchData = async () => {
	if (!props.hide.includes("size")) {
		getRollupSeries("size").then((res) => sizeSeries.value = res)
	}
	
	if (!props.hide.includes("actions_count")) {
		getRollupSeries("actions_count").then((res) => actionsSeries.value = res)
	}
}

await fetchData()

watch(
	() => props.period,
	() => {
		fetchData()
	},
)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LineChart v-if="sizeSeries.length > 0" title="Data Usage" :data="sizeSeries" :period="period" units="bytes" tooltip="Pushed" />

		<LineChart v-if="actionsSeries.length > 0" title="Actions Count" :data="actionsSeries" :period="period" tooltip="Actions" />
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;

	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}
</style>
