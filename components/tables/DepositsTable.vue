<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { midHash, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	deposits: {
		type: Array,
	},
})

const handleOpenTx = async (deposit) => {
	const { data } = await fetchTxByHash(deposit.tx_hash)
	if (data.value) {
		sidebarsStore.open("tx", data.value)
	}
}
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex
			v-if="deposits"
			v-for="d in deposits"
			@click="handleOpenTx(d)"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="role" size="16" color="secondary" />

					<Flex v-if="d.bridge?.hash" gap="4">
						<Text size="13" weight="500" color="primary">
							{{ `Wired deposit of ${spaces(d.amount)} ${getAssetName(d.asset)} to` }}
						</Text>

						<LinkToEntity
							:entity="{ title: $getDisplayName('addresses', null, d.bridge), type: 'account', id: d.bridge.hash }"
							color="primary"
							size="13"
							:class="[$style.overflow, $style.address]"
						/>
					</Flex>
					
					<Text v-else size="13" weight="500" color="primary">
						{{ `Received deposit of ${spaces(d.amount)} ${getAssetName(d.asset)}` }}
					</Text>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" color="tertiary">Block</Text>

					<LinkToEntity :entity="{ title: spaces(d.height), type: 'block', id: d.height }" color="secondary" :class="$style.overflow" />

					<div :class="$style.dot" />

					<Text size="12" color="tertiary"> {{ DateTime.fromISO(d.time).setLocale("en").toFormat("tt, LLL d, y") }} </Text>
				</Flex>
			</Flex>

			<Tooltip>
				<!-- <Flex align="center" gap="4">
					<Text size="13" weight="600" color="primary"> {{ spaces(rollup.actions_count) }} </Text>
					
					<Icon name="action" size="13" color="tertiary" />
				</Flex>

				<template #content>
					<Text size="12" color="tertiary">Actions count</Text>
				</template> -->
			</Tooltip>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
}

.row {
	height: 60px;

	border-top: 1px solid var(--op-5);

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	overflow: hidden;
	white-space: nowrap;

	&:hover {
		background: var(--op-5);
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

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.row_general_list {
	height: 60px;

	border-top: 1px solid var(--op-5);

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}
	
	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

@media (max-width: 480px) {
	.address {
		max-width: calc(110px - (70 * (480px - 100vw) / 90));
	}
}
</style>
