<script setup>
/** Widgets */
import BlockWidget from "~/components/widgets/BlockWidget.vue"
import RollupsWidget from "~/components/widgets/RollupsWidget.vue"
import TxsWidget from "~/components/widgets/TxsWidget.vue"
import StatsWidget from "~/components/widgets/StatsWidget.vue"

/** Tables */
import RecentTransactionsTable from "~/components/tables/RecentTransactionsTable.vue"
import RecentBlocksTable from "~/components/tables/RecentBlocksTable.vue"

/** API */
import { fetchLatestBlocks } from "@/services/api/block"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

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

const hideHeroSection = ref(false)

onBeforeMount(async () => {
	hideHeroSection.value = localStorage.hideHeroSection

	const data = await fetchLatestBlocks()
	appStore.latestBlocks = data
	appStore.isLatestBlocksLoaded = true
})

const handleHide = () => {
	localStorage.hideHeroSection = true
	hideHeroSection.value = true
}
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<ClientOnly>
			<template v-if="!hideHeroSection">
				<HeroSection @onHide="handleHide" :class="$style.hero_section" />

				<Divider :class="$style.divider" />
			</template>
		</ClientOnly>

		<Flex align="center" :class="$style.widgets">
			<Flex align="center" :class="$style.first_widgets">
				<BlockWidget :class="$style.block_widget" />
				<RollupsWidget :class="$style.rollup_widget" />
			</Flex>

			<TxsWidget :class="$style.tx_widget" />
		</Flex>

		<Divider :class="$style.divider" />

		<Flex gap="24" :class="$style.tables">
			<RecentTransactionsTable />
			<RecentBlocksTable />
		</Flex>
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

.widgets {
	max-width: 100%;
	width: 100%;
	gap: 20px;
}

.first_widgets {
	flex: 1;

	gap: 20px;
}

.block_widget {
	max-width: 380px;
	width: 380px;
}

.rollup_widget {
	min-width: 240px;
	width: 240px;
}

.tx_widget {
	max-width: 380px;
	width: 380px;
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
		gap: 20px;
	}

	.first_widgets {
		width: 100%;

		gap: 20px;
	}

	.block_widget {
		max-width: initial;
		width: 100%;
	}

	.rollup_widget {
		max-width: 240px;
		width: 240px;
	}

	.tx_widget {
		max-width: 100%;
		width: 100%;
	}

	.tables {
		flex-direction: column;
	}
}

@media (max-width: 750px) {
	.first_widgets {
		flex-direction: column;
		gap: 24px;
	}

	.block_widget {
		max-width: 100%;
		width: 100%;
	}

	.rollup_widget {
		max-width: 100%;
		width: 100%;
	}
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
