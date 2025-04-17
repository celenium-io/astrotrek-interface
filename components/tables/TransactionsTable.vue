<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue";

/** UI */
import ActionsRow from "@/components/shared/ActionsRow.vue"

/** Services */
import { midHash, spaces, splitAddress } from "@/services/utils"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	txs: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
	recentTxs: {
		type: Boolean,
		default: false,
	},
	generalTxsList: {
		type: Boolean,
		default: false,
	},
})
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<ClientOnly>
			<Transition name="fade">
				<Flex v-if="isLoading" direction="column" align="center" justify="center" gap="16" :class="$style.loading" wide>
					<Spinner size="16" />

					<Flex direction="column" align="center" gap="8">
						<Text size="14" weight="500" color="primary">Fetching transactions...</Text>
						<Text size="13" weight="500" color="tertiary">It's almost done</Text>
					</Flex>
				</Flex>
			</Transition>
		</ClientOnly>

		<Flex
			v-if="txs"
			v-for="t in txs"
			@click="sidebarsStore.open('tx', t)"
			justify="between"
			align="center"
			:class="[!recentTxs && !generalTxsList && $style.row, recentTxs && $style.row_recent_txs, generalTxsList && $style.row_general_list, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="tx-circle" size="16" :color="t.status === 'success' ? 'light-green' : 'red'" />

					<Flex align="center" gap="8">
						<LinkToEntity :entity="{ title: midHash(t.hash), type: 'tx', id: t.hash}" size="13" color="primary" weight="600" />

						<ActionsRow :actions="t.action_types" />
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="tertiary">Block</Text>

					<LinkToEntity :entity="{ title: spaces(t.height), type: 'block', id: t.height}" color="secondary" />

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">Signer</Text>

					<LinkToEntity :entity="{ title: splitAddress(t.signer, 4), type: 'account', id: t.signer}" color="secondary" />

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">Actions</Text>
					<Text size="12" weight="500" color="secondary"> {{ t.actions_count }} </Text>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="8" :class="$style.hide_mobile">
				<Text size="12" weight="500" color="tertiary">
					{{ DateTime.fromISO(t.time).toRelative({ locale: "en", style: "short" }) }}
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
	flex: 1;
	border-top: 1px solid var(--op-5);
	padding: 24px;
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

@media (max-width: 450px) {
	.hide_mobile {
		display: none;
	}
}
</style>
