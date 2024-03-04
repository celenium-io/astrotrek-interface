<script setup>
/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex justify="between" align="start" wide :class="$style.top">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Recent Blocks</Text>
				<Text size="14" weight="500" color="tertiary">The latest blocks</Text>
			</Flex>

			<Flex align="center" gap="4">
				<Text size="13" weight="600" color="brand">View Blocks</Text>
				<Icon size="14" name="trend-up" color="brand" />
			</Flex>
		</Flex>

		<Flex direction="column" :class="$style.rows">
			<Flex @click="sidebarsStore.open('block')" v-for="row in 5" justify="between" align="center" :class="$style.row">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="8">
						<Icon name="block" size="16" color="secondary" />

						<Text size="13" weight="600" color="primary"> 923,159 </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Miner</Text>
							0xf93b...E4D9
						</Text>

						<div :class="$style.dot" />

						<Text size="12" weight="500" color="secondary">
							1,259
							<Text color="tertiary">bytes</Text>
						</Text>
					</Flex>
				</Flex>

				<Flex direction="column" align="end" gap="8">
					<Flex align="center" gap="4">
						<Icon name="tx-circle" size="12" color="light-green" />
						<Text size="13" weight="600" color="primary"> 23 <Text color="secondary">Txs</Text> </Text>
					</Flex>

					<Text size="12" weight="500" color="tertiary">2s ago</Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" justify="between" :class="$style.bot">
			<Flex align="center" gap="6">
				<Icon name="pause" size="12" color="tertiary" />
				<Text size="12" weight="500" color="support">Receiving new blocks</Text>
			</Flex>

			<Flex align="center" gap="4">
				<Text size="12" weight="600" color="tertiary"> Sort by <Text color="secondary">Time</Text> </Text>
				<Icon name="chevron" size="12" color="secondary" />
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	flex: 1;

	border-radius: 12px;
	background: var(--card-background);

	padding: 16px 0 14px 0;
}

.top {
	padding: 0 16px;
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
	padding: 14px 16px 0 16px;
}
</style>
