<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import SmallLineChart from "~/components/modules/stats/SmallLineChart.vue";

/** API */
import { fetchSeries } from "@/services/api/stats"

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

const period = 	ref({
	title: "Last 24 hours",
	value: 24,
	timeframe: "hour",
})

const timeframe = ref('hour')
const from = ref(parseInt(DateTime.now().minus({ hours: 24 }).ts / 1_000))
const series = ['data_size', 'tps', 'bps', 'tx_count']
const data = ref({})

const loadData = async () => {
	series.forEach(async (s) => {
		let rawData = await fetchSeries({
			name: s,
			timeframe: timeframe.value,
			from: from.value,
		})
		
		let resultData = []
		let seriesMap = {}
		rawData.forEach((item) => {
			seriesMap[DateTime.fromISO(item.time).toFormat("y-LL-dd-HH")] =
				item.value
		})

		for (let i = 1; i < 24 + 1; i++) {
			const dt = DateTime.now().minus({
				hours: 24 - i,
			})
			resultData.push({
				date: dt.toJSDate(),
				value: parseInt(seriesMap[dt.toFormat("y-LL-dd-HH")]) || 0,
			})
		}


		data.value[s] = resultData
		
	})

	console.log('data.value', data.value);
}

await loadData()

// watch(
// 	() => page.value,
// 	() => {
// 		getValidators()
// 	},
// )
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex align="center" gap="12" :class="$style.small_charts_wrapper">
			<SmallLineChart
				v-for="d in Object.keys(data)"
				:data="data[d]"
				:title="d"
				:period="period"
				:class="$style.small_chart"
			/>
		</Flex>
		<!-- <Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Validators</Text>

				<Flex align="center" gap="6">
					<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1 || isLoading">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
					</Button>
					<Button size="mini" type="secondary">Page {{ page }}</Button>
					<Button @click="handleNext" size="mini" type="secondary" :disabled="isLoading || handleNextCondition">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
					</Button>
				</Flex>
			</Flex>

			<ValidatorsTable :validators="validators" :isLoading="isLoading" />
		</Flex> -->
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 60px;
	margin-bottom: 120px;
}

.small_charts_wrapper {
	width: 100%;
}

.small_chart {
	width: 25%;
	background: var(--op-3)
}

.card {
	border-radius: 8px;
	background: var(--op-3);

	padding: 16px 0 0 0;
}

.top {
	padding: 0 16px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
