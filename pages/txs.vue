<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import TransactionsTable from "@/components/tables/TransactionsTable.vue"

/** Services */
import { arraysAreEqual, capitalizeAndReplaceUnderscore } from "@/services/utils"

/** API */
import { fetchTransactions } from "@/services/api/tx"

/** Store */
import { useEnumStore } from "@/store/enums"
const enumStore = useEnumStore()

definePageMeta({
	layout: "default",
})

useHead({
	title: "Transactions - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/txs",
		},
	],
	meta: [
		{
			name: "description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Transactions - Astria Explorer",
		},
		{
			property: "og:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/txs`,
		},
		{
			property: "og:image",
			content: "/img/seo/txs.png",
		},
		{
			name: "twitter:title",
			content: "Transactions - Astria Explorer",
		},
		{
			name: "twitter:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/txs.png",
		},
	],
})

const route = useRoute()
const router = useRouter()

const transactions = ref([])
const actionTypes = computed(() => enumStore.enums?.actionTypes)
const actionTypesFilterred = computed(() => {
	const filteredActionTypes = filters.value?.find((f) => f.name === "Action Types")?.values || {}

	const actions = Object.keys(filteredActionTypes)
		.filter((actType) => filteredActionTypes[actType])
		.join(",")

	return actions
})
const isLoading = ref(false)
const limit = ref(15)

const getTransactions = async () => {
	isLoading.value = true

	const { data } = await fetchTransactions({
		action_types: actionTypesFilterred.value,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	transactions.value = data.value
	handleNextCondition.value = transactions.value?.length < limit.value

	isLoading.value = false
}

const isUpdatingPaage = ref(false)
/** Pagination */
const page = ref(route.query.page ? parseInt(route.query.page) : 1)
const handleNextCondition = ref(true)

const handleNext = () => {
	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

/** Filters */
const filters = ref([])
async function initFilters() {
	let res = [
		{
			name: "Action Types",
			values: {},
			displayName: capitalizeAndReplaceUnderscore,
			type: "multiselect",
		},
	]

	const priorityOrder = ["rollup_data_submission", "bridge_lock", "ibc_relay", "ics20_withdrawal"]
	const sortedTypes = actionTypes.value.sort((a, b) => {
		const aIndex = priorityOrder.indexOf(a)
		const bIndex = priorityOrder.indexOf(b)

		if (aIndex !== -1 && bIndex !== -1) {
			return aIndex - bIndex
		} else if (aIndex !== -1) {
			return -1
		} else if (bIndex !== -1) {
			return 1
		}

		return a.localeCompare(b)
	})
	sortedTypes.forEach((type) => {
		res[0].values[type] = false
	})

	filters.value = res
}
const clearFilters = async () => {
	isUpdatingPaage.value = true

	page.value = 1

	let filteredActionTypes = filters.value.find((f) => f.name === "Action Types")?.values
	Object.keys(filteredActionTypes).forEach((actType) => {
		filteredActionTypes[actType] = false
	})

	await getTransactions()

	isUpdatingPaage.value = false
}
const handleFilterUpdate = (event) => {
	if (!event.length) {
		clearFilters()
		return
	}

	if (arraysAreEqual(filters.value, event)) return

	filters.value = event

	isUpdatingPaage.value = true
	page.value = 1
	getTransactions()
	isUpdatingPaage.value = false
}

getTransactions()

watch(
	() => actionTypes.value,
	() => {
		initFilters()
	},
)
watch(
	() => page.value,
	() => {
		if (!isUpdatingPaage.value) {
			getTransactions()
		}

		router.replace({ query: { page: page.value } })
	},
)

onMounted(async () => {
	await initFilters()
	router.replace({ query: { page: page.value } })
})
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/txs', name: 'Transactions' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Transactions</Text>

				<Flex align="center" gap="12">
					<Filter @onUpdate="handleFilterUpdate" :filters="filters" :isActive="!!actionTypesFilterred" />

					<Flex align="center" gap="6">
						<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1 || isLoading">
							<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
						</Button>
						<Button size="mini" type="secondary">Page {{ page }}</Button>
						<Button @click="handleNext" size="mini" type="secondary" :disabled="isLoading || handleNextCondition">
							<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
						</Button>
					</Flex>
				</Flex>
			</Flex>

			<TransactionsTable v-if="transactions?.length || isLoading" :txs="transactions" :isLoading="isLoading" generalTxsList />
			<Flex v-else-if="!!actionTypesFilterred" align="center" justify="center" direction="column" gap="20" wide :class="$style.empty">
				<Icon name="search" size="24" color="support" />

				<Flex direction="column" gap="8">
					<Text size="13" weight="600" color="secondary" align="center"> Nothing was found </Text>
					<Text size="12" weight="500" height="160" color="tertiary" align="center" style="max-width: 220px">
						Clear filters to see all transactions
					</Text>
				</Flex>

				<Button @click="clearFilters" type="secondary" size="small">Clear all filters</Button>
			</Flex>
			<Flex v-else direction="column" align="center" justify="center" gap="8" :class="$style.empty">
				<Text size="13" weight="600" color="secondary" align="center"> No transactions </Text>
				<Text size="12" weight="500" height="160" color="tertiary" align="center" style="max-width: 220px">
					This network does not contain any transactions
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 24px;
	margin-bottom: 120px;
}

.card {
	border-radius: 8px;
	background: var(--card-background);

	padding: 16px 0 0 0;
}

.top {
	padding: 0 16px;

	margin-bottom: 20px;
}

.empty {
	flex: 1;
	padding: 16px 0;
	border-top: 1px solid var(--op-5);
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
