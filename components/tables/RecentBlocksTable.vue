<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"

/** Services */
import { comma, formatBytes, splitAddress } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
import { useSidebarsStore } from "@/store/sidebars"
const appStore = useAppStore()
const sidebarsStore = useSidebarsStore()

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

			<NuxtLink to="/blocks">
				<Flex align="center" gap="4">
					<Text size="13" weight="600" color="brand">View Blocks</Text>
					<Icon size="14" name="trend-up" color="brand" />
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex direction="column" :class="$style.rows">
			<Flex
				@click="sidebarsStore.open('block')"
				v-for="b in !isPaused ? blocks : blocksSnapshot"
				justify="between"
				align="center"
				:class="$style.row"
			>
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
							{{ formatBytes(b.stats.bytes_in_block, 2, "number") }}
							<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block, 2, "unit") }}</Text>
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
			<Button @click="handlePause" type="tertiary" size="mini" :disabled="!lastHead?.synced">
				<Icon :name="isPaused ? 'resume' : 'pause'" size="12" color="tertiary" />
				<Text size="12" weight="500" color="tertiary">{{ isPaused ? "Resume receiving new blocks" : "Pause receiving new blocks" }}</Text>
			</Button>
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
	padding: 14px 16px 0 8px;
}
</style>
