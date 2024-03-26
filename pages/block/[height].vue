<script setup>
/** Services */
import { spaces } from "~/services/utils"

/** Modules */
import BlockMetadata from "@/components/modules/block/BlockMetadata.vue"
import BlockTransactions from "@/components/modules/block/BlockTransactions.vue"
import BlockActions from "@/components/modules/block/BlockActions.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** API */
import { fetchBlockByHeight, fetchBlockTxs, fetchBlockActions } from "~/services/api/block"

definePageMeta({
	layout: "default",
})

const route = useRoute()

const block = ref()
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

	const { data } = await fetchBlockTxs({ height: block.value.height })
	txs.value = data.value

	isLoading.value = false
}

const fetchActions = async () => {
	if (!block.value.stats.tx_count) return

	isLoading.value = true

	const { data } = await fetchBlockActions({ height: block.value.height })
	actions.value = data.value

	isLoading.value = false
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

const tabs = ref([{ name: "Transactions" }, { name: "Actions" }])
const activeTab = ref(tabs.value[0].name)

watch(
	() => activeTab.value,
	async () => {
		if (activeTab.value === "Transactions") {
			if (txs.value.length > 0) return

			fetchTxs()
		}
		if (activeTab.value === "Actions") {
			if (actions.value.length > 0) return

			fetchActions()
		}
	},
)

await fetchTxs()
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
				<Flex align="center" gap="8">
					<Icon name="block" size="14" color="primary" />
					<Text size="14" weight="500" color="primary">
						Block <Text weight="600">{{ spaces(block.height) }}</Text>
					</Text>
				</Flex>

				<RawDataView :entity="block" name="block" />
			</Flex>
		</Flex>

		<BlockMetadata :block="block" />
		
		<Flex direction="column" gap="2">
			<Flex align="center" gap="8">
				<Text
					v-for="tab in tabs"
					@click="activeTab = tab.name"
					size="13"
					weight="600"
					color="secondary"
					:class="[$style.tab, activeTab === tab.name && $style.active]"
				>
					{{ tab.name }}
				</Text>
			</Flex>

			<BlockTransactions v-if="activeTab === 'Transactions'" :txs="txs" :isLoading="isLoading" />
			<BlockActions v-if="activeTab === 'Actions'" :actions="actions" :isLoading="isLoading" />
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
	height: 32px;
	border-radius: 6px;
	cursor: pointer;

	padding: 6px 8px;

	transition: all 0.2s ease;

	&:hover {
		color: var(--brand);
	}

	&.active {
		color: var(--brand);
		/* opacity: 0.6; */
	}
}
</style>
