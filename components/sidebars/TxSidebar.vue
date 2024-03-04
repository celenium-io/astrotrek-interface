<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { shortHash } from "@/services/utils/general"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"

const props = defineProps({
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
						<Icon name="tx" size="12" color="green" />
						<Text size="13" weight="500" color="secondary"> Transaction </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="16" weight="600" height="120" color="primary">
							{{ shortHash("f04a2f5d53e7e5bb2e788aa4ee126884677aba765e266b73fa0a08796f9ec958") }}
						</Text>
						<CopyButton text="123" />
					</Flex>
				</Flex>

				<Text size="12" weight="500" color="secondary">{{ DateTime.now().setLocale("en").toFormat("ff") }}</Text>

				<Flex direction="column" gap="8" :class="$style.proposer">
					<Text size="12" weight="600" color="secondary">Signer</Text>
					<Text size="13" weight="600" color="primary">node0</Text>
					<Text size="12" weight="600" color="tertiary">230592632006DB2733444BB6DE11DB3F4B2F9AE4</Text>
				</Flex>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Actions</Text>

						<Text size="13" weight="600" color="primary"> 1 </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Nonce</Text>

						<Text size="13" weight="600" color="primary"> 6 </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Gas Used / Wanted</Text>

						<Text size="13" weight="600" color="primary"> 0 / 0 </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Signature</Text>

						<Flex align="center" gap="6">
							<CopyButton text="123" />
							<Text size="13" weight="600" color="primary">
								{{ shortHash("DC83DFA65818A2DF292728C2E249582DA10619DB2901227A8F8DD1912D4DB105") }}
							</Text>
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
