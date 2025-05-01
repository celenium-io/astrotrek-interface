<script setup>
/** API */
import { fetchAccountByHash, fetchAccountTransactions } from "@/services/api/account.js"

/** Services */
import { midHash, spaces } from "@/services/utils"
import { getRollupHashSafeURL } from "@/services/utils/rollups"
import { getAssetName } from "@/services/utils/actions.js"

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
	async () => {
		if (props.show) {
			if (props.account.is_bridge) {
				const { data } = await fetchAccountByHash(props.account.hash)
				props.account.bridge = data?.value?.bridge
			}

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

						<Tooltip v-if="account?.is_bridge">
							<Icon name="bridge" size="16" color="brand" />

							<template #content>
								Bridge account
							</template>
						</Tooltip>

						<Tooltip v-if="account?.is_sudo || account?.is_ibc_sudo">
							<Icon name="role" size="14" color="brand" />

							<template #content>
								{{ `Has
									${account?.is_sudo ? ' Sudo' : ''}
									${account?.is_ibc_sudo
										? account?.is_sudo ? ' and IBC Sudo roles' : ' IBC Sudo role'
										: 'role'}`
								}}
							</template>
						</Tooltip>

						<Tooltip v-if="account?.is_ibc_relayer">
							<Icon name="relayer" size="18" color="brand" />

							<template #content>
								IBC Relayer
							</template>
						</Tooltip>
					</Flex>

					<Flex align="center" gap="8">
						<LinkToEntity
							@click="emit('onClose')"
							:entity="{ title: $getDisplayName('addresses', null, account), type: 'account', id: account.hash}"
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

				<div v-if="account.bridge" :class="$style.divider" />

				<Flex v-if="account.bridge" direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Bridge Info</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Rollup</Text>

						<Flex align="center" gap="8">
							<CopyButton :text="account.bridge?.rollup" />

							<NuxtLink :to="`/rollup/${getRollupHashSafeURL(account.bridge?.rollup)}`" target="_blank">
								<Flex align="center" gap="4">
									<Text size="13" weight="600" color="primary">{{ midHash(account.bridge?.rollup) }}</Text>

									<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
								</Flex>
							</NuxtLink>
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Admin</Text>

						<Flex align="center" gap="8">
							<CopyButton :text="account.bridge?.sudo.hash" />

							<NuxtLink :to="`/account/${account.bridge?.sudo.hash}`" target="_blank">
								<Flex align="center" gap="4">
									<Text size="13" weight="600" color="primary">{{ $getDisplayName('addresses', null, account.bridge?.sudo) }}</Text>

									<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
								</Flex>
							</NuxtLink>
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Withdrawer</Text>

						<Flex align="center" gap="8">
							<CopyButton :text="account.bridge?.withdrawer.hash" />

							<NuxtLink :to="`/account/${account.bridge?.withdrawer.hash}`" target="_blank">
								<Flex align="center" gap="4">
									<Text size="13" weight="600" color="primary">{{ $getDisplayName('addresses', null, account.bridge?.withdrawer) }}</Text>

									<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
								</Flex>
							</NuxtLink>
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Asset</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ getAssetName(account.bridge?.asset) }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Fee Asset</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ getAssetName(account.bridge?.fee_asset) }} </Text>
					</Flex>
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
