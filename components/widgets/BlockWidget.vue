<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "~/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { formatBytes, spaces } from "@/services/utils"

/** API */
import { fetchSeries } from "@/services/api/stats"

/** Store */
import { useAppStore } from "@/store/app"
import { useSidebarsStore } from "@/store/sidebars"
const appStore = useAppStore()
const sidebarsStore = useSidebarsStore()

const blocks = computed(() => appStore.latestBlocks.slice(0, 44).sort((a, b) => a.height - b.height))

const lastBlock = computed(() => blocks?.value.slice(-1)[0])
const lastBlockSize = computed(() => lastBlock.value?.stats.bytes_in_block)
const lastBlockTxs = computed(() => lastBlock.value?.stats.tx_count)
const maxSize = computed(() => Math.max(...blocks.value?.map((b) => b.stats.bytes_in_block)))
const avgBlockTime = ref(2.4)

const getAvgBlockTime = async () => {
	const data = await fetchSeries({
		table: "block_time",
		period: "hour",
		from: parseInt(DateTime.now().minus({ hours: 3 }).ts / 1_000),
	})

	if (data) {
		avgBlockTime.value = 0
		data.forEach((item) => {
			avgBlockTime.value += parseFloat(item.value)
		})

		avgBlockTime.value = (avgBlockTime.value / data.length / 1_000).toFixed(1)
	}
}

const calculateHeight = (size) => {
	return (size / maxSize.value) * 100
}

await getAvgBlockTime()

const chartBlocksEl = ref(null)
const chartWidth = computed(() => chartBlocksEl.value?.wrapper?.offsetWidth)
const barWidth = computed(() => Math.max(Math.round((chartWidth.value - chartWidth.value * 0.43) / 44), 4))
const marginBar = computed(() => (chartWidth.value - barWidth * 44) / 43)
// const barWidth = computed(() => Math.max(Math.round(chartWidth.value / 100), 4))
// const marginBar = computed(() => (chartWidth.value - (44 * barWidth.value)) / 43)

onMounted(() => {
	// chartWidth.value = chartEl.value.wrapper.offsetWidth
	console.log(chartWidth.value);
})


</script>

<template>
	<Flex direction="column" gap="20" :class="$style.wrapper">
		<Flex direction="column" gap="16" :style="{max_width: '100%', width: '100%'}">
			<Flex direction="column" gap="10">
				<Flex align="center" gap="6">
					<Text size="16" weight="600" color="primary"> Block </Text>
					<AnimatedNumber v-if="lastBlock?.height" :text="lastBlock.height.toString()" />
				</Flex>

				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary"> {{ lastBlockTxs }} txs </Text>

					<div :class="$style.dot" />

					<Text size="14" weight="500" color="tertiary"> {{ formatBytes(lastBlockSize) }} </Text>
				</Flex>
			</Flex>

			<Flex direction="column" gap="12" :style="{max_width: '100%', width: '100%'}">
				<Flex ref="chartBlocksEl" align="end" :class="$style.chart">
					<Tooltip v-for="(b, index) in blocks" :style="{max_width: '100%', width: '100%'}">
						<Flex
							align="end"
							:class="$style.bar_wrapper"
							:style="{
								marginLeft: index !== 0 ? `${marginBar}px` : '0px',
								width: `${barWidth}px`,
							}"
						>
							<Flex
								@click="sidebarsStore.open('block', b)"
								:class="$style.bar"
								:style="{
									width: `${barWidth}px`,
									height: `${calculateHeight(b.stats.bytes_in_block)}%`,
								}"
							/>
						</Flex>

						<template #content>
							<Flex align="center" direction="column" gap="6">
								<Text> {{ spaces(b.height) }}</Text>
								<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block) }}</Text>
							</Flex>
						</template>
					</Tooltip>
				</Flex>

				<Flex align="center" justify="between">
					<Text size="12" weight="500" color="support">Average block time</Text>

					<Text size="12" weight="500" color="tertiary">~ {{ avgBlockTime }} s</Text>
				</Flex>
			</Flex>
		</Flex>

		<NuxtLink to="/blocks">
			<Button wide size="medium" type="secondary"> View Blocks <Icon name="arrow-circle-right" size="14" color="tertiary" /> </Button>
		</NuxtLink>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 100%;
	width: 100%;
	/* width: 380px; */

	background: var(--card-background);
	border-radius: 12px;

	padding: 16px;
}

.chart {
	height: 32px;

	&:hover {
		.bar:not(:hover) {
			background: var(--txt-support);
		}
	}
}

.bar_wrapper {
	height: 32px;
	background: var(--op-8);
	border-radius: 50px;
}

.bar {
	/* width: 4px; */

	background: var(--brand);
	border-radius: 50px;

	transition: all 0.2s ease;
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

.receiving_button {
	box-shadow: none !important;
}

.receiving_button:hover {
	box-shadow: inset 0 0 0 1px var(--op-5) !important;
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}

	.chart {
		width: 100%;
		/* gap: 5px; */
	}

	.bar_wrapper {
		width: 100%;
	}

	/* .bar {
		width: 5px;
	} */
}

</style>
