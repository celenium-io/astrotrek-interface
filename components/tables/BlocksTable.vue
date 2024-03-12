<script setup>
/** Vendor */
import { DateTime } from "luxon"


/** Services */
import { formatBytes, spaces, splitAddress } from "@/services/utils"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	blocks: {
		type: Array,
	},
})

</script>

<template>
	<Flex direction="column" :class="$style.rows">
		<Flex
			v-if="blocks"
			v-for="b in blocks"
			@click="sidebarsStore.open('block', b)"
			justify="between"
			align="center"
			:class="$style.row"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="8">
					<Icon name="block" size="16" color="secondary" />

					<Text size="13" weight="600" color="primary"> {{ spaces(b.height) }} </Text>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="secondary">
						<Text color="tertiary">Proposer</Text>
						{{ b.proposer ? splitAddress(b.proposer.address) : 'Genesis'}}
					</Text>

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
	flex: 1;

	border-radius: 12px;
	background: var(--card-background);

	padding: 0 0 14px 0;
}

.rows {
	margin-top: 20px;
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

	&:active {
		background: var(--op-10);
	}

	&:last-child {
		border-bottom: 1px solid var(--op-5);
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>
