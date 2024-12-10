<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue";

/** Services */
import { midHash, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	fees: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
})

const handleOpenTransaction = async (tx_hash) => {
	if (!tx_hash) return

	const { data } = await fetchTxByHash(tx_hash)
	if (data.value) {
		sidebarsStore.open("tx", data.value)
	}
}
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<ClientOnly>
			<Transition name="fade">
				<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
					<Spinner size="16" />

					<Flex direction="column" align="center" gap="8">
						<Text size="14" weight="500" color="primary">Fetching fees...</Text>
						<Text size="13" weight="500" color="tertiary">It's almost done</Text>
					</Flex>
				</Flex>
			</Transition>
		</ClientOnly>

		<Flex
			v-if="fees"
			v-for="fee in fees"
			@click="handleOpenTransaction(fee.tx_hash)"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="coin" size="13" color="tertiary" />
					<!-- The transaction paid a $100 fee -->
					<Flex align="center" gap="4">
						<LinkToEntity :entity="{ title: midHash(fee.tx_hash), type: 'tx', id: fee.tx_hash}" size="13" color="primary" weight="600" />

						<Text size="13" color="secondary">paid</Text>

						<Text size="13" color="primary">
							{{ `${spaces(fee.amount)} ${getAssetName(fee.asset)}` }}
						</Text>

						<Text size="13" color="secondary">fee</Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="tertiary">Block</Text>

					<LinkToEntity :entity="{ title: spaces(fee.height), type: 'block', id: fee.height}" color="secondary" />

					<div :class="$style.dot" />

					<Text size="12" color="tertiary"> {{ DateTime.fromISO(fee.time).setLocale("en").toFormat("tt, LLL d, y") }} </Text>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="8">
				<Text size="12" weight="500" color="tertiary">
					{{ DateTime.fromISO(fee.time).toRelative({ locale: "en", style: "short" }) }}
				</Text>
			</Flex>
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

.row_recent_txs {
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

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
