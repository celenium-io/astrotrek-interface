<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import BlocksTable from "@/components/tables/BlocksTable.vue"

/** API */
import { fetchBlocks } from "@/services/api/block"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Blocks - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/blocks",
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
			content: "Blocks - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/blocks`,
		},
		{
			property: "og:image",
			content: "/img/seo/blocks.png",
		},
		{
			name: "twitter:title",
			content: "Blocks - Astria Explorer",
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
			content: "https://astrotrek.io/img/seo/blocks.png",
		},
	],
})

const route = useRoute()
const router = useRouter()

const blocks = ref([])
const isLoading = ref(false)
const limit = ref(15)
const getBlocks = async () => {
	isLoading.value = true

	const { data } = await fetchBlocks({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	blocks.value = data.value
	handleNextCondition.value = blocks.value.length < limit.value

	isLoading.value = false
}

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

getBlocks()

watch(
	() => page.value,
	() => {
		getBlocks()
		router.replace({ query: { page: page.value } })
	},
)
</script>

<template>
	<Flex direction="column" gap="40" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/blocks', name: 'Blocks' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Blocks</Text>

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

			<BlocksTable :blocks="blocks" :isLoading="isLoading" :minHeight="900" generalBlocksList />
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
