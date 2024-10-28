<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Services */
import { capitalizeAndReplaceUnderscore, midHash, shortHash, spaces } from "@/services/utils"
import { getActionDataLength, getActionDescription, getActionTitle, getAssetName } from "@/services/utils/actions.js"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
import { useSidebarsStore } from "@/store/sidebars"
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	actions: {
		type: Array,
		required: true,
	},
	txLink: {
		type: Boolean,
		default: false,
	},
})

const handleViewRawData = (action) => {
	cacheStore.current.action = action
	cacheStore.current._target = "action"
	modalsStore.open("rawData")
}

const handleOpenTx = async (action) => {
	const { data } = await fetchTxByHash(action.tx_hash)
	if (data.value) {
		sidebarsStore.open("tx", data.value)
	}
}
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex v-for="act in actions" @click="handleViewRawData(act)" justify="between" align="center" :class="$style.row">
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="action" size="13" color="tertiary" />

					<Flex align="center" gap="8">
						<Text size="13" weight="600" color="primary">
							{{ getActionTitle(act.type) }}
						</Text>
					</Flex>

					<Flex v-if="act.type === 'rollup_data_submission'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Pushed ${getActionDataLength(act)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: act.data.rollup_id, type: 'rollup', id: getRollupHashSafeURL(act.data.rollup_id) }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'transfer'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Sent ${spaces(act.data.amount)} ${getAssetName(act.data.asset)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.to), type: 'account', id: act.data.to }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'mint'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Minted ${spaces(act.data.amount)} ${getAssetName(act.data.asset)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.to), type: 'account', id: act.data.to }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'sudo_address_change'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">Set</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.new_address), type: 'account', id: act.data.new_address }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>

						<Text size="13" weight="500" color="secondary">as new sudo address</Text>
					</Flex>

					<Flex v-else-if="act.type === 'ibc_relayer_change'">
						<Flex v-if="act.data.addition" gap="4" :class="$style.description">
							<LinkToEntity
								:entity="{ title: midHash(act.data.addition), type: 'account', id: act.data.addition }"
								color="secondary"
								size="13"
								:class="$style.link"
							/>

							<Text size="13" weight="500" color="secondary">was added as IBC relayer</Text>
						</Flex>

						<Flex v-else="act.data.removal" gap="4" :class="$style.description">
							<LinkToEntity
								:entity="{ title: midHash(act.data.removal), type: 'account', id: act.data.removal }"
								color="secondary"
								size="13"
								:class="$style.link"
							/>

							<Text size="13" weight="500" color="secondary">was removed as IBC relayer</Text>
						</Flex>
					</Flex>

					<Flex v-else-if="act.type === 'ics20_withdrawal'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Withdraw ${spaces(act.data.amount)} ${getAssetName(act.data.denom)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.destination_address), type: 'account', id: act.data.destination_address }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'init_bridge_account'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Bridge account was initialized for` }}
						</Text>

						<LinkToEntity
							:entity="{ title: act.data.rollup_id, type: 'rollup', id: getRollupHashSafeURL(act.data.rollup_id) }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'bridge_lock'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Transfer ${spaces(act.data.amount)} ${getAssetName(act.data.asset)} from sequencer to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.to), type: 'account', id: act.data.to }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'bridge_unlock'" gap="4" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Unlock ${spaces(act.data.amount)} ${getAssetName(act.data.fee_asset)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: midHash(act.data.to), type: 'account', id: act.data.to }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'bridge_sudo_change_action'" gap="4" :class="$style.description">
						<LinkToEntity
							:entity="{ title: shortHash(act.data.bridge), type: 'account', id: act.data.bridge }"
							color="secondary"
							size="13"
							:style="{minWidth: '50px'}"
							:class="$style.link"
						/>

						<Text size="13" weight="500" color="secondary">
							bridge settings were changed:
						</Text>

						<Flex v-if="act.data.sudo" gap="4" :class="$style.description_el">
							<Text size="13" weight="500" color="secondary">
								Sudo ->
							</Text>

							<LinkToEntity
								:entity="{ title: shortHash(act.data.sudo), type: 'account', id: act.data.sudo }"
								color="secondary"
								size="13"
								:style="{minWidth: '50px'}"
								:class="$style.link"
							/>

							<Text v-if="act.data.withdrawer || act.data.fee_asset" size="13" weight="500" color="secondary">
								|
							</Text>
						</Flex>

						<Flex v-if="act.data.withdrawer" gap="4" :class="$style.description_el">
							<Text size="13" weight="500" color="secondary">
								Withdrawer ->
							</Text>

							<LinkToEntity
								:entity="{ title: shortHash(act.data.withdrawer), type: 'account', id: act.data.withdrawer }"
								color="secondary"
								size="13"
								:style="{minWidth: '50px'}"
								:class="$style.link"
							/>

							<Text v-if="act.data.fee_asset" size="13" weight="500" color="secondary">
								|
							</Text>
						</Flex>

						<Flex v-if="act.data.fee_asset" gap="4" :class="$style.description_el">
							<Text size="13" weight="500" color="secondary">
								Fee ->
							</Text>

							<Text size="13" weight="500" color="secondary">
								{{ getAssetName(act.data.fee_asset) }}
							</Text>
						</Flex>
					</Flex>

					<Flex v-else-if="act.type === 'fee_change'" gap="4" :class="$style.description">
						<Text v-for="k in Object.keys(act.data)" size="13" weight="500" color="secondary">
							{{ `${capitalizeAndReplaceUnderscore(k)} was change to ${act.data[k]}` }}
						</Text>
					</Flex>

					<Flex v-else-if="act.type === 'fee_asset_change'" gap="4">
						<Flex v-if="act.data.addition" gap="4" :class="$style.description">
							<LinkToEntity
								:entity="{ title: midHash(act.data.addition), type: 'account', id: act.data.addition }"
								color="secondary"
								size="13"
								:class="$style.link"
							/>

							<Text size="13" weight="500" color="secondary">was added for fee payments</Text>
						</Flex>

						<Flex v-else="act.data.removal" gap="4" :class="$style.description">
							<LinkToEntity
								:entity="{ title: midHash(act.data.removal), type: 'account', id: act.data.removal }"
								color="secondary"
								size="13"
								:class="$style.link"
							/>

							<Text size="13" weight="500" color="secondary">was removed for fee payments</Text>
						</Flex>
					</Flex>
					
					<Flex v-else>
						<Text size="13" weight="500" color="secondary" :class="$style.description">
							{{ getActionDescription(act) }}
						</Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" color="tertiary">Block</Text>

					<LinkToEntity :entity="{ title: spaces(act.height), type: 'block', id: act.height }" color="secondary" :class="$style.link" />

					<div :class="$style.dot" />

					<Flex v-if="act.fee" align="center" gap="8">
						<Text size="12" color="tertiary">Fee</Text>
						<Text size="12" color="secondary"> {{ spaces(act.fee.amount) }} </Text>
						<Text size="12" color="secondary"> {{ getAssetName(act.fee.asset) }} </Text>

						<div :class="$style.dot" />
					</Flex>

					<Text size="12" color="tertiary"> {{ DateTime.fromISO(act.time).setLocale("en").toFormat("tt, LLL d, y") }} </Text>
					
				</Flex>
			</Flex>

			<Button v-if="txLink" @click.prevent.stop="handleOpenTx(act)" size="mini" type="tertiary" :class="$style.extBtn">
				<Icon name="tx" color="brand" />

				<Text color="brand">View Tx</Text>
			</Button>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
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

	&:first-child {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-top: none;
	}

	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}

	&:hover:has(.extBtn:hover) {
		background: transparent;
	}
}

.description {
	max-width: 700px;
	padding-left: 8px;
	
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.description_el {
	max-width: 100%;

	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.link {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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

	.description {
		width: 600px;
	}
}

@media (max-width: 800px) {
	.wrapper {
		width: 100%;
	}

	.row {
		width: 100%;
	}

	.description {
		width: 400px;
	}
}

@media (max-width: 600px) {
	.wrapper {
		width: 100%;
	}

	.row {
		width: 100%;
	}

	.description {
		width: 180px;
	}
}
</style>
