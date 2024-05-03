<script setup>
/** Services */
import { hexToBase64, shortHash } from "~/services/utils"

/** Modules */
import RollupMetadata from "~/components/modules/rollup/RollupMetadata.vue"
import RollupActions from "~/components/modules/rollup/RollupActions.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Button from "~/components/ui/Button.vue"

/** API */
import { fetchRollupActions, fetchRollupByHash } from "~/services/api/rollup"

definePageMeta({
	layout: "default",
})

const route = useRoute()

const rollup = ref()
const hashBase64 = ref("")
const actions = ref([])
const isLoading = ref(false)

const { data } = await fetchRollupByHash(route.params.hash)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	rollup.value = data.value
	hashBase64.value = hexToBase64(rollup.value.hash)
}

const limit = ref(15)
const fetchActions = async () => {
	isLoading.value = true

	const { data } = await fetchRollupActions({
		hash: rollup.value.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	actions.value = data.value
	handleNextCondition.value = actions.value.length < limit.value

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

useHead({
	title: `Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value.toUpperCase().slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
		{
			property: "og:title",
			content: `Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Rollup ${hashBase64.value.toUpperCase().slice(0, 4)} ••• ${hashBase64.value
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
	],
})

const tabs = ref([{ name: "Actions" }])
const activeTab = ref(tabs.value[0].name)

await fetchActions()

watch(
	() => page.value,
	() => {
		fetchActions()
	},
)
</script>

<template>
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Breadcrumbs
				v-if="rollup"
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/rollups', name: 'Rollups' },
					{ link: route.fullPath, name: `Rollup` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="8">
					<Icon name="rollup" size="14" color="primary" />

					<Text size="14" weight="500" color="primary">
						Rollup <Text weight="600">{{ hashBase64 }}</Text>
					</Text>
				</Flex>

				<RawDataView :entity="rollup" name="rollup" />
			</Flex>
		</Flex>

		<RollupMetadata :rollup="rollup" />

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

			<RollupActions v-if="activeTab === 'Actions'" :actions="actions" :isLoading="isLoading" />
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
