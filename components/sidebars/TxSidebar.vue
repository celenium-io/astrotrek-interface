<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { midHash, shortHash, spaces, comma } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"

/** Shared Components */
import ActionBadge from "@/components/shared/ActionBadge.vue"

const props = defineProps({
	tx: {
		type: Object,
		required: true,
	},
	show: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["onClose"])
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide>
			<Flex direction="column" gap="16">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Icon name="tx" size="12" :color="tx.status === 'success' ? 'green' : 'red'" />
						<Text size="13" weight="500" color="secondary"> Transaction </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="16" weight="600" height="120" color="primary">
							{{ midHash(tx.hash) }}
						</Text>
						<CopyButton :text="tx.hash" />
					</Flex>
				</Flex>

				<Text size="12" weight="500" color="secondary">
					{{ DateTime.fromISO(tx.time).setLocale("en").toFormat("LLL d, y, tt") }}
				</Text>

				<Flex direction="column" gap="8" :class="$style.card">
					<Text size="12" weight="600" color="secondary">Signer</Text>
					<Text size="12" weight="600" color="tertiary">{{ space(tx.signer) }}</Text>
				</Flex>

				<NuxtLink @click="emit('onClose')" :to="`/block/${tx.height}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">Block Height</Text>
							<Text size="12" weight="600" color="tertiary">{{ comma(tx.height) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Actions</Text>

						<Text size="13" weight="600" color="primary"> {{ tx.actions_count }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Nonce</Text>

						<Text size="13" weight="600" color="primary"> {{ tx.nonce }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Gas Used / Wanted</Text>

						<Text size="13" weight="600" color="primary"> {{ tx.gas_used }} / {{ tx.gas_wanted }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Signature</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary" tabular>
								{{ shortHash(tx.signature) }}
							</Text>

							<CopyButton :text="tx.signature" />
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Button @click="emit('onClose')" :link="`/tx/${tx.hash}`" type="secondary" size="medium">Open Transaction</Button>
		</Flex>
	</Sidebar>
</template>

<style module>
.card {
	border-radius: 6px;
	background: var(--op-8);
	cursor: pointer;

	padding: 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}
</style>
