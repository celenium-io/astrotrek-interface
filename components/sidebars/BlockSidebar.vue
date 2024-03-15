<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchTransactionsByBlock } from "@/services/api/tx"

/** Services */
import { formatBytes, shortHash, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"
import TransactionsList from "@/components/tables/TransactionsList.vue"

const props = defineProps({
	block: {
		type: Object,
		requiered: true,
	},
	show: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["onClose"])

const isLoadingTxs = ref(true)
const txs = ref([])
const getTransactions = async () => {
	isLoadingTxs.value = true

	if (!props.block.stats.tx_count) {
		isLoadingTxs.value = false
		return
	}

	const { data } = await fetchTransactionsByBlock({ height: props.block.height })
	txs.value = data.value || []

	isLoadingTxs.value = false
}

watch(
	() => props.show,
	() => {
		if (props.show) {
			getTransactions()
		} else {
			txs.value = []
		}
	},
)
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide>
			<Flex direction="column" gap="16">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Icon name="block" size="12" color="secondary" />
						<Text size="13" weight="500" color="secondary"> Block </Text>
					</Flex>
					<Text size="16" weight="600" height="120" color="primary"> {{ spaces(block.height) }} </Text>
				</Flex>

				<Flex align="center" justify="between">
					<Text size="12" weight="500" color="secondary">{{ formatBytes(block.stats.bytes_in_block) }}</Text>

					<Text size="12" weight="500" color="secondary">{{
						DateTime.fromISO(block.time).setLocale("en").toFormat("LLL d, y, tt")
					}}</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.proposer">
					<Text size="12" weight="600" color="secondary">Proposer</Text>
					<Text size="13" weight="600" color="primary"> {{ block.proposer?.name }}</Text>
					<Text size="12" weight="600" color="tertiary">{{ block.proposer?.address }}</Text>
				</Flex>

				<div :class="$style.divider" />
				<Flex align="center" justify="between">
					<Text size="13" weight="600" color="primary">Transactions</Text>
					<Text size="13" weight="600" color="primary">{{ block.stats.tx_count }}</Text>
				</Flex>

				<TransactionsList v-if="txs.length" :txs="txs" />
				<Text v-else-if="isLoadingTxs" size="12" weight="500" color="tertiary">Loading txs...</Text>
				<Text v-else size="12" weight="500" color="tertiary">There is no transactions in the block</Text>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.hash) }}
							</Text>

							<CopyButton :text="block.hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Parent Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.parent_hash) }}
							</Text>

							<CopyButton :text="block.parent_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Last Commit Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.last_commit_hash) }}
							</Text>

							<CopyButton :text="block.last_commit_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Data Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.data_hash) }}
							</Text>

							<CopyButton :text="block.data_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Validators Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.validators_hash) }}
							</Text>

							<CopyButton :text="block.validators_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Consensus Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.consensus_hash) }}
							</Text>

							<CopyButton :text="block.consensus_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">App Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.app_hash) }}
							</Text>

							<CopyButton :text="block.app_hash" />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Evidence Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(block.evidence_hash) }}
							</Text>

							<CopyButton :text="block.evidence_hash" />
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Button @click="emit('onClose')" :link="`/block/${block.height}`" type="secondary" size="medium">Open Block</Button>
		</Flex>
	</Sidebar>
</template>

<style module>
.proposer {
	border-radius: 6px;
	background: var(--op-8);

	padding: 8px;
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}
</style>
