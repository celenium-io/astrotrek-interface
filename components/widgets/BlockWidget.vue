<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"
</script>

<template>
	<Flex direction="column" gap="20" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Flex direction="column" gap="10">
				<Text size="16" weight="600" color="primary"> Block <Text color="secondary">922,523</Text> </Text>

				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary"> 234 txs </Text>

					<div :class="$style.dot" />

					<Text size="14" weight="500" color="tertiary"> 953 bytes </Text>
				</Flex>
			</Flex>

			<Flex direction="column" gap="12">
				<Flex align="end" gap="4" :class="$style.chart">
					<ClientOnly>
						<Flex v-for="bar in 40" :class="$style.bar" :style="{ height: `${Math.floor(Math.random() * 30)}px` }" />
					</ClientOnly>
				</Flex>

				<Flex align="center" justify="between">
					<Flex align="center" gap="4">
						<Icon name="pause" size="12" color="tertiary" />
						<Text size="12" weight="500" color="support">Receiving new blocks</Text>
					</Flex>

					<Text size="12" weight="500" color="tertiary">~2.8s</Text>
				</Flex>
			</Flex>
		</Flex>

		<Button wide size="medium" type="secondary"> View Blocks <Icon name="arrow-circle-right" size="14" color="tertiary" /> </Button>
	</Flex>
</template>

<style module>
.wrapper {
	width: 380px;

	background: var(--card-background);
	border-radius: 12px;

	padding: 16px;
}

.chart {
	height: 32px;
}

.bar {
	width: 4px;

	background: var(--brand);
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
