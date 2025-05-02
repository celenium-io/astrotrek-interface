<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { midHash, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	accounts: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
			<Spinner size="16" />

			<Flex direction="column" align="center" gap="8">
				<Text size="14" weight="500" color="primary">Fetching accounts...</Text>
				<Text size="13" weight="500" color="tertiary">It's almost done</Text>
			</Flex>
		</Flex>

		<Flex
			v-else-if="accounts.length"
			v-for="account in accounts"
			@click="sidebarsStore.open('account', account)"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="10">
					<Flex align="center" gap="6">
						<Icon name="account" size="16" color="secondary" />

						<LinkToEntity :entity="{ title: midHash(account.hash), type: 'account', id: account.hash }" color="primary" />
					</Flex>

					<Tooltip v-if="account?.is_bridge">
						<Icon name="bridge" size="18" color="brand" />

						<template #content> Bridge account </template>
					</Tooltip>

					<Tooltip v-if="account?.is_sudo || account?.is_ibc_sudo">
						<Icon name="role" size="14" color="brand" />

						<template #content>
							{{
								`Has
								${account?.is_sudo ? " Sudo" : ""}
								${account?.is_ibc_sudo ? (account?.is_sudo ? " and IBC Sudo roles" : " IBC Sudo role") : "role"}`
							}}
						</template>
					</Tooltip>

					<Tooltip v-if="account?.is_ibc_relayer">
						<Icon name="relayer" size="18" color="brand" />

						<template #content> IBC Relayer </template>
					</Tooltip>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="secondary">
						<Text color="tertiary">Balance</Text>
						{{ `${spaces(account.balances[0]?.value)} ${getAssetName(account.balances[0]?.currency)}` }}
						<!-- {{ `${spaces(account.balances[0]?.value)}${account.balances.length ? ' ' + account.balances[0]?.currency.toUpperCase() : ''}` }} -->
					</Text>

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">First Height&nbsp;</Text>

					<LinkToEntity
						:entity="{ title: spaces(account.first_height), type: 'block', id: account.first_height }"
						color="secondary"
					/>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="8">
				<Flex align="center" gap="4">
					<Icon name="tx-circle" size="12" color="light-green" />
					<Text size="13" weight="600" color="primary"> {{ account.signed_tx_count }} <Text color="secondary">Txs</Text> </Text>
				</Flex>

				<Text size="12" weight="500" color="tertiary"> Signed Txs </Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;

	margin-top: 20px;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
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

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>
