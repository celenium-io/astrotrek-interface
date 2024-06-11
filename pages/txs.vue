<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import TransactionsTable from "@/components/tables/TransactionsTable.vue"

/** API */
import { fetchTransactions } from "@/services/api/tx"

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
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:title",
			content: "Transactions - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
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
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
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

const transactions = ref([])
const isLoading = ref(false)
const limit = ref(15)

const getTransactions = async () => {
	isLoading.value = true

	const { data } = await fetchTransactions({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	transactions.value = data.value
	handleNextCondition.value = transactions.value.length < limit.value

	isLoading.value = false
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

getTransactions()

watch(
	() => page.value,
	() => {
		getTransactions()
	},
)
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
