<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { midHash } from "@/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"
import { getAssetName } from "@/services/utils/actions.js"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	bridges: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex
			v-if="bridges"
			v-for="bridge in bridges"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="bridge" size="16" color="secondary" />

					<Text size="12" weight="500" color="primary">Bridge</Text>

					<LinkToEntity :entity="{ title: midHash(bridge.address), type: 'account', id: bridge.address}" color="primary" />

					<Text size="12" weight="500" color="primary">associated with rollup</Text>

					<LinkToEntity :entity="{ title: midHash(bridge.rollup), type: 'rollup', id: getRollupHashSafeURL(bridge.rollup)}" color="primary" />
				</Flex>

				<Flex align="center" gap="8" :class="$style.sub_title">
					<Text size="12" weight="500" color="tertiary">Sudo</Text>

					<LinkToEntity :entity="{ title: midHash(bridge.sudo), type: 'account', id: bridge.sudo}" color="secondary" />

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">Withdrawer</Text>

					<LinkToEntity :entity="{ title: midHash(bridge.withdrawer), type: 'account', id: bridge.withdrawer}" color="secondary" />

					<div :class="$style.dot" />
					
					<Text size="12" weight="500" color="tertiary">Asset</Text>
					<Text size="12" weight="500" color="secondary"> {{ getAssetName(bridge.asset) }} </Text>

					<div :class="$style.dot" />
					
					<Text size="12" weight="500" color="tertiary">Fee asset</Text>
					<Text size="12" weight="500" color="secondary"> {{ getAssetName(bridge.fee_asset) }} </Text>
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
</style>
