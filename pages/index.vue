<script setup>
/** Widgets */
import BlockWidget from "~/components/widgets/BlockWidget.vue"
import RollupsWidget from "~/components/widgets/RollupsWidget.vue"
import TxsWidget from "~/components/widgets/TxsWidget.vue"
import StatsWidget from "~/components/widgets/StatsWidget.vue"

/** Tables */
import RecentTransactionsTable from "~/components/tables/RecentTransactionsTable.vue"
import RecentBlocksTable from "~/components/tables/RecentBlocksTable.vue"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Astrotrek - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/",
		},
	],
	meta: [
		{
			name: "description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:title",
			content: "Astrotrek - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/`,
		},
		{
			property: "og:image",
			content: "/img/seo/main.png",
		},
		{
			name: "twitter:title",
			content: "Astrotrek - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/main.png",
		},
	],
})
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<HeroSection :class="$style.hero_section" />

		<Divider :class="$style.divider" />

		<Flex direction="column" gap="24">
			<Flex align="center" gap="24" :class="$style.widgets">
				<BlockWidget />
				<RollupsWidget />
				<TxsWidget />
			</Flex>

			<StatsWidget />
		</Flex>

		<Divider :class="$style.divider" />

		<Flex gap="24" :class="$style.tables">
			<RecentTransactionsTable />
			<RecentBlocksTable />
		</Flex>

		<Flex gap="24"> Recent Transactions Recent Blocks </Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 60px;
	margin-bottom: 120px;
}

.divider {
	margin: 40px 0;
}

@media (max-width: 1000px) {
	.wrapper {
		margin-top: 24px;
	}

	.hero_section {
		display: none;
	}

	.widgets {
		flex-direction: column;
	}

	.tables {
		flex-direction: column;
	}
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
