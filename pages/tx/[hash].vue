<script setup>
/** Services */
import { capitalize, shortHash } from "~/services/utils"

/** Modules */
import TxMetadata from "~/components/modules/tx/TxMetadata.vue"
import TxActions from "~/components/modules/tx/TxActions.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Tooltip from "~/components/ui/Tooltip.vue"
import Button from "~/components/ui/Button.vue"

/** API */
import { fetchTxActions, fetchTxByHash } from "~/services/api/tx"

definePageMeta({
	layout: "default",
})

const route = useRoute()

const tx = ref()
const actions = ref([])
const isLoading = ref(false)

const { data } = await fetchTxByHash(route.params.hash)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	tx.value = data.value
}

const limit = ref(15)
const fetchActions = async () => {
	isLoading.value = true

	const { data } = await fetchTxActions({
		hash: tx.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	actions.value = data.value
	handleNextCondition.value = actions.value.length < limit.value

	isLoading.value = false
}

useHead({
	title: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash.toUpperCase().slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
		{
			property: "og:title",
			content: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
	],
})

const tabs = ref([{ name: "Actions" }])
const activeTab = ref(tabs.value[0].name)

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

watch(
	() => page.value,
	async () => {
		await fetchActions()
	},
)

await fetchActions()
</script>

<template>
	<Flex direction="column" gap="16" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Breadcrumbs
				v-if="tx"
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/txs', name: 'Transactions' },
					{ link: route.fullPath, name: `Transaction` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="8">
					<Tooltip>
						<Icon name="tx" size="14" :color="tx.status === 'success' ? 'green' : 'red'" />

						<template #content>
							<Text :color="tx.status === 'success' ? 'green' : 'red'">{{ capitalize(tx.status) }}</Text>
						</template>
					</Tooltip>

					<Text size="14" weight="500" color="primary">
						Transaction <Text weight="600">{{ shortHash(tx.hash) }}</Text>
					</Text>
				</Flex>

				<RawDataView :entity="tx" name="transaction" />
			</Flex>
		</Flex>

		<TxMetadata :tx="tx" />

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
						{{ tab.name }}
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

			<TxActions v-if="activeTab === 'Actions'" :actions="actions" :isLoading="isLoading" />
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
