<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { comma, formatBytes } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const lastHead = computed(() => appStore.lastHead)
const blocks = computed(() => appStore.latestBlocks.slice(0, 44).sort((a, b) => a.height - b.height))
const blocksSnapshot = ref([])

const lastBlock = computed(() => (!isPaused.value ? blocks?.value.slice(-1)[0] : blocksSnapshot?.value.slice(-1)[0]))
const lastBlockSize = computed(() => lastBlock.value?.stats.bytes_in_block)
const lastBlockTxs = computed(() => lastBlock.value?.stats.tx_count)
const maxSize = computed(() => Math.max(...blocks.value?.map((b) => b.stats.bytes_in_block)))

const calculateHeight = (size) => {
	return (size / maxSize.value) * 100
}

const isPaused = ref(false)
const handlePause = () => {
	if (!lastHead?.value.synced) return

	isPaused.value = !isPaused.value
}

watch(
	() => isPaused.value,
	() => {
		if (isPaused.value) {
			blocksSnapshot.value = [...blocks.value.slice(0, 45)]
		} else {
			blocksSnapshot.value = []
		}
	},
)
</script>

<template>
	<Flex direction="column" gap="20" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Flex direction="column" gap="10">
				<Text size="16" weight="600" color="primary">
					Block <Text color="secondary">{{ comma(lastBlock?.height) }}</Text>
				</Text>

				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary"> {{ lastBlockTxs }} txs </Text>

					<div :class="$style.dot" />

					<Text size="14" weight="500" color="tertiary"> {{ formatBytes(lastBlockSize) }} </Text>
				</Flex>
			</Flex>

			<Flex direction="column" gap="12">
				<Flex align="end" gap="4" :class="$style.chart">
					<Tooltip v-for="b in !isPaused ? blocks : blocksSnapshot" style="height: 100%">
						<Flex
							:class="$style.bar"
							:style="{
								height: `${calculateHeight(b.stats.bytes_in_block)}%`,
							}"
						/>

						<template #content>
							<Flex align="center" direction="column" gap="6">
								<Text> {{ comma(b.height) }}</Text>
								<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block) }}</Text>
							</Flex>
						</template>
					</Tooltip>
				</Flex>

				<Flex align="center" justify="between">
					<Text size="12" weight="500" color="support">Average block time</Text>

					<Text size="12" weight="500" color="tertiary">~2.8s</Text>
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
	width: 380px;

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

.bar {
	width: 4px;

	background: var(--brand);

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
}
</style>
