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
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Transactions - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
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
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
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
const actionTypes = ref("")
const isLoading = ref(false)
const limit = ref(15)

const getTransactions = async () => {
	isLoading.value = true

	const { data } = await fetchTransactions({
		action_types: actionTypes.value,
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
const isFilterActive = computed(() => actionTypes.value.length > 0)
async function initFilters() {
	actionTypes.value = ""
	
	let res = [
		{
			name: "Action Types",
			values: {},
			displayName: capitalizeAndReplaceUnderscore,
			type: "multiselect"
		}
	]

	let types = enumStore.enums?.actionTypes || []
	types.sort().forEach(type => {
		res[0].values[type] = false
	})

	if (arraysAreEqual(filters.value, res)) {
		filters.value = res
	} else {
		filters.value = res
		isUpdatingPaage.value = true
		page.value = 1
		await getTransactions()
		isUpdatingPaage.value = false
	}
}

const handleFilterUpdate = (event) => {
	if (!event.length) {
		initFilters()
		return
	}

	if (arraysAreEqual(filters.value, event)) return

	filters.value = event	

	let resActionTypes = []
	let filteredActionTypes = filters.value.find(f => f.name === "Action Types")?.values
	
	Object.keys(filteredActionTypes).forEach(actType => {
		if (filteredActionTypes[actType]) {
			resActionTypes.push(actType)
		}
	})

	actionTypes.value = resActionTypes.join(",")
	isUpdatingPaage.value = true
	page.value = 1
	getTransactions()
	isUpdatingPaage.value = false
}

getTransactions()

watch(
	() => page.value,
	() => {
		if (!isUpdatingPaage.value) {
			getTransactions()
		}

		router.replace({ query: { page: page.value } })
	},
)

onMounted( async () => {
	await initFilters()
})
</script>

<template>
	<Flex direction="column" gap="40" wide :class="$style.wrapper">
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
					<Filter @onUpdate="handleFilterUpdate" :filters="filters" :isActive="isFilterActive" />

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

			<TransactionsTable :txs="transactions" :isLoading="isLoading" generalTxsList />
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
	background: var(--op-3);

	padding: 16px 0 0 0;
}

.top {
	padding: 0 16px;

	margin-bottom: 20px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
