<script setup>
/** UI */
import TransactionsTable from "@/components/tables/TransactionsTable.vue"
import Button from "@/components/ui/Button.vue"

/** API */
import { fetchLatestTransactions } from "@/services/api/tx"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const lastHead = computed(() => appStore.lastHead)
const transactions = ref([])

const getLatestTransactions = async () => {
	const { data } = await fetchLatestTransactions()
	transactions.value = data.value
}
getLatestTransactions()

const isPauseHovered = ref(false)

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
		getLatestTransactions()
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

			<NuxtLink to="/txs">
				<Flex align="center" gap="4">
					<Text size="13" weight="600" color="brand">View Transactions</Text>
					<Icon size="14" name="trend-up" color="brand" />
				</Flex>
			</NuxtLink>
		</Flex>

		<TransactionsTable :txs="!isPaused ? transactions : transactionsSnapshot" recentTxs />

		<Flex align="center" justify="between" :class="$style.bot">
			<Flex align="center" gap="6">
				<Button
					@click="handlePause"
					@mouseenter="isPauseHovered = true"
					@mouseleave="isPauseHovered = false"
					type="tertiary"
					size="mini"
					:disabled="!lastHead?.synced"
				>
					<template v-if="!isPauseHovered">
						<Icon :name="isPaused ? 'pause' : 'modem'" size="12" :color="isPaused ? 'yellow' : 'tertiary'" />
						<Text size="12" weight="500" :color="isPaused ? 'yellow' : 'tertiary'">
							{{ isPaused ? "Receiving new transactions is paused" : "Receiving new transactions" }}
						</Text>
					</template>

					<template v-else-if="isPauseHovered">
						<Icon :name="isPaused ? 'resume' : 'pause'" size="12" color="secondary" />
						<Text size="12" weight="500" color="secondary">
							{{ isPaused ? "Resume receiving new transactions" : "Pause receiving new transactions" }}
						</Text>
					</template>
				</Button>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 636px;

	border-radius: 12px;
	background: var(--card-background);

	padding: 16px 0 8px 0;
}

.top {
	margin-bottom: 20px;
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
	padding: 8px 16px 0 8px;
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
