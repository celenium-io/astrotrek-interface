<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { formatBytes, midHash, shortHash, space, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"


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

const emit = defineEmits(["onClose"])
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide :class="$style.content">
			<Flex direction="column" gap="16">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Icon name="rollup" size="12" color="secondary" />
						<Text size="13" weight="500" color="secondary"> Rollup </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="16" weight="600" height="120" color="primary">
							{{ midHash(rollup.hash) }}
						</Text>
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
				</Flex>
			</Flex>

			<Button @click="emit('onClose')" :link="`/rollup/${rollup.hash}`" type="secondary" size="medium" :class="$style.fixed-btn">Open Rollup</Button>
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

.fixed-btn {
	height: 32px;
	position: fixed;
	bottom: 0;
}
</style>
