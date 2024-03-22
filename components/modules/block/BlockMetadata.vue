<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { formatBytes, space } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	block: {
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
				<CopyButton :text="block.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ space(block.hash) }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Proposer</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="block.proposer.address" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
					{{ block.proposer.name }}
					<Text color="tertiary">{{ space(block.proposer.address) }} </Text>
				</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Timestamp</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">
				{{ DateTime.fromISO(block.time).setLocale("en").toFormat("tt, LLL d, y") }}
				<Text color="tertiary"> ({{ DateTime.fromISO(block.time).toRelative({ locale: "en", style: "short" }) }}) </Text>
			</Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Action Types</Text>

			<Text v-if="block.action_types.length" size="13" weight="600" color="primary" mono :class="$style.value">
				{{ block.action_types.join(", ") }}
			</Text>
			<Text v-else size="13" weight="600" color="tertiary" mono :class="$style.value"> No action types </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Size</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">
				{{ formatBytes(block.stats.bytes_in_block) }}
			</Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Transactions</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">
				{{ block.stats.tx_count }}
			</Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Fee</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ block.stats.fee }} NRIA </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Block Time</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ block.stats.block_time / 1_000 }}s </Text>
		</Flex>

		<template v-if="showMore">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">App Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.app_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.app_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Consensus Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.consensus_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.consensus_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Data Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.data_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.data_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Evidence Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.evidence_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.evidence_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Last Commit Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.last_commit_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.last_commit_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Last Results Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.last_results_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.last_results_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Parent Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.parent_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.parent_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Validators Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.validators_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.validators_hash) }}
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Version Block</Text>

				<Text size="13" weight="600" color="primary" mono :class="$style.value">
					{{ block.version_block }}
				</Text>
			</Flex>
		</template>
	</Flex>

	<Flex @click="showMore = !showMore" align="center" justify="end" gap="4" :class="$style.show_more">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text size="12" weight="600" color="brand">Show {{ showMore ? 'Less' : 'More' }}</Text>
	</Flex>
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
