<script setup>
/** Services */
import { formatBytes, space, spaces } from "@/services/utils"
import { getNamespaceID, getNamespaceLink } from "@/services/utils/rollups"

const props = defineProps({
	rollup: {
		type: Object,
	},
})

const namespaceID = getNamespaceID(props.rollup)
const namespaceLink = getNamespaceLink(namespaceID)

const showMore = ref(false)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Hash</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="rollup.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ rollup.hash }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">
				{{ rollup.bridge_count > 0 ? "Rollup " : "" }} Actions Count
			</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ rollup.actions_count }} </Text>
		</Flex>

		<NuxtLink :to="`/block/${rollup.first_height}`" :class="[$style.item, $style.link]">
			<Flex align="center">
				<Text size="13" weight="600" color="secondary" :class="$style.key">First Height</Text>

				<Flex align="center" gap="4" :class="$style.value">
					<Text size="13" weight="600" color="primary" mono>{{ spaces(rollup.first_height) }}</Text>

					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</Flex>
		</NuxtLink>

		<NuxtLink :to="namespaceLink" target="_blank" :class="[$style.item, $style.link]">
			<Flex align="center">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Celestia Namespace ID</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="namespaceID" />

					<Flex align="center" gap="4">
						<Text size="13" weight="600" color="primary" mono>{{ space(namespaceID) }}</Text>

						<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
					</Flex>
				</Flex>
			</Flex>
		</NuxtLink>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Size</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">{{ formatBytes(rollup.size) }}</Text>
		</Flex>

		<template v-if="showMore">
			<!-- <Flex align="center" :class="$style.item">
					<Text size="13" weight="600" color="secondary" :class="$style.key">Signer</Text>

					<Flex align="center" gap="8" :class="$style.value">
						<CopyButton :text="rollup.signer" />
						<Text size="13" weight="600" color="primary" mono>{{ space(rollup.signer) }}</Text>
					</Flex>
				</Flex> -->
		</template>
	</Flex>

	<!-- <Flex @click="showMore = !showMore" align="center" justify="end" gap="4" :class="$style.show_more">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text size="12" weight="600" color="brand">Show {{ showMore ? 'Less' : 'More' }}</Text>
	</Flex> -->
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--op-10);
	background: var(--op-3);
}

.item {
	height: 36px;

	border-bottom: 1px solid var(--op-10);

	padding: 0 12px;

	&.link {
		display: flex;
		align-items: center;

		transition: all 0.2s ease;

		&:hover {
			background: var(--op-5);
		}
	}

	&:last-child {
		border-bottom: none;
	}
}

.key {
	min-width: 300px;
}

.value {
	min-width: 0;
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.show_more {
	margin-right: 6px;
	margin-top: -4px;

	cursor: pointer;
}

@media (max-width: 650px) {
	.item {
		height: 54px;

		flex-direction: column;
		align-items: start;
		justify-content: center;
		gap: 8px;

		overflow: hidden;
	}

	.value {
		width: 100%;
	}
}
</style>
