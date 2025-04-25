<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import RollupsTable from "@/components/tables/RollupsTable.vue"

/** API */
import { fetchRollups } from "@/services/api/rollup"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

definePageMeta({
	layout: "default",
})

useHead({
	title: "Rollups - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/rollups",
		},
	],
	meta: [
		{
			name: "description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Rollups - Astria Explorer",
		},
		{
			property: "og:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/rollups`,
		},
		{
			property: "og:image",
			content: "/img/seo/rollups.png",
		},
		{
			name: "twitter:title",
			content: "Rollups - Astria Explorer",
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
			content: "https://astrotrek.io/img/seo/rollups.png",
		},
	],
})

const rollups = ref([])
const isLoading = ref(false)
const lastHead = computed(() => appStore.lastHead)

const limit = ref(15)
const getRollups = async () => {
	isLoading.value = true

	const { data } = await fetchRollups({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	rollups.value = data.value

	isLoading.value = false
}

/** Pagination */
const page = ref(1)
const handleNextCondition = computed(() => lastHead.value.total_rollups - limit.value * page.value <= 0)

const handleNext = () => {
	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

getRollups()

watch(
	() => page.value,
	() => {
		getRollups()
	},
)
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/rollups', name: 'Rollups' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Rollups</Text>

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

			<RollupsTable :rollups="rollups" :isLoading="isLoading" generalRollupsList :class="$style.rollups_table" />
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
	margin-bottom: 20px;
	padding: 0 16px;
}

.rollups_table {
	min-height: 900px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
