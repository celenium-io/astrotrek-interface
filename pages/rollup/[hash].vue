<script setup>
/** Modules */
import RollupActions from "~/components/modules/rollup/RollupActions.vue"
import RollupBridges from "~/components/modules/rollup/RollupBridges.vue"
import RollupCharts from "~/components/modules/rollup/RollupCharts.vue"
import RollupDeposits from "~/components/modules/rollup/RollupDeposits.vue"
import RollupMetadata from "~/components/modules/rollup/RollupMetadata.vue"


/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Button from "~/components/ui/Button.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import Tooltip from "~/components/ui/Tooltip.vue"

/** Services */
import { arraysAreEqual, capitalize, isMobile, shortHash } from "~/services/utils"

/** API */
import { fetchRollupActions, fetchRollupBridges, fetchRollupByHash, fetchRollupDeposits } from "~/services/api/rollup"

definePageMeta({
	layout: "default",
})

const route = useRoute()
const router = useRouter()

const rollup = ref()
const actions = ref([])
const bridges = ref([])
const deposits = ref([])

const isLoading = ref(false)

const rollupHashSafeURL = ref(route.params.hash)

const { data } = await fetchRollupByHash(rollupHashSafeURL.value)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	rollup.value = data.value
}

const limit = ref(15)
const fetchActions = async () => {
	isLoading.value = true

	const { data } = await fetchRollupActions({
		hash: rollupHashSafeURL.value,
		bridge_actions: bridgeActions.value,
		rollup_actions: rollupActions.value,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	actions.value = data.value
	handleNextCondition.value = actions.value.length < limit.value

	isLoading.value = false
}

const fetchBridges = async () => {
	isLoading.value = true

	const { data } = await fetchRollupBridges({
		hash: rollupHashSafeURL.value,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	
	bridges.value = data.value
	handleNextCondition.value = bridges.value.length < limit.value

	isLoading.value = false
}

const fetchDeposits = async () => {
	isLoading.value = true

	const { data } = await fetchRollupDeposits({
		hash: rollupHashSafeURL.value,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	
	deposits.value = data.value
	handleNextCondition.value = deposits.value.length < limit.value

	isLoading.value = false
}

const fetchData = async () => {
	switch (activeTab.value) {
		case "actions":
			await fetchActions()
			break
		case "bridges":
			await fetchBridges()
			break
		case "deposits":
			await fetchDeposits()
			break
	}
}

/** Filters */
const bridgeActions = ref(true)
const rollupActions = ref(true)
const filters = ref([])
async function initFilters() {
	let res = [
		{
			name: "bridge_actions",
			value: true,
			displayName: "Bridge Actions",
			type: "toggle"
		},
		{
			name: "rollup_actions",
			value: true,
			displayName: "Rollup Actions",
			type: "toggle"
		}
	]

	if (arraysAreEqual(filters.value, res)) {
		filters.value = res
	} else {
		filters.value = res
		await fetchData()
	}
}

const handleFilterUpdate = async (event) => {
	if (!event.length) {
		initFilters()
		return
	}

	if (arraysAreEqual(filters.value, event)) return

	filters.value = event
	bridgeActions.value = filters.value.find(f => f.name === "bridge_actions")?.value
	rollupActions.value = filters.value.find(f => f.name === "rollup_actions")?.value
	
	await fetchData()
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
	title: `Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash.toUpperCase().slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
		{
			property: "og:title",
			content: `Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Rollup ${rollup.value?.hash.toUpperCase().slice(0, 4)} ••• ${rollup.value?.hash
				.toUpperCase()
				.slice(-4)}. The hash, actions, metadata, size.`,
		},
	],
})

const selectedPeriodIdx = ref(0)
const selectedPeriod = computed(() => periods.value[selectedPeriodIdx.value])

const tabs = ref([
	{
		name: "actions",
		display: true,
	},
	{
		name: "bridges",
		display: rollup.value?.bridge_count > 0,
	},
	{
		name: "deposits",
		display: rollup.value?.bridge_count > 0,
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

// await fetchData()
await initFilters()
updateRouteQuery()

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

onMounted( async () => {
	// await initFilters()
	// updateRouteQuery()
})
</script>

<template>
	<Flex v-if="rollup" direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="40">
			<Breadcrumbs
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
						Rollup <Text weight="600">{{ !isMobile() ? rollup?.hash : shortHash(rollup?.hash) }}</Text>
					</Text>

					<Tooltip v-if="rollup?.bridge_count">
						<Icon name="bridge" size="18" color="brand" />

						<template #content>
							Associated with bridge account
						</template>
					</Tooltip>
				</Flex>

				<RawDataView :entity="rollup" name="rollup" />
			</Flex>
		</Flex>

		<RollupMetadata :rollup="rollup" />

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
						{{ capitalize(tab.name) }}
					</Text>
				</Flex>

				<Flex v-if="activeTab !== 'analytics'" align="center" gap="12" :class="$style.pagination">
					<Filter v-if="activeTab === 'actions'" @onUpdate="handleFilterUpdate" :filters="filters" :showClear="false" width="170" />

					<Flex align="center" gap="6">
						<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1">
							<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
						</Button>
						<Button size="mini" type="secondary">Page {{ page }}</Button>
						<Button @click="handleNext" size="mini" type="secondary" :disabled="handleNextCondition">
							<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
						</Button>
					</Flex>
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

			<RollupActions v-if="activeTab === 'actions'" :actions="actions" :isLoading="isLoading" />
			<RollupBridges v-if="activeTab === 'bridges'" :bridges="bridges" :isLoading="isLoading" />
			<RollupDeposits v-if="activeTab === 'deposits'" :deposits="deposits" :isLoading="isLoading" />

			<RollupCharts v-if="activeTab === 'analytics'" :rollup="rollup" :period="selectedPeriod" />
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
