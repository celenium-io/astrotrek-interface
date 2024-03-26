<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Services */
import { spaces } from "@/services/utils"
import { getActionDataLength, getActionDescription, getActionRollupId, getActionTitle } from "@/services/utils/actions.js"

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
							{{ getActionTitle(act) }}
						</Text>
					</Flex>

					<Flex v-if="act.type === 'sequence'" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Pushed ${getActionDataLength(act)} to&nbsp` }}
						</Text>

						<LinkToEntity
							:entity="{ title: getActionRollupId(act), type: 'rollup', id: getActionRollupId(act) }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else-if="act.type === 'init_bridge_account'" :class="$style.description">
						<Text size="13" weight="500" color="secondary">
							{{ `Bridge account was initialized for&nbsp` }}
						</Text>

						<LinkToEntity
							:entity="{ title: getActionRollupId(act), type: 'rollup', id: getActionRollupId(act) }"
							color="secondary"
							size="13"
							:class="$style.link"
						/>
					</Flex>

					<Flex v-else>
						<Text size="13" weight="500" color="secondary" :class="$style.description">
							{{ getActionDescription(act) }}
						</Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="12">
					<Flex gap="4">
						<Text size="12" color="tertiary">Block</Text>

						<LinkToEntity :entity="{ title: spaces(act.height), type: 'block', id: act.height }" :class="$style.link" />
					</Flex>

					<Flex align="center" gap="4">
						<Text size="12" color="tertiary"> {{ DateTime.fromISO(act.time).setLocale("en").toFormat("tt, LLL d, y") }} </Text>
					</Flex>
				</Flex>
			</Flex>

			<Button size="mini" type="tertiary" :class="$style.extBtn">
				<template v-if="txLink">
					<Icon @click.prevent.stop="handleOpenTx(act)" name="tx" color="secondary" />
					View Tx
				</template>
				<template v-else>
					<Icon name="code-brackets" size="14" color="brand" />
					<Text color="brand">View Raw</Text>
				</template>
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
	padding-left: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
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
