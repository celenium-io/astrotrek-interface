<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex justify="between" align="start" wide :class="$style.top">
			<Flex direction="column" gap="8">
				<Text size="16" weight="600" color="primary">Recent Transactions</Text>
				<Text size="14" weight="500" color="tertiary">The latest transactions</Text>
			</Flex>

			<Flex align="center" gap="4">
				<Text size="13" weight="600" color="brand">View Transactions</Text>
				<Icon size="14" name="trend-up" color="brand" />
			</Flex>
		</Flex>

		<Flex direction="column" :class="$style.rows">
			<Flex v-for="row in 5" justify="between" align="center" :class="$style.row">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="8">
						<Icon name="tx-circle" size="16" color="light-green" />

						<Flex align="center" gap="8">
							<Flex align="center" gap="6">
								<Text size="13" weight="600" color="primary">
									<Text color="secondary">0x</Text>
									4d64
								</Text>
								<Flex align="center" gap="4">
									<div v-for="dot in 3" :class="$style.small_dot" />
								</Flex>
								<Text size="13" weight="600" color="primary"> 6f97 </Text>
							</Flex>

							<Text size="13" weight="600" color="tertiary"> Token Minting </Text>
						</Flex>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Contract</Text>
							0xf93b...E4D9
						</Text>

						<div :class="$style.dot" />

						<Text size="12" weight="500" color="secondary">
							<Text color="tertiary">Fee</Text>
							0.04
						</Text>

						<div :class="$style.dot" />

						<Text size="12" weight="500" color="tertiary"> 0x38bd...24B3 -> 0x38bd...24B3 </Text>
					</Flex>
				</Flex>

				<Flex direction="column" align="end" gap="8">
					<Flex align="center" gap="4">
						<Icon name="check-circle" size="12" color="tertiary" />
						<Text size="13" weight="600" color="primary"> 0.05 <Text color="secondary">RIA</Text> </Text>
					</Flex>

					<Text size="12" weight="500" color="tertiary">12 mins ago </Text>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" justify="between" :class="$style.bot">
			<Flex align="center" gap="6">
				<Icon name="pause" size="12" color="tertiary" />
				<Text size="12" weight="500" color="support">Receiving new transactions</Text>
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
	width: 636px;

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
