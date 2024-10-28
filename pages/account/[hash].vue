<script setup>
/** Modules */
import AccountActions from "~/components/modules/account/AccountActions.vue"
import AccountBridgeInfo from "~/components/modules/account/AccountBridgeInfo.vue"
import AccountBridgeRoles from "~/components/modules/account/AccountBridgeRoles.vue"
import AccountDeposits from "~/components/modules/account/AccountDeposits.vue"
import AccountMetadata from "~/components/modules/account/AccountMetadata.vue"
import AccountRollups from "~/components/modules/account/AccountRollups.vue"
import AccountTransactions from "~/components/modules/account/AccountTransactions.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Button from "~/components/ui/Button.vue"
import Tooltip from "~/components/ui/Tooltip.vue"

/** Services */
import { capitalizeAndReplaceUnderscore, shortHash } from "@/services/utils"

/** API */
import { fetchAccountActions, fetchAccountBridgeRoles, fetchAccountByHash, fetchAccountDeposits, fetchAccountRollups, fetchAccountTransactions } from "~/services/api/account.js"

definePageMeta({
	layout: "default",
})

const route = useRoute()
const router = useRouter()

const account = ref()
const actions = ref([])
const bridgeRoles = ref([])
const deposits = ref([])
const rollups = ref([])
const txs = ref([])

const isLoading = ref(false)

const { data } = await fetchAccountByHash(route.params.hash)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	account.value = data.value
}

