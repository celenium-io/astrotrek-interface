<script setup>
/** Services */
import { comma, shortHash } from "~/services/utils"

/** Modules */
import RollupMetadata from "~/components/modules/rollup/RollupMetadata.vue"
import RollupActions from "~/components/modules/rollup/RollupActions.vue";

/** UI */
import Button from "~/components/ui/Button.vue"

/** API */
import { fetchRollupActions, fetchRollupByHash } from "~/services/api/rollup"

/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
import { capitalize } from "vue";
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()

definePageMeta({
	layout: "default",
})

const route = useRoute()

const rollup = ref()
const actions = ref([])
const isLoading = ref(false)

const { data } = await fetchRollupByHash(route.params.hash)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	rollup.value = data.value
	cacheStore.current.rollup = rollup.value
}

const limit = ref(15)
const fetchActions = async () => {
	isLoading.value = true

	const { data } = await fetchRollupActions({
		hash: rollup.value?.hash,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
	})
	actions.value = data.value
	console.log(actions.value);
	handleNextCondition.value = actions.value.length < limit.value

	isLoading.value = false
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

const handleViewRawData = () => {
	cacheStore.current._target = "rollup"
	modalsStore.open("rawData")
}

const tabs = ref([{ name: "Actions" }])
const activeTab = ref(tabs.value[0].name)

await fetchActions()

watch(
	() => page.value,
	() => {
		fetchActions()
	},
)

</script>

<template>
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Breadcrumbs
				v-if="rollup"
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
						Rollup <Text weight="600">{{ shortHash(rollup.hash) }}</Text>
					</Text>
				</Flex>

				<Icon @click="handleViewRawData" name="code-brackets" size="18" color="brand" :style="{cursor: 'pointer'}" />
			</Flex>
		</Flex>

		<RollupMetadata :rollup="rollup" />

		<Flex direction="column" gap="8">
			<Flex align="center" justify="between" gap="8">
				<Text
					v-for="tab in tabs"
					@click="activeTab = tab.name"
					size="13"
					weight="600"
					color="secondary"
					:class="[$style.tab, activeTab === tab.name && $style.active]"
				>
					{{ tab.name }}
				</Text>

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

			<RollupActions v-if="activeTab === 'Actions'" :actions="actions" :isLoading="isLoading" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);
	width: 100%;

	padding: 0 24px;
	margin-top: 60px;
	margin-bottom: 120px;
}

.tab {
	height: 40px;
	border-radius: 6px;
	cursor: pointer;

	padding: 6px 8px;

	transition: all 0.2s ease;

	&:hover {
		color: var(--brand);
	}

	&.active {
		color: var(--brand);
		/* opacity: 0.6; */
	}
}

</style>
