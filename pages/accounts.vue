<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import AccountsTable from "@/components/tables/AccountsTable.vue"

/** API */
import { fetchAccounts } from "@/services/api/account"

/** Services */
import { getNativeAsset } from "@/services/utils"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

definePageMeta({
	layout: "default",
})

useHead({
	title: "Accounts - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/accounts",
		},
	],
	meta: [
		{
			name: "description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Accounts - Astria Explorer",
		},
		{
			property: "og:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/accounts`,
		},
		{
			property: "og:image",
			content: "/img/seo/accounts.png",
		},
		{
			name: "twitter:title",
			content: "Accounts - Astria Explorer",
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
			content: "https://astrotrek.io/img/seo/accounts.png",
		},
	],
})

const route = useRoute()
const router = useRouter()

const accounts = ref([])
const asset = ref(getNativeAsset())
const isLoading = ref(false)
const lastHead = computed(() => appStore.lastHead)

const limit = ref(15)
const getAccounts = async () => {
	isLoading.value = true

	const { data } = await fetchAccounts({
		asset: asset.value,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	accounts.value = data.value

	isLoading.value = false
}

/** Pagination */
const page = ref(route.query.page ? parseInt(route.query.page) : 1)
const handleNextCondition = computed(() => lastHead.value.total_accounts - limit.value * page.value <= 0)

const handleNext = () => {
	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

getAccounts()

watch(
	() => page.value,
	() => {
		getAccounts()
		router.replace({ query: { page: page.value } })
	},
)
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/accounts', name: 'Accounts' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Accounts</Text>

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

			<AccountsTable :accounts="accounts" :isLoading="isLoading" :class="$style.accounts_table" />
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
	overflow: hidden;

	padding: 16px 0 0 0;
}

.top {
	padding: 0 16px;
}

.accounts_table {
	min-height: 900px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
