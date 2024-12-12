<script setup>
/** Modules */
import AccountTransactions from "~/components/modules/account/AccountTransactions.vue"
import AppMetadata from "~/components/modules/app/AppMetadata.vue"
import RollupActions from "~/components/modules/rollup/RollupActions.vue"
import RollupCharts from "~/components/modules/rollup/RollupCharts.vue"


/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Button from "~/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import Tooltip from "~/components/ui/Tooltip.vue"

/** Services */
import { capitalize, capitalizeAndReplaceUnderscore } from "~/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** API */
import { fetchAccountTransactions } from "~/services/api/account.js"
import { fetchAppBySlug } from "~/services/api/app.js"
import { fetchRollupActions, fetchRollupByHash } from "~/services/api/rollup"

definePageMeta({
	layout: "default",
})

const route = useRoute()
const router = useRouter()

const app = ref()
const bridgeTxs = ref([])
const rollup = ref()
const rollupActions = ref([])

const appContactLinks = ref([
	{
		name: "website",
		icon: "globe",
		tooltip: "",
	},
	{
		name: "explorer",
		icon: "search",
		tooltip: "",
	},
	{
		name: "l2_beat",
		icon: "l2beat",
		tooltip: "",
	},
	{
		name: "github",
		icon: "github",
		tooltip: "",
	},
	{
		name: "twitter",
		icon: "twitter",
		tooltip: "",
	},
])

const isLoading = ref(false)

const fetchApp = async () => {
	const { data } = await fetchAppBySlug(route.params.slug)	
	if (!data.value) {
		app.value = {
			"actions_count": 2,
			"avg_size": 1000,
			"category": "nft",
			"description": "Loooooooooooooooo oooooooooooooooooooo ooooooooooooo ooooooooooooooo ooooooooooooooo ooooooooooooooooo oooooo oo oo oooooooo ooooooo ooooooo ooooong rollup description",
			"explorer": "https://phoenix.lightlink.io",
			"first_message_time": "2023-07-04T03:10:57+00:00",
			"github": "https://github.com/lightlink-network/hummingbird-client",
			"id": 321,
			"l2_beat": "https://l2beat.com/bridges/projects/lightlink",
			"last_message_time": "2023-07-04T03:10:57+00:00",
			"links": [
				"https://docs.lightlink.io/lightlink-protocol",
				"https://bridge.lightlink.io/",
				"https://t.me/lightlinkLL"
			],
			"logo": "https://celenium.fra1.cdn.digitaloceanspaces.com/rollups/LightLink.webp",
			"max_size": 1000,
			"min_size": 1000,
			"name": "Application name",
			"native_bridge": "astria12saluecm8dd7hkutk83eavkl2p70lf5w7txezg",
			"provider": "provider",
			"rollup": "xuzPaQ1qQbu1wl5oBdEiP+Xl977xEmJOVjVpqNrktnU=",
			"size": 100000,
			"slug": "app_1",
			"stack": "OP Stack",
			"twitter": "https://x.com/LightLinkChain",
			"type": "settled",
			"vm": "evm",
			"website": "https://lightlink.io"	
		}

		let arr = [...appContactLinks.value]
		arr.forEach((link, index) => {
			if (app.value[link.name]) {
				appContactLinks.value[index].tooltip = app.value[link.name]
			} else {
				appContactLinks.value.splice(index, 1)
			}
		})

		// navigateTo({
		// 	path: "/",
		// })
	} else {
		app.value = data.value

		let arr = [...appContactLinks.value]
		arr.forEach((link, index) => {
			if (app.value[link.name]) {
				appContactLinks.value[index].tooltip = app.value[link.name]
			} else {
				appContactLinks.value.splice(index, 1)
			}
		})
	}
}

