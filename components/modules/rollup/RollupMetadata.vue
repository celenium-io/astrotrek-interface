<script setup>
/** Services */
import { formatBytes, space, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	rollup: {
		type: Object,
	},
})

const showMore = ref(false)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Hash</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="rollup.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ space(rollup.hash) }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Actions Count</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ rollup.actions_count }} </Text>
		</Flex>

		<NuxtLink :to="`/block/${rollup.first_height}`">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">First Height</Text>

				<Text size="13" weight="600" color="primary" mono :class="$style.value">{{ spaces(rollup.first_height) }}</Text>
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
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}

.item {
	height: 36px;

	padding: 0 12px;

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
}
</style>