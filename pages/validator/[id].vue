<script setup>
/** Services */
import { shortHash } from "~/services/utils"

/** Modules */
import ValidatorMetadata from "~/components/modules/validator/ValidatorMetadata.vue"
import ValidatorBlocks from "~/components/modules/validator/ValidatorBlocks.vue"

/** Components */
import RawDataView from "@/components/shared/RawDataView.vue"

/** UI */
import Button from "~/components/ui/Button.vue"

/** API */
import { fetchValidatorBlocks, fetchValidatorById } from "~/services/api/validator"

definePageMeta({
	layout: "default",
})

const route = useRoute()

const validator = ref()
const blocks = ref([])
const isLoading = ref(false)

const { data } = await fetchValidatorById(route.params.id)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	validator.value = data.value
}

const limit = ref(15)
const fetchBlocks = async () => {
	isLoading.value = true

	const { data } = await fetchValidatorBlocks({
		id: validator.value?.id,
		limit: limit.value,
		offset: (page.value - 1) * limit.value,
		sort: "desc",
	})
	blocks.value = data.value
	handleNextCondition.value = blocks.value.length < limit.value

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
	title: `Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
		.toUpperCase()
		.slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
				.toUpperCase()
				.slice(-4)}. The address, blocks, metadata, uptime.`,
		},
		{
			property: "og:title",
			content: `Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
				.toUpperCase()
				.slice(-4)}. The address, blocks, metadata, uptime.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Validator ${validator.value?.address.toUpperCase().slice(0, 4)} ••• ${validator.value?.address
				.toUpperCase()
				.slice(-4)}. The address, blocks, metadata, uptime.`,
		},
	],
})

const tabs = ref([{ name: "Blocks" }])
const activeTab = ref(tabs.value[0].name)

await fetchBlocks()

watch(
	() => page.value,
	() => {
		fetchBlocks()
	},
)
</script>

<template>
	<Flex v-if="validator" direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Breadcrumbs
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/validators', name: 'Validators' },
					{ link: route.fullPath, name: `Validator` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="8">
					<Icon name="validator" size="14" color="primary" />

					<Text size="14" weight="500" color="primary">
						Validator <Text weight="600">{{ shortHash(validator.address) }}</Text>
					</Text>

					<Text v-if="validator.power === '0'" size="14" weight="500" color="red">Inactive</Text>
				</Flex>

				<RawDataView :entity="validator" name="validator" />
			</Flex>

			<ValidatorMetadata :validator="validator" />
		</Flex>

		<Flex direction="column" gap="12">
			<Flex align="center" justify="between">
				<Flex align="center" gap="8">
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
				</Flex>

				<Flex align="center" gap="6" :class="$style.pagination">
					<Button @click="handlePrev" size="mini" type="secondary" :disabled="page === 1 || isLoading">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(90deg)" />
					</Button>
					<Button size="mini" type="secondary">Page {{ page }}</Button>
					<Button @click="handleNext" size="mini" type="secondary" :disabled="isLoading || handleNextCondition">
						<Icon name="chevron" size="14" color="primary" style="transform: rotate(-90deg)" />
					</Button>
				</Flex>
			</Flex>

			<ValidatorBlocks v-if="activeTab === 'Blocks'" :blocks="blocks" :isLoading="isLoading" />
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
</style>
