<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** API */
import { fetchLatestTransactions } from "@/services/api/tx"

/** Services */
import { capitalize, comma, shortHash, splitAddress } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const lastHead = computed(() => appStore.lastHead)
const transactions = ref([])

const getLatestTransactionss = async () => {
	const { data } = await fetchLatestTransactions()
	transactions.value = data.value
}
getLatestTransactionss()

const transactionsSnapshot = ref([])
const isPaused = ref(false)
const handlePause = () => {
	if (!lastHead?.value.synced) return

	isPaused.value = !isPaused.value
}

watch(
	() => isPaused.value,
	() => {
		if (isPaused.value) {
			transactionsSnapshot.value = [...transactions.value]
		} else {
			transactionsSnapshot.value = []
		}
	},
)

watch(
	() => lastHead,
	() => {
		getLatestTransactionss()
	},
)

</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex justify="between" align="start" wide :class="$style.top">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Recent Transactions</Text>
				<Text size="14" weight="500" color="tertiary">The latest transactions</Text>
			</Flex>

			<Flex align="center" gap="4">
				<Text size="13" weight="600" color="brand">View Transactions</Text>
				<Icon size="14" name="trend-up" color="brand" />
			</Flex>
		</Flex>

		<Flex direction="column" :class="$style.rows">
			<Flex v-for="t in !isPaused ? transactions : transactionsSnapshot" justify="between" align="center" :class="$style.row">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="8">
						<Icon name="tx-circle" size="16" :color=" t.status === 'success' ? 'light-green' : 'red'" />

						<Flex align="center" gap="8">
							<Flex align="center" gap="6">
								<Text size="13" weight="600" color="primary">
									<!-- <Text color="secondary">0x</Text> -->
									{{ shortHash(t.hash) }}
								</Text>
							</Flex>

							<Text v-for="action in t.action_types " size="13" weight="600" color="tertiary">
								{{ capitalize(action) }} 
							</Text>
						</Flex>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Signer</Text>
							{{ splitAddress(t.signer, 8) }}
						</Text>

						<!-- <div :class="$style.dot" />

						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Fee</Text>
							0.04
						</Text> -->

						<!-- <div :class="$style.dot" />

						<Text size="12" weight="500" color="tertiary"> 0x38bd...24B3 -> 0x38bd...24B3 </Text> -->
					</Flex>
				</Flex>

				<Flex direction="column" align="end" gap="8">
					<!-- <Flex align="center" gap="4">
						<Icon name="check-circle" size="12" color="tertiary" />
						<Text size="13" weight="600" color="primary"> 0.05 <Text color="secondary">RIA</Text> </Text>
					</Flex> -->

					<Text size="12" weight="500" color="tertiary">
						{{ DateTime.fromISO(t.time).toRelative({ locale: "en", style: "short" }) }}
					</Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" justify="between" :class="$style.bot">
			<Flex align="center" gap="6">
				<Tooltip position="start">
					<Button @click="handlePause" type="tertiary" size="mini" :disabled="!lastHead?.synced">
						<Icon :name="isPaused ? 'resume' : 'pause'" size="12" color="tertiary" />
					</Button>

					<template v-if="lastHead?.synced" #content>
						<Flex align="start" direction="column" gap="6">
							<Text>Stop receiving new transactions</Text>
							<Text color="tertiary">Resuming will update the list of recent transactions</Text>
						</Flex>
					</template>
					<template v-else #content> Can't resume yet, wait for a synced head </template>
				</Tooltip>
				<Text size="12" weight="500" color="support">Receiving new transactions</Text>
			</Flex>

			<!-- <Flex align="center" gap="4">
				<Text size="12" weight="600" color="tertiary"> Sort by <Text color="secondary">Time</Text> </Text>
				<Icon name="chevron" size="12" color="secondary" />
			</Flex> -->
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 636px;

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
