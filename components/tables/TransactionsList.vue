<script setup>
/** Services */
import { shortHash } from "@/services/utils"

/** Components */
import ActionsRow from "@/components/shared/ActionsRow.vue"

const props = defineProps({
	txs: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" gap="8">
		<NuxtLink v-for="t in txs.slice(0, Math.min(txs.length, 5))" :to="`/tx/${t.hash}`" :class="$style.tx">
			<Flex justify="between" align="center" wide>
				<Flex align="center" gap="8">
					<Icon name="tx" size="12" :color="t.status === 'success' ? 'green' : 'red'" />

					<Text size="12" weight="600" color="primary">{{ shortHash(t.hash) }}</Text>
				</Flex>

				<ActionsRow :actions="t.action_types" />
			</Flex>
		</NuxtLink>

		<Flex v-if="txs.length > 5" align="center" gap="6">
			<Text size="12" weight="500" color="tertiary">{{ txs.length - 5 }} more.</Text>
			<Text size="12" weight="500" color="support"> View all transactions on the block page </Text>
		</Flex>
	</Flex>
</template>

<style module>
.tx {
	cursor: pointer;

	padding: 2px 6px;

	transition: all 0.2s ease;

	&:hover * {
		color: var(--brand);
	}

	&:active {
		transform: translateY(1px);
	}
}
</style>
