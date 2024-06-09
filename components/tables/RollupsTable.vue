<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { formatBytes, spaces } from "@/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	rollups: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
	generalRollupsList: {
		type: Boolean,
		default: false,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<ClientOnly>
			<Transition name="fade">
				<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
					<Spinner size="16" />

					<Flex direction="column" align="center" gap="8">
						<Text size="14" weight="500" color="primary">Fetching rollups...</Text>
						<Text size="13" weight="500" color="tertiary">It's almost done</Text>
					</Flex>
				</Flex>
			</Transition>
		</ClientOnly>

		<Flex
			v-if="rollups"
			v-for="rollup in rollups"
			@click="sidebarsStore.open('rollup', rollup)"
			justify="between"
			align="center"
			:class="[!generalRollupsList && $style.row, generalRollupsList && $style.row_general_list, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="rollup" size="16" color="secondary" />

					<LinkToEntity :entity="{ title: rollup.hash, type: 'rollup', id: getRollupHashSafeURL(rollup.hash)}" color="primary" />
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="secondary">
						<Text color="tertiary">Size</Text>
						{{ formatBytes(rollup.size) }}
					</Text>

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">First Height&nbsp;</Text>

					<LinkToEntity :entity="{ title: spaces(rollup.first_height), type: 'block', id: rollup.first_height}" color="secondary" />
				</Flex>
			</Flex>

			<Tooltip>
				<Flex align="center" gap="4">
					<Text size="13" weight="600" color="primary"> {{ spaces(rollup.actions_count) }} </Text>
					
					<Icon name="action" size="13" color="tertiary" />
				</Flex>

				<template #content>
					<Text size="12" color="tertiary">Actions count</Text>
				</template>
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
