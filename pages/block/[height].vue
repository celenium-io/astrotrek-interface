<script setup>
/** Services */
import { capitalize, spaces } from "~/services/utils"

/** UI */
import Button from "~/components/ui/Button.vue"

/** Modules */
import BlockMetadata from "@/components/modules/block/BlockMetadata.vue"
import BlockTransactions from "@/components/modules/block/BlockTransactions.vue"
import BlockActions from "@/components/modules/block/BlockActions.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** API */
import { fetchBlockByHeight, fetchBlockTxs, fetchBlockActions } from "~/services/api/block"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

definePageMeta({
	layout: "default",
})

const route = useRoute()
const router = useRouter()

const block = ref()
const lastBlock = computed(() => appStore.latestBlocks[0])
const txs = ref([])
const actions = ref([])
const isLoading = ref(false)

const { data } = await fetchBlockByHeight(route.params.height)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	block.value = data.value
}

const fetchTxs = async () => {
	if (!block.value.stats.tx_count) return

	isLoading.value = true

	const { data } = await fetchBlockTxs({
		height: block.value.height,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	txs.value = data.value
	handleNextCondition.value = txs.value.length < limit.value

	isLoading.value = false
}

const fetchActions = async () => {
	if (!block.value.stats.tx_count) return

	isLoading.value = true

	const { data } = await fetchBlockActions({
		height: block.value.height,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	actions.value = data.value
	handleNextCondition.value = actions.value.length < limit.value

	isLoading.value = false
}

const fetchData = async () => {
	switch (activeTab.value) {
		case "transactions":
			await fetchTxs()
			break
		case "actions":
			await fetchActions()
			break
	}
}

useHead({
	title: `Block ${spaces(block.value?.height)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Block Height ${block.value?.height}. The timestamp, hash, proposer, metadata, gas used and transactions in the block.`,
		},
		{
			property: "og:title",
			content: `Block ${spaces(block.value?.height)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Block Height ${block.value?.height}. The timestamp, hash, proposer, metadata, gas used and transactions in the block.`,
		},
		{
			property: "og:url",
			content: `https://celenium.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Block ${spaces(block.value?.height)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Block Height ${block.value?.height}. The timestamp, hash, proposer, metadata, gas used and transactions in the block.`,
		},
	],
})

const tabs = ref([
	{
		name: "transactions"
	},
	{
		name: "actions"
	}
])
const activeTab = ref(route.query.tab && tabs.value.map((tab) => tab.name).includes(route.query.tab) ? route.query.tab : tabs.value[0].name)

const updateRouteQuery = () => {
	router.replace({
		query: {
			tab: activeTab.value,
		},
	})
}

const limit = ref(15)

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
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Breadcrumbs
				v-if="block"
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/blocks', name: 'Blocks' },
					{ link: route.fullPath, name: `Block` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="16">
					<Flex align="center" gap="8">
						<Icon name="block" size="14" color="primary" />

						<Text size="14" weight="500" color="primary">
							Block <Text weight="600">{{ spaces(block.height) }}</Text>
						</Text>

						<CopyButton :text="block.height" />
					</Flex>

					<Flex align="center" gap="8">
						<Button @click="router.push(`/block/${block.height - 1}`)" type="tertiary" size="mini" :disabled="block.height === 1">
							<Icon name="arrow-redo-right" size="16" color="secondary" :style="{ transform: 'scaleX(-1)' }" />
							Prev
						</Button>

						<Button
							@click="router.push(`/block/${block.height + 1}`)"
							type="tertiary"
							size="mini"
							:disabled="block.height === lastBlock?.height"
						>
							Next
							<Icon name="arrow-redo-right" size="16" color="secondary" />
						</Button>
					</Flex>
				</Flex>

				<RawDataView :entity="block" name="block" />
			</Flex>
		</Flex>

		<BlockMetadata :block="block" />

		<Flex direction="column" gap="12">
			<Flex align="center" justify="between">
				<Flex align="center" gap="8">
					<Text
						v-for="tab in tabs"
						@click="activeTab = tab.name"
						size="13"
						weight="600"
						color="secondary"
						:class="[$style.tab, activeTab === tab.name && $style.active]"
					>
						{{ capitalize(tab.name) }}
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

			<BlockTransactions v-if="activeTab === 'transactions'" :txs="txs" :isLoading="isLoading" />
			<BlockActions v-if="activeTab === 'actions'" :actions="actions" :isLoading="isLoading" />
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
</style>