const limit = ref(15)
const fetchTxs = async () => {
	isLoading.value = true

	const { data } = await fetchAccountTransactions({
		hash: account.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	txs.value = data.value
	handleNextCondition.value = txs.value.length < limit.value

	isLoading.value = false
}

const fetchActions = async () => {
	isLoading.value = true

	const { data } = await fetchAccountActions({
		hash: account.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	actions.value = data.value
	handleNextCondition.value = actions.value.length < limit.value

	isLoading.value = false
}

const fetchRollups = async () => {
	isLoading.value = true

	const { data } = await fetchAccountRollups({
		hash: account.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	rollups.value = data.value
	handleNextCondition.value = rollups.value.length < limit.value

	isLoading.value = false
}

const fetchBridgeRoles = async () => {
	isLoading.value = true

	bridgeRoles.value = []
	const { data } = await fetchAccountBridgeRoles({
		hash: account.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})

	data.value.forEach(r => {
		if (r.sudo === account.value.hash) {
			bridgeRoles.value.push({
				bridge: r.address,
				account: r.sudo,
				role: 'admin',
				rollup: r.rollup,
			})
		}

		if (r.withdrawer === account.value.hash) {
			bridgeRoles.value.push({
				bridge: r.address,
				account: r.withdrawer,
				role: 'withdrawer',
				rollup: r.rollup,
			})
		}
	})

	handleNextCondition.value = bridgeRoles.value.length < limit.value

	isLoading.value = false
}

const fetchDeposits = async () => {
	isLoading.value = true

	const { data } = await fetchAccountDeposits({
		hash: account.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	deposits.value = data.value
	handleNextCondition.value = deposits.value.length < limit.value

	isLoading.value = false
}

const fetchData = async () => {
	switch (activeTab.value) {
		case "transactions":
			fetchTxs()
			break
		case "actions":
			fetchActions()
			break
		case "rollups":
			fetchRollups()
			break
		case "bridge_roles":
			fetchBridgeRoles()
			break
		case "deposits":
			fetchDeposits()
			break
	}
}

/** Pagination */
const page = ref(1)
const handleNextCondition = ref(true)

const handleNext = () => {
	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

useHead({
	title: `Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash.toUpperCase().slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, rollups, transactions, deposits.`,
		},
		{
			property: "og:title",
			content: `Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, rollups, transactions, deposits.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Account ${account.value?.hash.toUpperCase().slice(0, 4)} ••• ${account.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, rollups, transactions, deposits.`,
		},
	],
})

const tabs = ref(
	[
		{ name: "transactions", visible: true },
		{ name: "actions", visible: true },
		{ name: "rollups", visible: true },
		{ name: "bridge_roles", visible: true },
		{ name: "deposits", visible: account.value?.is_bridge },
	]
)
const activeTab = ref(route.query.tab && tabs.value.map((tab) => tab.name).includes(route.query.tab) ? route.query.tab : tabs.value[0].name)

const updateRouteQuery = () => {
	router.replace({
		query: {
			tab: activeTab.value,
		},
	})
}

await fetchData()
updateRouteQuery()

const isUpdatingPaage = ref(false)
watch(
	() => activeTab.value,
	async () => {
		isUpdatingPaage.value = true

		page.value = 1
		updateRouteQuery()
		await fetchData()

		isUpdatingPaage.value = false
	},
)

watch(
	() => page.value,
	async () => {
		if (isUpdatingPaage.value) return
		
		await fetchData()
	},
)
</script>

<template>
	<Flex v-if="account" direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Breadcrumbs
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/accounts', name: 'Accounts' },
					{ link: route.fullPath, name: `Account` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="12">
					<Icon name="account" size="14" color="primary" />

					<Text size="14" weight="500" color="primary">
						Account <Text weight="600">{{ shortHash(account?.hash) }}</Text>
					</Text>

					<Tooltip v-if="account?.is_bridge">
						<Icon name="bridge" size="18" color="brand" />

						<template #content>
							Bridge account
						</template>
					</Tooltip>
				</Flex>

				<RawDataView :entity="account" name="account" />
			</Flex>
		</Flex>

		<AccountMetadata :account="account" />

		<AccountBridgeInfo v-if="account?.is_bridge" :account="account" />

		<Flex direction="column" gap="12">
			<Flex align="center" justify="between" :class="$style.navigation">
				<Flex align="center" gap="8" :class="$style.tabs">
					<Text
						v-for="tab in tabs.filter(t => t.visible)"
						@click="activeTab = tab.name"
						size="13"
						weight="600"
						color="secondary"
						:class="[$style.tab, activeTab === tab.name && $style.active]"
					>
						{{ capitalizeAndReplaceUnderscore(tab.name) }}
					</Text>
				</Flex>

				<Flex align="center" gap="6" :class="$style.pagination">
					<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1 || isLoading">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
					</Button>
					<Button size="mini" type="secondary">Page {{ page }}</Button>
					<Button @click="handleNext" size="mini" type="secondary" :disabled="isLoading || handleNextCondition">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
					</Button>
				</Flex>
			</Flex>

			<AccountTransactions v-if="activeTab === 'transactions'" :txs="txs" :isLoading="isLoading" />

			<AccountActions v-if="activeTab === 'actions'" :actions="actions" :isLoading="isLoading" />

			<AccountRollups v-if="activeTab === 'rollups'" :rollups="rollups" :isLoading="isLoading" />

			<AccountBridgeRoles v-if="activeTab === 'bridge_roles'" :roles="bridgeRoles" :isLoading="isLoading" />

			<AccountDeposits v-if="activeTab === 'deposits'" :deposits="deposits" :isLoading="isLoading" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);
	width: 100%;

	padding: 0 24px;
	margin-top: 24px;
	margin-bottom: 120px;
}

.tab {
	border-radius: 6px;
	cursor: pointer;
	background: var(--op-5);
	border: 1px solid transparent;

	padding: 6px 8px;

	transition: all 0.2s ease;

	&:hover {
		color: var(--brand);
	}

	&.active {
		color: var(--brand);
		border: 1px solid var(--brand);
	}
}

.pagination {
	padding-bottom: 6px;
}

@media (max-width: 650px) {
	.navigation {
		flex-direction: column;
		gap: 12px;
	}

	.tabs {
		width: 100%;
		justify-content: start;
	}

	.pagination {
		width: 100%;
		justify-content: end;
	}
}
</style>
