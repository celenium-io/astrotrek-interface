<script setup>
/** Services */
import { comma, shortHash } from "~/services/utils"

/** Modules */
import TxMetadata from "~/components/modules/tx/TxMetadata.vue"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

definePageMeta({
	layout: "default",
})

const route = useRoute()

const tx = ref()

const { data } = await fetchTxByHash(route.params.hash)
if (!data.value) {
	navigateTo({
		path: "/",
	})
} else {
	tx.value = data.value
}

useHead({
	title: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash.toUpperCase().slice(-4)} - Astria Explorer`,
	link: [
		{
			rel: "canonical",
			href: `https://astrotrek.io${route.path}`,
		},
	],
	meta: [
		{
			name: "description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
		{
			property: "og:title",
			content: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			property: "og:description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
		{
			property: "og:url",
			content: `https://astrotrek.io${route.path}`,
		},
		{
			name: "twitter:title",
			content: `Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)} - Astria Explorer`,
		},
		{
			name: "twitter:description",
			content: `Astria Transaction ${tx.value?.hash.toUpperCase().slice(0, 4)} ••• ${tx.value?.hash
				.toUpperCase()
				.slice(-4)}. The timestamp, hash, actions, metadata, gas used.`,
		},
	],
})

const tabs = ref([{ name: "Details" }])
const activeTab = ref(tabs.value[0].name)
</script>

<template>
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Breadcrumbs
				v-if="tx"
				:items="[
					{ link: '/', name: 'Explore' },
					{ link: '/txs', name: 'Transactions' },
					{ link: route.fullPath, name: `Transaction` },
				]"
			/>

			<Flex align="center" justify="between" wide>
				<Flex align="center" gap="8">
					<Icon name="tx" size="14" color="primary" />
					<Text size="14" weight="500" color="primary">
						Transaction <Text weight="600">{{ shortHash(tx.hash) }}</Text>
					</Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex direction="column" gap="8">
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

			<TxMetadata v-if="activeTab === 'Details'" :tx="tx" />
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
	border-radius: 6px;
	cursor: pointer;

	padding: 6px 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}

	&.active {
		background: var(--op-10);
		color: var(--txt-primary);
	}
}
</style>
