<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import ValidatorsTable from "@/components/tables/ValidatorsTable.vue"

/** API */
import { fetchValidators } from "@/services/api/validator"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Validators - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/validators",
		},
	],
	meta: [
		{
			name: "description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:title",
			content: "Validators - Astria Explorer",
		},
		{
			property: "og:description",
			content: "Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks and rollups.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/validators`,
		},
		{
			property: "og:image",
			content: "/img/seo/validators.png",
		},
		{
			name: "twitter:title",
			content: "Validators - Astria Explorer",
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
			content: "https://astrotrek.io/img/seo/validators.png",
		},
	],
})

const validators = ref([])
const isLoading = ref(false)

const limit = ref(15)
const getValidators = async () => {
	isLoading.value = true

	const { data } = await fetchValidators({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	validators.value = data.value
	handleNextCondition.value = validators.value.length < limit.value

	isLoading.value = false
}

/** Pagination */
const page = ref(1)
const handleNextCondition = ref(true)

const handleNext = () => {
	if (validators.value.length < 15) return

	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

getValidators()

watch(
	() => page.value,
	() => {
		getValidators()
	},
)
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/validators', name: 'Validators' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Validators</Text>

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

			<ValidatorsTable :validators="validators" :isLoading="isLoading" :class="$style.validators_table" />
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
}

.validators_table {
	min-height: 900px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
