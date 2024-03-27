<template>
	<Flex gap="8" :class="$style.wrapper">
		<Flex direction="column" gap="8">
			<NuxtLink to="/blocks">
				<Flex gap="12" :class="$style.item">
					<Icon name="block" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Blocks</Text>
						<Text size="13" weight="500" color="tertiary">Data blocks on the blockchain</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink to="/rollups">
				<Flex gap="12" :class="$style.item">
					<Icon name="rollup" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Rollups</Text>
						<Text size="13" weight="500" color="tertiary">Rollup's namespaces</Text>
					</Flex>
				</Flex>
			</NuxtLink>
		</Flex>

		<!-- <Flex direction="column" gap="8">
			<NuxtLink to="/accounts">
				<Flex gap="12" :class="$style.item">
					<Icon name="account" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Accounts</Text>
						<Text size="13" weight="500" color="tertiary">Very nice description</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink to="/validators">
				<Flex gap="12" :class="$style.item">
					<Icon name="validator" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Validators</Text>
						<Text size="13" weight="500" color="tertiary">Very nice description</Text>
					</Flex>
				</Flex>
			</NuxtLink>
		</Flex> -->

		<NuxtLink to="/txs">
			<Flex gap="12" :class="$style.item">
				<Icon name="tx" color="primary" size="20" :class="$style.item_icon" />

				<Flex direction="column" gap="6">
					<Text size="14" weight="600" color="primary">Transactions</Text>
					<Text size="13" weight="500" color="tertiary">Transactions that change state</Text>
				</Flex>
			</Flex>
		</NuxtLink>
	</Flex>
</template>

<style module>
.wrapper {
	position: absolute;
	top: 54px;
	z-index: 100;

	background: var(--card-background);
	border-radius: 8px;
	box-shadow: rgb(0 0 0 / 40%) 0px 2px 20px;
	border: 1px solid var(--op-5);

	padding: 8px;
}

.item {
	height: fit-content;

	cursor: pointer;
	border-radius: 8px;

	padding: 8px 24px 8px 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}
}

.item_icon {
	box-sizing: content-box;

	border-radius: 8px;
	background: var(--op-5);
	border: 1px solid var(--op-20);

	padding: 5px;
}

@media (max-width: 900px) {
	.wrapper {
		width: calc(100% - 48px);

		left: 50%;
		transform: translateX(-50%);
	}
}

@media (max-width: 600px) {
	.wrapper {
		flex-direction: column;
	}
}
</style>
