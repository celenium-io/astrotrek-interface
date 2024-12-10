<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { comma, formatBytes, abbreviate } from "@/services/utils"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** API */
// import { fetchPriceSeries } from "@/services/api/stats"

/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const head = computed(() => appStore.lastHead)

</script>

<template>
	<Flex tag="section" justify="center" wide :class="$style.wrapper">
		<Flex align="center" justify="center" gap="24" wide :class="$style.container">
			<Flex align="center" gap="20" :class="$style.stats">
				<Tooltip>
					<Flex align="center" gap="6" :class="$style.stat">
						<Icon name="tx" size="12" color="secondary" :class="$style.icon" />
						<Flex align="center" gap="4">
							<Text size="12" weight="500" color="tertiary" noWrap :class="$style.key">Total Txs:</Text>

							<Text v-if="head.total_tx" size="12" weight="600" noWrap :class="$style.value">{{ abbreviate(head.total_tx) }}</Text>
							<Skeleton v-else w="20" h="12" />
						</Flex>
					</Flex>

					<template #content>
						{{ comma(head.total_tx) }}
					</template>
				</Tooltip>

				<div :class="$style.dot" />

				<Tooltip disabled>
					<Flex align="center" gap="6" :class="$style.stat">
						<Icon name="account" size="12" color="secondary" :class="$style.icon" />
						<Flex align="center" gap="4">
							<Text size="12" weight="500" color="tertiary" noWrap :class="$style.key">Total Accounts:</Text>

							<Text v-if="head.total_accounts" size="12" weight="600" noWrap :class="$style.value">
								{{ abbreviate(head.total_accounts) }}
							</Text>
							<Skeleton v-else w="20" h="12" />
						</Flex>
					</Flex>

					<template #content> {{ comma(head.total_accounts) }} </template>
				</Tooltip>

				<div :class="$style.dot" />

				<Tooltip disabled>
					<Flex align="center" gap="6" :class="$style.stat">
						<Icon name="rollup" size="12" color="secondary" :class="$style.icon" />
						<Flex align="center" gap="4">
							<Text size="12" weight="500" color="tertiary" noWrap :class="$style.key">Total Rollups:</Text>

							<Text v-if="head.total_rollups" size="12" weight="600" noWrap :class="$style.value">
								{{ abbreviate(head.total_rollups) }}
							</Text>
							<Skeleton v-else w="20" h="12" />
						</Flex>
					</Flex>

					<template #content> {{ comma(head.total_rollups) }} </template>
				</Tooltip>

				<div :class="$style.dot" />

				<Tooltip disabled>
					<Flex align="center" gap="6" :class="$style.stat">
						<Icon name="bridge" size="12" color="secondary" :class="$style.icon" />
						<Flex align="center" gap="4">
							<Text size="12" weight="500" color="tertiary" noWrap :class="$style.key">Total Bridges:</Text>

							<Text v-if="head.total_bridges" size="12" weight="600" noWrap :class="$style.value">
								{{ abbreviate(head.total_bridges) }}
							</Text>
							<Skeleton v-else w="20" h="12" />
						</Flex>
					</Flex>

					<template #content> {{ comma(head.total_bridges) }} </template>
				</Tooltip>

				<div :class="$style.dot" />

				<Tooltip>
					<Flex align="center" gap="6" :class="$style.stat">
						<Icon name="folder" size="12" color="secondary" :class="$style.icon" />
						<Flex align="center" gap="4">
							<Text size="12" weight="500" color="tertiary" noWrap :class="$style.key">Total Bytes Pushed:</Text>

							<Text v-if="head.total_bytes" size="12" weight="600" noWrap :class="$style.value">
								{{ formatBytes(head.total_bytes) }}
							</Text>
							<Skeleton v-else w="20" h="12" />
						</Flex>
					</Flex>

					<template #content> {{ `${comma(head.total_bytes)} Bytes` }} </template>
				</Tooltip>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	height: 32px;

	border-bottom: 1px solid var(--op-5);

	background: var(--feed-background);
}

.container {
	max-width: var(--base-width);
	height: 100%;

	margin: 0 24px;

	&::-webkit-scrollbar {
		display: none;
	}
}

.dot {
	width: 4px;
	height: 4px;
	background-color: var(--op-10);
	border-radius: 50%;
}

.key,
.value,
.icon {
	transition: all 0.2s ease;
}

.value {
	color: var(--op-40);
}

.stat:hover {
	.icon {
		fill: var(--txt-primary);
	}

	.key {
		color: var(--txt-secondary);
	}

	.value {
		color: var(--txt-secondary);
	}
}

@media (max-width: 900px) {
	.wrapper {
		height: initial;

		padding: 12px 0;
	}

	.container {
		flex-direction: column;
	}

	.stats {
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
	}
}

@media (max-width: 500px) {
	.container {
		margin: 0 12px;
	}
}
</style>
