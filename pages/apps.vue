<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

/** Components */
import AppsTable from "@/components/tables/AppsTable.vue"

/** API */
import { fetchApps } from "@/services/api/app"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

definePageMeta({
	layout: "default",
})

useHead({
	title: "Applications - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/apps",
		},
	],
	meta: [
		{
			name: "description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets, rollups and applications.",
		},
		{
			property: "og:title",
			content: "Applications - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets, rollups and applications.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/apps`,
		},
		{
			property: "og:image",
			content: "/img/seo/apps.png",
		},
		{
			name: "twitter:title",
			content: "Applications - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, assets, rollups and applications.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/apps.png",
		},
	],
})

const apps = ref([])
const isLoading = ref(true)

const limit = ref(15)
const getApps = async () => {
	isLoading.value = true

	const { data } = await fetchApps({
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	apps.value = data.value

	handleNextCondition.value = apps.value.length < limit.value

	isLoading.value = false
}

/** Pagination */
const page = ref(1)
const handleNextCondition = ref(false)

const handleNext = () => {
	page.value += 1
}
const handlePrev = () => {
	if (page.value === 1) return
	page.value -= 1
}

getApps()

watch(
	() => page.value,
	() => {
		getApps()
	},
)
</script>

<template>
	<Flex direction="column" gap="16" wide :class="$style.wrapper">
		<Breadcrumbs
			:items="[
				{ link: '/', name: 'Explore' },
				{ link: '/apps', name: 'Applications' },
			]"
		/>

		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Text size="16" weight="600" color="primary">Applications</Text>

				<Flex align="center" gap="16">
					<Button link="https://forms.gle/dfR6QJJah9kfPe3N6" target="_blank" size="mini" type="primary">
						<Icon name="plus-circle" size="14" color="primary" />
						<div :class="$style.register_btn_text">Register Your Application</div>
					</Button>

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
			</Flex>

			<AppsTable :apps="apps" :isLoading="isLoading" :class="$style.apps_table" />
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
	overflow: hidden;

	padding: 16px 0 0 0;
}

.top {
	margin-bottom: 20px;
	padding: 0 16px;
}

.apps_table {
	min-height: 900px;
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}

	.register_btn_text {
		display: none;
	}
}
</style>
