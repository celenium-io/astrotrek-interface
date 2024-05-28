<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { comma, formatBytes, spaces } from "@/services/utils"

/** API */
import { fetchSeries } from "@/services/api/stats"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const lastHead = computed(() => appStore.lastHead)

const chartEl = ref(null)
const chartWidth = computed(() => chartEl.value?.wrapper?.offsetWidth)
const barWidth = computed(() => Math.max(Math.round((chartWidth.value - chartWidth.value * 0.23) / 24) - 2, 4))
const marginBar = computed(() => (chartWidth.value - barWidth * 24) / 23)

const dataSizeSeries = ref([])
const getDataSizeSeries = async () => {
	const data = await fetchSeries({
		name: "data_size",
		timeframe: "hour",
		from: parseInt(DateTime.now().minus({ days: 1 }).ts / 1_000),
	})
	if (data) {
		dataSizeSeries.value = data.sort((a, b) => new Date(a.time) - new Date(b.time))
	}
}

await getDataSizeSeries()

const totalDataSize = computed(() => dataSizeSeries.value.reduce((acc, curr) => acc + parseInt(curr.value), 0))
const maxSize = computed(() => Math.max(...dataSizeSeries.value?.map((s) => s.value)))
const calculateHeight = (size) => {
	return 20 + (size / maxSize.value) * 80
}
</script>

<template>
	<Flex direction="column" justify="between" :class="$style.wrapper">
		<Flex direction="column" gap="8">
			<Text size="16" weight="600" color="primary"> Rollups Analysis </Text>

			<Flex direction="column" gap="2">
				<Text size="14" weight="500" color="tertiary" height="140"> In the last <Text color="secondary">24</Text> hours, </Text>
				<Text size="14" weight="500" color="secondary"
					>{{ formatBytes(totalDataSize) }}
					<Text color="tertiary" height="140">have been pushed</Text>
				</Text>
			</Flex>
		</Flex>

		<Flex ref="chartEl" :class="$style.chart">
			<Tooltip v-for="(ds, index) in dataSizeSeries" :style="{width: '100%'}">
				<Flex
					align="end"
					:class="$style.bar_wrapper"
					:style="{
						marginLeft: index !== 0 ? `${marginBar}px` : '0px',
						width: `${barWidth}px`,
					}"
				>
					<Flex
						:class="$style.bar"
						:style="{
							width: `${barWidth}px`,
							height: `${calculateHeight(ds.value)}%`,
						}"
					/>
				</Flex>

				<template #content>
					<Flex align="center" direction="column" gap="6">
						<Text> {{ DateTime.fromISO(ds.time).setLocale("en").toFormat("t") }}</Text>
						<Text color="tertiary">{{ formatBytes(ds.value) }}</Text>
					</Flex>
				</template>
			</Tooltip>
		</Flex>

		<Flex direction="column" gap="8">
			<Text size="28" weight="500" color="primary"> {{ comma(lastHead.total_rollups) }} </Text>

			<Flex align="center" justify="between">
				<Text size="12" weight="500" color="tertiary">Total Rollups</Text>

				<NuxtLink to="/rollups">
					<Flex align="center" gap="4">
						<Text size="12" weight="600" color="brand">View Rollups</Text>
						<Icon size="12" name="trend-up" color="brand" />
					</Flex>
				</NuxtLink>
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

.chart {
	width: 100%;
	height: 32px;
}

.chart:hover .bar_wrapper:not(:hover) .bar {
	background: var(--txt-support);
}

.bar_wrapper {
	height: 32px;
	background: var(--op-8);
	border-radius: 3px;
}

.bar {
	border-radius: 3px;
	background: var(--brand);

	transition: all 0.2s ease;
}

.bar:hover {
	background: var(--brand);
}
</style>
