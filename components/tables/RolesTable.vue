<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { capitalize, formatBytes, midHash, spaces } from "@/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	roles: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex
			v-if="roles"
			v-for="role in roles"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8" :style="{width: '100%'}">
				<Flex align="center" gap="6" :class="$style.description">
					<Icon name="role" size="16" color="secondary" />

					<Text size="12" weight="500" color="primary">Account</Text>

					<LinkToEntity :entity="{ title: midHash(role.account), type: 'account', id: role.account}" color="primary" />

					<Text size="12" weight="500" color="primary">{{ `has ${capitalize(role.role)} role of` }}</Text>

					<LinkToEntity :entity="{ title: midHash(role.bridge), type: 'account', id: role.bridge}" color="primary" />
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="tertiary">Rollup&nbsp;</Text>

					<LinkToEntity :entity="{ title: midHash(role.rollup), type: 'rollup', id: getRollupHashSafeURL(role.rollup)}" color="secondary" />
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

.description {
	width: 100%;

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
</style>
