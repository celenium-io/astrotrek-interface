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
const blocks = computed(() => appStore.latestBlocks.slice(0, 45))
const blocksSnapshot = ref([])

const lastBlock = computed(() => !isPaused.value ? blocks?.value[0] : blocksSnapshot?.value[0])
const lastBlockSize = computed(() => lastBlock.value?.stats.bytes_in_block)
const lastBlockTxs = computed(() => lastBlock.value?.stats.tx_count)
const msxSize = computed(() => Math.max(...blocks.value?.map(b => b.stats.bytes_in_block)))

const calculateHeight = (size) => {
	return (size / msxSize.value) * 100
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
			<Flex direction="column " gap="10">
				<Text size="16" weight="600" color="primary"> Block <Text color="secondary">{{ comma(lastBlock?.height) }}</Text> </Text>

				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary"> {{ lastBlockTxs }} txs </Text>

					<div :class="$style.dot" />

					<Text size="14" weight="500" color="tertiary"> {{ formatBytes(lastBlockSize) }} </Text>
				</Flex>
			</Flex>

			<Flex direction="column" gap="12">
				<Flex align="end" gap="4" :class="$style.chart">
					<Flex v-for="b in !isPaused ? blocks : blocksSnapshot"
							:class="$style.bar"
							:style="{
								height: `${calculateHeight(b.stats.bytes_in_block)}%`
							}"
						/>
					<!-- <Tooltip v-for="b in !isPaused ? blocks : blocksSnapshot" position="start">
						<Flex
							:class="$style.bar"
							:style="{
								height: `${calculateHeight(b.stats.bytes_in_block)}%`
							}"
						/>

						<template #content>
							<Flex align="start" direction="column" gap="6">
								<Text> {{ comma(b.height) }}</Text>
								<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block) }}</Text>
							</Flex>
						</template>
					</Tooltip> -->
				</Flex>

				<Flex align="center" justify="between">
					<Flex align="center" gap="4">
						<Tooltip position="start">
							<Button @click="handlePause" type="tertiary" size="mini" :disabled="!lastHead?.synced">
								<Icon :name="isPaused ? 'resume' : 'pause'" size="12" color="tertiary" />
							</Button>

							<template v-if="lastHead?.synced" #content>
								<Flex align="start" direction="column" gap="6">
									<Text>Stop receiving new blocks</Text>
									<Text color="tertiary">Resuming will update the list of recent blocks</Text>
								</Flex>
							</template>
							<template v-else #content> Can't resume yet, wait for a synced head </template>
						</Tooltip>
						<Text size="12" weight="500" color="support">Receiving new blocks</Text>
					</Flex>

					<Text size="12" weight="500" color="tertiary">~2.8s</Text>
				</Flex>
			</Flex>
		</Flex>

		<Button wide size="medium" type="secondary"> View Blocks <Icon name="arrow-circle-right" size="14" color="tertiary" /> </Button>
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
}

.bar {
	width: 4px;

	background: var(--brand);
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>
