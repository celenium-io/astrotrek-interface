<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchTxActions, fetchTxByHash } from "@/services/api/tx"

/** Services */
import { capitalize, midHash, shortHash, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import Sidebar from "@/components/ui/Sidebar.vue"

/** Components */
import ActionsList from "@/components/tables/ActionsList.vue"
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

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

const isLoadingActions = ref(true)
const actions = ref([])

const isLoadingFees = ref(true)
const fees = ref([])

const getActions = async () => {
	isLoadingActions.value = true

	const { data } = await fetchTxActions({ hash: props.tx.hash })
	actions.value = data.value || []

	isLoadingActions.value = false
}

const getFees = async () => {
	if (props.tx.fees) {
		fees.value = props.tx.fees
		return
	}

	isLoadingFees.value = true

	const { data } = await fetchTxByHash(props.tx.hash, true)
	if (data.value) {
		fees.value = data.value.fees
	}

	isLoadingFees.value = false
}

watch(
	() => props.show,
	() => {
		if (props.show) {
			getActions()
			getFees()
		} else {
			actions.value = []
			fees.value = []
		}
	},
)
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" gap="16" wide>
			<Flex direction="column" gap="16" :class="$style.content">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Tooltip>
							<Icon name="tx" size="14" :color="tx.status === 'success' ? 'green' : 'red'" />

							<template #content>
								<Text :color="tx.status === 'success' ? 'green' : 'red'">{{ capitalize(tx.status) }}</Text>
							</template>
						</Tooltip>

						<Text size="13" weight="500" color="secondary"> Transaction </Text>
					</Flex>

					<Flex align="center" gap="8">
						<LinkToEntity
							@click="emit('onClose')"
							:entity="{ title: midHash(tx.hash), type: 'tx', id: tx.hash}"
							mode="sidebar"
							color="primary"
							size="16"
							weight="600"
							height="120"
						/>

						<CopyButton :text="tx.hash" />
					</Flex>
				</Flex>

				<Text size="12" weight="500" color="secondary">
					{{ DateTime.fromISO(tx.time).setLocale("en").toFormat("LLL d, y, tt") }}
				</Text>

				<NuxtLink @click="emit('onClose')" :to="`/account/${tx.signer.hash}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">Signer</Text>

							<Text size="12" weight="600" color="tertiary">{{ $getDisplayName('addresses', null, tx.signer, false) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink>

				<NuxtLink @click="emit('onClose')" :to="`/block/${tx.height}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">Block Height</Text>
							
							<Text size="12" weight="600" color="tertiary">{{ spaces(tx.height) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink>

				<div :class="$style.divider" />

				<Flex align="center" justify="between">
					<Text size="13" weight="600" color="primary">Actions</Text>
					<Text size="13" weight="600" color="primary">{{ tx.actions_count }}</Text>
				</Flex>

				<ActionsList v-if="actions.length" :actions="actions" :number="tx.actions_count" />
				<Text v-else-if="isLoadingActions" size="12" weight="500" color="tertiary">Loading actions...</Text>
				<Text v-else size="12" weight="500" color="tertiary">There is no actions in the transaction</Text>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Total Fee</Text>

						<Skeleton v-if="isLoadingFees" w="40" h="12" />
						<Flex v-else-if="fees?.length" align="center" direction="column" gap="4">
							<Flex v-for="fee in fees" align="center" gap="4">
								<Text size="13" weight="600" color="primary"> {{ spaces(fee.amount) }} </Text>
								<Text size="13" weight="600" color="secondary"> {{ getAssetName(fee.asset) }} </Text>
							</Flex>
						</Flex>
						<Flex v-else align="center">
							<Text size="13" weight="600" color="primary">0</Text>
						</Flex>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Nonce</Text>

						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="primary"> {{ tx.nonce }} </Text>
							<CopyButton :text="tx.nonce" />
						</Flex>
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

			<Button @click="emit('onClose')" :link="`/tx/${tx.hash}`" type="secondary" size="medium"> Open Transaction </Button>
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

.content {
	height: 100%;
	overflow-y: auto;
}
</style>
