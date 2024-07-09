<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchAccountTransactions } from "@/services/api/account.js"

/** Services */
import { formatBytes, midHash, shortHash, spaces } from "@/services/utils"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import TransactionsList from "@/components/tables/TransactionsList.vue"

const props = defineProps({
	account: {
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
const fetchTxs = async () => {
	isLoadingTxs.value = true

	if (!props.account.signed_tx_count) {
		isLoadingTxs.value = false
		return
	}

	const { data } = await fetchAccountTransactions({
		hash: props.account.hash,
		limit: 6,
		sort: "desc",
	})
	txs.value = data.value || []

	isLoadingTxs.value = false
}

watch(
	() => props.show,
	() => {
		if (props.show) {
			fetchTxs()
		} else {
			txs.value = []
		}
	},
)
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide gap="16">
			<Flex direction="column" gap="16" :class="$style.content">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="8">
						<Icon name="account" size="12" color="secondary" />

						<Text size="13" weight="500" color="secondary"> Account </Text>

						<Tooltip v-if="account.bridge">
							<Icon name="bridge" size="18" color="brand" />

							<template #content>
								Bridge account
							</template>
						</Tooltip>
					</Flex>

					<Flex align="center" gap="8">
						<LinkToEntity
							@click="emit('onClose')"
							:entity="{ title: midHash(account.hash), type: 'account', id: account.hash}"
							mode="sidebar"
							color="primary"
							size="16"
							weight="600"
							height="120"
						/>

						<CopyButton :text="account.hash" />
					</Flex>
				</Flex>

				<NuxtLink @click="emit('onClose')" :to="`/block/${account.first_height}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">First Height</Text>

							<Text size="12" weight="600" color="tertiary">{{ spaces(account.first_height) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink>

				<div :class="$style.divider" />

				<Flex align="center" justify="between">
					<Text size="13" weight="600" color="primary">Signed Transactions</Text>

					<Text size="13" weight="600" color="primary">{{ account.signed_tx_count }}</Text>
				</Flex>

				<TransactionsList v-if="txs.length" :txs="txs.slice(0, 5)" />
				<Text v-else-if="isLoadingTxs" size="12" weight="500" color="tertiary">Loading txs...</Text>
				<Text v-else size="12" weight="500" color="tertiary">There is no transactions</Text>
				<Flex v-if="txs.length > 5" align="center" justify="center">
					<NuxtLink @click="emit('onClose')" :to="`/account/${account.hash}`">
						<Text size="12" weight="500" color="tertiary" :class="$style.link">View all transactions</Text>
					</NuxtLink>
				</Flex>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Balance</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ `${spaces(account.balances[0].value)} ${account.balances[0].currency.toUpperCase()}` }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Actions Count</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ account.actions_count }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Nonce</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ account.nonce }} </Text>
					</Flex>
				</Flex>
			</Flex>

			<Button @click="emit('onClose')" :link="`/account/${account.hash}`" type="secondary" size="medium">Open Account</Button>
		</Flex>
	</Sidebar>
</template>

<style module>
.card {
	border-radius: 6px;
	background: var(--op-8);
	cursor: pointer;

	padding: 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}

.content {
	height: 100%;
	overflow-y: auto;
}

.link {
	&:hover {
		color: var(--txt-primary);
	}
}
</style>
