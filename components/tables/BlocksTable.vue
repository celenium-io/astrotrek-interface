<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { formatBytes, spaces, splitAddress } from "@/services/utils"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	blocks: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
	recentBlocks: {
		type: Boolean,
		default: false,
	},
	generalBlocksList: {
		type: Boolean,
		default: false,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
			<Spinner size="16" />

			<Flex direction="column" align="center" gap="8">
				<Text size="14" weight="500" color="primary">Fetching blocks...</Text>
				<Text size="13" weight="500" color="tertiary">It's almost done</Text>
			</Flex>
		</Flex>

		<Flex
			v-else-if="blocks.length"
			v-for="b in blocks"
			@click="sidebarsStore.open('block', b)"
			justify="between"
			align="center"
			:class="[
				!recentBlocks && !generalBlocksList && $style.row,
				recentBlocks && $style.row_recent_blocks,
				generalBlocksList && $style.row_general_list,
				isLoading && $style.disabled,
			]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="block" size="16" color="secondary" />

					<LinkToEntity
						:entity="{ title: spaces(b.height), type: 'block', id: b.height }"
						size="13"
						color="primary"
						weight="600"
					/>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="tertiary">Proposer</Text>

					<LinkToEntity
						v-if="b.proposer"
						:entity="{
							title: b.proposer.name ? b.proposer.name : splitAddress(b.proposer.address),
							type: 'validator',
							id: b.proposer.id,
						}"
						color="secondary"
					/>

					<Text v-else size="12" weight="500" color="secondary">Genesis</Text>

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="secondary">
						{{ formatBytes(b.stats.bytes_in_block, 2, "number") }}
						<Text color="tertiary">{{ formatBytes(b.stats.bytes_in_block, 2, "unit") }}</Text>
					</Text>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="8">
				<Flex align="center" gap="4">
					<Icon name="tx-circle" size="12" color="light-green" />
					<Text size="13" weight="600" color="primary"> {{ b.stats.tx_count }} <Text color="secondary">Txs</Text> </Text>
				</Flex>

				<Text size="12" weight="500" color="tertiary">
					{{ DateTime.fromISO(b.time).toRelative({ locale: "en", style: "short" }) }}
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
}

.row {
	height: 60px;

	border-top: 1px solid var(--op-5);

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&:first-child {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-top: none;
	}

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.row_recent_blocks {
	height: 60px;

	border-top: 1px solid var(--op-5);
	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&:active {
		background: var(--op-10);
	}

	&:last-child {
		border-bottom: 1px solid var(--op-5);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.row_general_list {
	height: 60px;

	border-top: 1px solid var(--op-5);

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
