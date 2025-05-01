<script setup>
/** Servies */
import { fetchQuotes } from "@/services/api/quotes"

/** Components */
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"
import QuoteCard from "@/components/ui/Charts/QuoteCard.vue"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Quotes - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/quotes",
		},
	],
	meta: [
		{
			name: "description",
			content:
				"Astrotrek allows you to explore oracle data provided for currency pair quotes published on-chain.",
		},
		{
			property: "og:title",
			content: "Quotes - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore oracle data provided for currency pair quotes published on-chain.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/quotes`,
		},
		{
			property: "og:image",
			content: "/img/seo/qoutes.png",
		},
		{
			name: "twitter:title",
			content: "Quotes - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore oracle data provided for currency pair quotes published on-chain.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/qoutes.png",
		},
	],
})

const quotes = ref([])
const isLoading = ref(true)

const getQuotes = async () => {
	isLoading.value = true
	try {
		const data = await fetchQuotes()
		if (data.length) {
			quotes.value = data
		}
	} finally {
		isLoading.value = false
	}
}
const view = ref("cards") // "table"

onMounted(async () => {
	await getQuotes()
})
</script>

<template>
	<Flex direction="column" gap="40" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/quotes', name: 'Qoutes' },
			]"
		/>

		<LoadingHolder v-if="isLoading" title="Loading quotes.." />

		<Flex v-if="quotes.length" align="center" justify="between">
			<QuoteCard v-for="q in quotes"
				:quote="q"
			/>
		</Flex>

		<EmptyHolder v-else-if="!isLoading" title="Oracle data for currency pair quotes is not available on the current network" />
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 24px;
	margin-bottom: 120px;
}

.selected_chart {
	min-width: 100%;

	position: relative;
	border-radius: 8px 8px 8px 8px;
	background: rgba(255, 255, 255, 1%);
}

.small_charts_wrapper {
	width: 100%;

	overflow-x: auto;
}

::-webkit-scrollbar {
    height: 2px;
}

.small_chart {
	min-width: 250px;

	background: rgba(255, 255, 255, 1%);
	border-radius: 8px 8px 8px 8px;

	cursor: pointer;

	&:hover {
		background: rgba(255, 255, 255, 2%);
	}

	&:active {
		transform: scale(101%);
		transition: all 0.3s ease;
	}
}

.small_chart_selected {
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: rgba(255, 255, 255, 2%);
}

.period {
	cursor: pointer;

	padding-bottom: 2px;
}
.active_period {
	color: var(--txt-primary);
	fill: var(--txt-primary);

	border-bottom: 1px solid var(--txt-primary);
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