const limit = ref(15)
const fetchAppBridgeTxs = async () => {
	isLoading.value = true

	const { data } = await fetchAccountTransactions({
		hash: app.value?.native_bridge,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	
	bridgeTxs.value = data.value
	handleNextCondition.value = bridgeTxs.value?.length < limit.value
	
	isLoading.value = false
}

const fetchAppRollupActions = async () => {
	isLoading.value = true

	const { data } = await fetchRollupActions({
		hash: getRollupHashSafeURL(app.value?.rollup),
		bridge_actions: true,
		rollup_actions: true,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	rollupActions.value = data.value
	handleNextCondition.value = rollupActions.value?.length < limit.value

	isLoading.value = false
}

const fetchRollup = async () => {
	isLoading.value = true

	const { data } = await fetchRollupByHash(getRollupHashSafeURL(app.value?.rollup))
	rollup.value = data.value

	isLoading.value = false
}

const fetchData = async () => {
	switch (activeTab.value) {
		case "bridge_txs":
			await fetchAppBridgeTxs()
			break
		case "rollup_actions":
			await fetchAppRollupActions()
			break
		case "analytics":
			await fetchRollup()
			break
	}
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
	title: `Application ${app.value?.name} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Application ${app.value?.name}. The metadata, description, links, bridge, rollup.`,
		},
		{
			property: "og:title",
			content: `Application ${app.value?.name} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Application ${app.value?.name}. The metadata, description, links, bridge, rollup.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Application ${app.value?.name} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Application ${app.value?.name}. The metadata, description, links, bridge, rollup.`,
		},
	],
})

const selectedPeriodIdx = ref(0)
const selectedPeriod = computed(() => periods.value[selectedPeriodIdx.value])

const tabs = ref([
	{
		name: "bridge_txs",
		display: true,
	},
	{
		name: "rollup_actions",
		display: true,
	},
	{
		name: "analytics",
		display: true,
	}
])
const activeTab = ref(route.query.tab && tabs.value.map((tab) => tab.name).includes(route.query.tab) ? route.query.tab : tabs.value[0].name)

const updateRouteQuery = () => {
	router.replace({
		query: {
			tab: activeTab.value,
		},
	})
}

const periods = ref([
	{
		title: "Last 24 hours",
		value: 24,
		timeframe: "hour",
	},
	{
		title: "Last 7 days",
		value: 7,
		timeframe: "day",
	},
	{
		title: "Last 31 days",
		value: 31,
		timeframe: "day",
	},
])

const isUpdatingPaage = ref(false)
watch(
	() => activeTab.value,
	async () => {
		isUpdatingPaage.value = true

		page.value = 1
		updateRouteQuery()
		await fetchData()

		isUpdatingPaage.value = false
	},
)

watch(
	() => page.value,
	async () => {
		if (isUpdatingPaage.value) return

		await fetchData()
	},
)

onBeforeMount(async () => {
	await fetchApp()
	if (app.value) {
		await fetchData()
		updateRouteQuery()
	}
})
</script>

<template>
	<Flex v-if="app" direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Flex align="start" justify="between">
				<Breadcrumbs
					:items="[
						{ link: '/', name: 'Explore' },
						{ link: '/apps', name: 'Applications' },
						{ link: route.fullPath, name: `Application` },
					]"
				/>

				<NuxtLink to="https://forms.gle/dfR6QJJah9kfPe3N6" target="blank" :class="$style.register_app_btn">
					<Flex align="center" gap="6">
						<Icon name="application" color="brand" size="12" />
						<Text size="12">Register your app</Text>
					</Flex>
				</NuxtLink>
			</Flex>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="8">
					<Flex v-if="app?.logo" align="center" justify="center" :class="$style.avatar_container">
						<img :src="app?.logo" :class="$style.avatar_image" />
					</Flex>
					<Icon v-else name="rollup" size="14" color="primary" />

					<Text size="14" weight="600" color="primary"> {{ app?.name }}</Text>
				</Flex>

				<Flex align="center" gap="16">
					<Tooltip v-for="link in appContactLinks">
						<NuxtLink :to="link.tooltip" target="blank">
							<Icon
								:name="link.icon"
								:size="size"
								color="secondary"
								:class="$style.contact_icon"
							/>
						</NuxtLink>

						<template #content>
							{{ link.tooltip }}
						</template>
					</Tooltip>
				</Flex>
			</Flex>
		</Flex>

		<AppMetadata :app="app" />

		<Flex direction="column" gap="12">
			<Flex align="center" justify="between" :class="$style.navigation">
				<Flex align="center" gap="8" :class="$style.tabs">
					<Text
						v-for="tab in tabs.filter(tab => tab.display)"
						@click="activeTab = tab.name"
						size="13"
						weight="600"
						color="secondary"
						:class="[$style.tab, activeTab === tab.name && $style.active]"
					>
						{{ capitalizeAndReplaceUnderscore(tab.name) }}
					</Text>
				</Flex>

				<Flex v-if="activeTab !== 'analytics'" align="center" gap="6" :class="$style.pagination">
					<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1 || isLoading">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
					</Button>
					<Button size="mini" type="secondary">Page {{ page }}</Button>
					<Button @click="handleNext" size="mini" type="secondary" :disabled="isLoading || handleNextCondition">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
					</Button>
				</Flex>
				
				<Flex v-else align="center" gap="6" :class="$style.pagination">
					<Dropdown>
						<Button size="mini" type="secondary">
							{{ selectedPeriod.title }}
							<Icon name="chevron" size="14" color="secondary" />
						</Button>

						<template #popup>
							<DropdownItem v-for="(period, idx) in periods" @click="selectedPeriodIdx = idx">
								<Flex align="center" gap="8">
									<Icon :name="idx === selectedPeriodIdx ? 'check' : ''" size="12" color="secondary" />
									{{ period.title }}
								</Flex>
							</DropdownItem>
						</template>
					</Dropdown>
				</Flex>
			</Flex>

			<AccountTransactions v-if="activeTab === 'bridge_txs'" :txs="bridgeTxs" :isLoading="isLoading" />
			<RollupActions v-if="activeTab === 'rollup_actions'" :actions="rollupActions" :isLoading="isLoading" />
			<RollupCharts v-if="activeTab === 'analytics' && rollup" :rollup="rollup" :period="selectedPeriod" :hide="['actions_count']" />
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

.avatar_container {
	position: relative;
	width: 30px;
	height: 30px;
	overflow: hidden;
	border-radius: 50%;
}

.avatar_image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.contact_icon {
	cursor: pointer;
	transition: all 0.25s ease;

	&:hover {
		fill: var(--brand);
	}
}

.register_app_btn {
	border-radius: 6px;
	cursor: pointer;
	background: var(--op-5);
	border: 1px solid var(--brand);
	color: var(--brand);

	padding: 6px 8px;

	transition: all 0.2s ease;

}

@media (max-width: 650px) {
	.navigation {
		flex-direction: column-reverse;
		gap: 12px;
	}

	.tabs {
		width: 100%;
		justify-content: start;
	}

	.pagination {
		width: 100%;
		justify-content: end;
	}
}
</style>
