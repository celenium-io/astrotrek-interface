<script setup>
/** Services */
import { formatBytes, space, comma } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	tx: {
		type: Object,
	},
})

console.dir(props.tx)

const showMore = ref(false)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Hash</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="tx.hash" />
				<Text size="13" weight="600" color="primary" mono>{{ space(tx.hash) }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Action Types ({{ tx.actions_count }})</Text>

			<Text v-if="tx.action_types.length" size="13" weight="600" color="primary" mono :class="$style.value">
				{{ tx.action_types.join(", ") }}
			</Text>
			<Text v-else size="13" weight="600" color="tertiary" mono :class="$style.value"> No action types </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Block Height</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">{{ comma(tx.height) }}</Text>
		</Flex>

		<template v-if="showMore"> </template>
	</Flex>

	<Button @click="showMore = !showMore" size="small" type="secondary">{{ showMore ? "Hide" : "Show More" }}</Button>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-8);
}

.item {
	height: 36px;

	border-bottom: 1px solid var(--op-5);

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

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
