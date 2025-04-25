<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import AssetsTable from "@/components/tables/AssetsTable.vue"

/** API */
import { fetchAssets } from "@/services/api/main.js"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Assets - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/assets",
		},
	],
	meta: [
		{
			name: "description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets and rollups.",
		},
		{
			property: "og:title",
			content: "Assets - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/assets`,
		},
		{
			property: "og:image",
			content: "/img/seo/assets.png",
		},
		{
			name: "twitter:title",
			content: "Assets - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets and rollups.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/assets.png",
		},
	],
})

const assets = ref([])
const isLoading = ref(false)
const limit = ref(15)
const sort = ref({
	by: "supply",
	dir: "asc",
})
const getAssets = async () => {
	isLoading.value = true

	const data = await fetchAssets({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort_by: sort.value.by,
		sort: sort.value.dir,
	})
	assets.value = data
	handleNextCondition.value = assets.value?.length < limit.value

	isLoading.value = false
}
const handleOnSort = (event) => {
	sort.value = event
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

getAssets()

watch(
	() => page.value,
	() => {
		getAssets()
	},
)

watch(
	() => sort.value,
	() => {
		getAssets()
	},
)
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/assets', name: 'Assets' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Assets</Text>

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

			<AssetsTable @onSort="handleOnSort" :assets="assets" :sort="sort" :isLoading="isLoading" />
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

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
