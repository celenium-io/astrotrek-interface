<template>
	<Flex :class="$style.wrapper">
		<Flex direction="column" gap="16" :class="$style.item">
			<Text size="12" weight="600" color="primary">Astria Supply</Text>

			<Flex direction="column" gap="10">
				<Text size="20" weight="600" color="primary"> 1.69M <Text size="16" color="secondary">/ 1.96M</Text> </Text>

				<Text size="12" weight="600" color="tertiary">98% is unlocked</Text>
			</Flex>
		</Flex>
		<Flex direction="column" gap="16" :class="$style.item">
			<Text size="12" weight="600" color="primary">Total Transactions</Text>

			<Flex direction="column" gap="10">
				<Flex align="center" gap="8">
					<Text size="20" weight="600" color="primary">7,230</Text>

					<Flex align="center" gap="6">
						<Icon name="chart-up" size="14" color="light-green" />
						<Text size="14" weight="600" color="light-green"> 7.36% </Text>
					</Flex>
				</Flex>

				<Text size="12" weight="600" color="tertiary">75 txs today</Text>
			</Flex>
		</Flex>
		<Flex direction="column" gap="16" :class="$style.item">
			<Text size="12" weight="600" color="primary">Wallet Addresses</Text>

			<Flex direction="column" gap="10">
				<Flex align="center" gap="8">
					<Text size="20" weight="600" color="primary">14,230</Text>

					<Flex align="center" gap="6">
						<Icon name="chart-up" size="14" color="light-green" />
						<Text size="14" weight="600" color="light-green"> 9.36% </Text>
					</Flex>
				</Flex>

				<Text size="12" weight="600" color="tertiary">255 addresses today</Text>
			</Flex>
		</Flex>
		<Flex direction="column" gap="16" :class="$style.item">
			<Text size="12" weight="600" color="primary">Gas Tracker</Text>

			<Flex direction="column" gap="10">
				<Text size="20" weight="600" color="primary"> 1.71 <Text size="16" color="secondary">RIA</Text> </Text>

				<Text size="12" weight="600" color="tertiary">Avg $0.04</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 12px;
	background: var(--card-background);
}

.item {
	flex: 1;

	border-left: 1px solid var(--op-5);

	padding: 16px 16px 16px 32px;

	&:nth-child(1) {
		border-left: none;

		padding-left: 16px;
	}
}
</style>
