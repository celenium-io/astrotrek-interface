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

			<Flex v-if="block.height > 0" align="center" gap="8" :class="$style.value">
				<CopyButton :text="block.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ space(block.hash) }}</Text>
			</Flex>
			<Flex v-else align="center" gap="8" :class="$style.value">
				<Text size="13" weight="600" color="primary" mono> Genesis </Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Proposer</Text>

			<Flex v-if="block.proposer" align="center" gap="8" :class="$style.value">
				<CopyButton :text="block.proposer.address" />

				<NuxtLink :to="`/validator/${block.proposer.id}`" :style="{ width: '100%' }">
					<Flex align="center" gap="4">
						<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
							{{ block.proposer.name }}
							<Text color="tertiary">{{ block.proposer?.address }} </Text>
						</Text>

						<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
					</Flex>
				</NuxtLink>
			</Flex>
			<Flex v-else align="center" gap="8" :class="$style.value">
				<Text size="13" weight="600" color="primary" mono> Genesis </Text>
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
			<Text size="13" weight="600" color="secondary" :class="$style.key">Block Time</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ block.stats.block_time / 1_000 }}s </Text>
		</Flex>

		<template v-if="showMore && block.height > 0">
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

	<Button v-if="block.height > 0" @click="showMore = !showMore" type="secondary" size="mini">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text weight="600" color="brand">Show {{ showMore ? "Less" : "More" }}</Text>
	</Button>
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
	margin-top: -10px;

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
