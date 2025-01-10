<script setup>
/** UI */
import BlocksTable from "@/components/tables/BlocksTable.vue"
import Button from "@/components/ui/Button.vue"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const blocks = computed(() => appStore.latestBlocks.slice(0, 5))
const lastHead = computed(() => appStore.lastHead)

const isPauseHovered = ref(false)

const blocksSnapshot = ref([])
const isPaused = ref(false)
const handlePause = () => {
	if (!lastHead?.value.synced) return

	isPaused.value = !isPaused.value
}

watch(
	() => isPaused.value,
	() => {
		if (isPaused.value) {
			blocksSnapshot.value = [...blocks.value]
		} else {
			blocksSnapshot.value = []
		}
	},
)
</script>

<template>
	<Flex direction="column" justify="between" :class="$style.wrapper">
		<Flex justify="between" align="start" wide :class="$style.top">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Recent Blocks</Text>
				<Text size="14" weight="500" color="tertiary">The latest blocks</Text>
			</Flex>

			<NuxtLink to="/blocks">
				<Flex align="center" gap="4">
					<Text size="13" weight="600" color="brand">View Blocks</Text>
					<Icon size="14" name="trend-up" color="brand" />
				</Flex>
			</NuxtLink>
		</Flex>

		<BlocksTable :blocks="!isPaused ? blocks : blocksSnapshot" recentBlocks />

		<Flex align="center" gap="6" :class="$style.bot">
			<Button
				@click="handlePause"
				@mouseenter="isPauseHovered = true"
				@mouseleave="isPauseHovered = false"
				type="tertiary"
				size="mini"
				:disabled="!lastHead?.synced"
			>
				<template v-if="!isPauseHovered">
					<Icon :name="isPaused ? 'pause' : 'modem'" size="12" :color="isPaused ? 'yellow' : 'tertiary'" />
					<Text size="12" weight="500" :color="isPaused ? 'yellow' : 'tertiary'">
						{{ isPaused ? "Receiving new blocks is paused" : "Receiving new blocks" }}
					</Text>
				</template>

				<template v-else-if="isPauseHovered">
					<Icon :name="isPaused ? 'resume' : 'pause'" size="12" color="secondary" />
					<Text size="12" weight="500" color="secondary">
						{{ isPaused ? "Resume receiving new blocks" : "Pause receiving new blocks" }}
					</Text>
				</template>
			</Button>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	flex: 1;

	border-radius: 12px;
	background: var(--card-background);

	padding: 16px 0 8px 0;
}

.top {
	padding: 0 16px;

	margin-bottom: 20px;
}

.rows {
	margin-top: 20px;
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

	&:last-child {
		border-bottom: 1px solid var(--op-5);
	}
}

.small_dot {
	width: 2px;
	height: 2px;

	border-radius: 50%;
	background: var(--txt-secondary);
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

.bot {
	padding: 8px 16px 0 8px;
}
</style>
