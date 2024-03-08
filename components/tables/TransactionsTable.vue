<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { capitalize, shortHash, splitAddress } from "@/services/utils"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	txs: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.rows">
		<Flex
			v-if="txs"
			v-for="t in txs"
			@click="sidebarsStore.open('tx', t)"
			justify="between"
			align="center"
			:class="$style.row"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="8">
					<Icon name="tx-circle" size="16" :color="t.status === 'success' ? 'light-green' : 'red'" />

					<Flex align="center" gap="8">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(t.hash) }}
							</Text>
						</Flex>

						<Text v-for="action in t.action_types" size="13" weight="600" color="tertiary">
							{{ capitalize(action) }}
						</Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="secondary">
						<Text color="tertiary">Signer</Text>

						{{ splitAddress(t.signer, 4) }}
					</Text>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="8">
				<Text size="12" weight="500" color="tertiary">
					{{ DateTime.fromISO(t.time).toRelative({ locale: "en", style: "short" }) }}
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 636px;

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

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
