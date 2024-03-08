<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { shortHash, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"

const props = defineProps({
	block: {
		type: Object,
		requiered: true,
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
						<Icon name="block" size="12" color="secondary" />
						<Text size="13" weight="500" color="secondary"> Block </Text>
					</Flex>
					<Text size="16" weight="600" height="120" color="primary"> {{ spaces(block.height) }} </Text>
				</Flex>

				<Text size="12" weight="500" color="secondary">{{ DateTime.fromISO(block.time).setLocale("en").toFormat("LLL d, y, tt") }}</Text>

				<Flex direction="column" gap="8" :class="$style.proposer">
					<Text size="12" weight="600" color="secondary">Proposer</Text>
					<Text size="13" weight="600" color="primary"> {{ block.proposer?.name }}</Text>
					<Text size="12" weight="600" color="tertiary">{{ block.proposer?.address }}</Text>
				</Flex>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.hash) }}
							</Text>

							<CopyButton :text=block.hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Parent Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.parent_hash) }}
							</Text>

							<CopyButton :text=block.parent_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Last Commit Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.last_commit_hash) }}
							</Text>

							<CopyButton :text=block.last_commit_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Data Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.data_hash) }}
							</Text>

							<CopyButton :text=block.data_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Validators Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.validators_hash) }}
							</Text>

							<CopyButton :text=block.validators_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Consensus Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.consensus_hash) }}
							</Text>

							<CopyButton :text=block.consensus_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">App Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.app_hash) }}
							</Text>

							<CopyButton :text=block.app_hash />
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Evidence Hash</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary">
								{{ shortHash(block.evidence_hash) }}
							</Text>

							<CopyButton :text="block.evidence_hash" />
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Button type="secondary" size="medium">Open Block</Button>
		</Flex>
	</Sidebar>
</template>

<style module>
.proposer {
	border-radius: 6px;
	background: var(--op-8);

	padding: 8px;
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}
</style>
