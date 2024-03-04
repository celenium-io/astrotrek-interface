<template>
	<Flex direction="column" justify="between" :class="$style.wrapper">
		<Flex direction="column" gap="8">
			<Text size="16" weight="600" color="primary"> Rollups Analysis </Text>

			<Text size="14" weight="500" color="tertiary" height="140">
				In the last <Text color="secondary">31</Text> days <Text color="secondary">12</Text> new rollups published
			</Text>
		</Flex>

		<Flex align="center" gap="4" :class="$style.chart">
			<Flex v-for="bar in 24" :class="$style.bar" />
		</Flex>

		<Flex direction="column" gap="8">
			<Text size="28" weight="500" color="primary"> 17,720 </Text>
			<Text size="12" weight="500" color="tertiary">Total Rollups</Text>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 232px;
	height: 196px;

	background: var(--card-background);
	border-radius: 12px;

	padding: 16px;
}

.bar {
	width: 4px;
	height: 16px;

	background: var(--brand);
}

@media (max-width: 1000px) {
	.wrapper {
		max-width: initial;
		width: 100%;
	}
}
</style>
