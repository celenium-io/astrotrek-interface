<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { formatBytes, hexToBase64, midHash, shortHash, space, spaces } from "@/services/utils"
import { getNamespaceID, getNamespaceLink, getRollupHashSafeURL } from "@/services/utils/rollups"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

const props = defineProps({
	rollup: {
		type: Object,
		required: true,
	},
	show: {
		type: Boolean,
		default: false,
	},
})

const namespaceID = computed(() => getNamespaceID(props.rollup))
const namespaceLink = computed(() => getNamespaceLink(namespaceID))

const emit = defineEmits(["onClose"])
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide gap="16" :class="$style.content">
			<Flex direction="column" gap="16">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Icon name="rollup" size="12" color="secondary" />

						<Text size="13" weight="500" color="secondary"> Rollup </Text>

						<Tooltip v-if="rollup.bridge_count">
							<Icon name="bridge" size="16" color="brand" />

							<template #content>
								Associated with bridge account
							</template>
						</Tooltip>
					</Flex>

					<Flex align="center" gap="8">
						<LinkToEntity
							@click="emit('onClose')"
							:entity="{ title: midHash(rollup.hash), type: 'rollup', id: getRollupHashSafeURL(rollup.hash)}"
							mode="sidebar"
							color="primary"
							size="16"
							weight="600"
							height="120"
						/>

						<CopyButton :text="rollup.hash" />
					</Flex>
				</Flex>

				<NuxtLink @click="emit('onClose')" :to="`/block/${rollup.first_height}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">First Height</Text>
							<Text size="12" weight="600" color="tertiary">{{ spaces(rollup.first_height) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Text size="12" weight="600" color="primary">Details</Text>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Size</Text>

						<Text size="13" weight="600" color="primary"> {{ formatBytes(rollup.size) }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Actions</Text>

						<Text size="13" weight="600" color="primary"> {{ rollup.actions_count }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Tooltip>
							<Text size="13" weight="600" color="tertiary">Namespace</Text>

							<template #content>
								Celestia Namespace ID
							</template>
						</Tooltip>

						<Flex align="center" gap="8">
							<CopyButton :text="namespaceID" />

							<NuxtLink :to="namespaceLink" target="_blank">
								<Flex align="center" gap="4">
									<Text size="13" weight="600" color="primary">{{ space(namespaceID) }}</Text>

									<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
								</Flex>
							</NuxtLink>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Button @click="emit('onClose')" :link="`/rollup/${getRollupHashSafeURL(rollup.hash)}`" type="secondary" size="medium">Open Rollup</Button>
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
