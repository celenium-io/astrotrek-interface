<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { shortHash, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"
import TransactionsList from "@/components/tables/TransactionsList.vue";

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

const txs = ref([
	{
		"id": 8105,
		"height": 2056715,
		"position": 2,
		"gas_wanted": 0,
		"gas_used": 0,
		"actions_count": 1,
		"nonce": 572,
		"hash": "4df95d25528c0d2eec5081589cbc012b8b8b0ea73b61bbda084bf85784c0d84f",
		"signature": "9ccb68de0195eb0de1b328adf6e66676d97a5e05b868452b3e3aa4e9e9e2913991e3182a6bdfcfe79f637a9c940a62fdcb1a3386e13a0b0621610fa544d73601",
		"signer": "36cb0c58e0bef354c443f320811c7b939ed5c0cd",
		"time": "2024-03-08T22:25:03.197005Z",
		"status": "success",
		"action_types": [
			"sequence",
			"transfer",
			"transfer1",
			"transfer2",
			"transfer3",
		]
	},
	{
		"id": 8104,
		"height": 2056649,
		"position": 2,
		"gas_wanted": 0,
		"gas_used": 0,
		"actions_count": 1,
		"nonce": 571,
		"hash": "fd7c1e46d7fee5df4a10cfc31e34c940fb8b16586c939a80f3ccc322d1182de4",
		"signature": "d7a1975e45a0ff8490e98aabef079a7b72e8828b83c7b956095b92e99378386320757468ff5522823ad4f1ae97d88a39222a6429a74f81c2c2890239a64ac106",
		"signer": "36cb0c58e0bef354c443f320811c7b939ed5c0cd",
		"time": "2024-03-08T22:22:22.494216Z",
		"status": "success",
		"action_types": [
			"sequence"
		]
	},
])

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

				<Text size="12" weight="500" color="secondary">{{ DateTime.fromISO(block.time).setLocale("en").toFormat("LLL d, y, tt") }}</Text>

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
				<!-- <TransactionsList v-if="block.stats.tx_count > 0" :txs="1" /> -->
				<TransactionsList :txs="txs" />

				<div :class="$style.divider" />


				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.hash) }}
							</Text>

							<CopyButton :text=block.hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Parent Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.parent_hash) }}
							</Text>

							<CopyButton :text=block.parent_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Last Commit Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.last_commit_hash) }}
							</Text>

							<CopyButton :text=block.last_commit_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Data Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.data_hash) }}
							</Text>

							<CopyButton :text=block.data_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Validators Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.validators_hash) }}
							</Text>

							<CopyButton :text=block.validators_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Consensus Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.consensus_hash) }}
							</Text>

							<CopyButton :text=block.consensus_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">App Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.app_hash) }}
							</Text>

							<CopyButton :text=block.app_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Evidence Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.evidence_hash) }}
							</Text>

							<CopyButton :text="block.evidence_hash" />
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Button type="secondary" size="medium">Open Block</Button>
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
