<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { comma, formatBytes, splitAddress } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const blocks = computed(() => appStore.latestBlocks.slice(0, 5))
const lastHead = computed(() => appStore.lastHead)

const blocksSnapshot = ref([])
const isPaused = ref(false)
const handlePause = () => {
	if (!lastHead?.value.synced) return

	isPaused.value = !isPaused.value
}

watch(
	() => isPaused.value,
	() => {
		if (isPaused.value) {
			blocksSnapshot.value = [...blocks.value]
		} else {
			blocksSnapshot.value = []
		}
	},
)

</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex justify="between" align="start" wide :class="$style.top">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Recent Blocks</Text>
				<Text size="14" weight="500" color="tertiary">The latest blocks</Text>
			</Flex>

			<Flex align="center" gap="4">
				<Text size="13" weight="600" color="brand">View Blocks</Text>
				<Icon size="14" name="trend-up" color="brand" />
			</Flex>
		</Flex>

		<Flex direction="column" :class="$style.rows">
			<Flex v-for="b in !isPaused ? blocks : blocksSnapshot" justify="between" align="center" :class="$style.row">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="8">
						<Icon name="block" size="16" color="secondary" />

						<Text size="13" weight="600" color="primary"> {{ comma(b.height) }} </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Proposer</Text>
							{{ splitAddress(b.proposer.address) }}
						</Text>

						<div :class="$style.dot" />

						<Text size="12" weight="500" color="secondary">
							{{ formatBytes(b.stats.bytes_in_block, 2, 'number') }}
							<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block, 2, 'unit') }}</Text>
						</Text>
					</Flex>
				</Flex>

				<Flex direction="column" align="end" gap="8">
					<Flex align="center" gap="4">
						<Icon name="tx-circle" size="12" color="light-green" />
						<Text size="13" weight="600" color="primary"> {{ b.stats.tx_count }} <Text color="secondary">Txs</Text> </Text>
					</Flex>

					<Text size="12" weight="500" color="tertiary">
						{{ DateTime.fromISO(b.time).toRelative({ locale: "en", style: "short" }) }}
					</Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" gap="6" :class="$style.bot">
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
	</Flex>
</template>

<style module>
.wrapper {
	flex: 1;

	border-radius: 12px;
	background: var(--card-background);

	padding: 16px 0 14px 0;
}

.top {
	padding: 0 16px;
}

.rows {
	margin-top: 20px;
}

.row {
	height: 60px;

	border-top: 1px solid var(--op-5);
	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&:active {
		background: var(--op-10);
	}

	&:last-child {
		border-bottom: 1px solid var(--op-5);
	}
}

.small_dot {
	width: 2px;
	height: 2px;

	border-radius: 50%;
	background: var(--txt-secondary);
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

.bot {
	padding: 14px 16px 0 16px;
}
</style>
