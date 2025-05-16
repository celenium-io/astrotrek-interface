<script>
import { getNetworkName } from "@/services/utils/general"

const network = computed(() => getNetworkName())
</script>

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

			<NuxtLink to="/assets">
				<Flex gap="12" :class="$style.item">
					<Icon name="coin" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Assets</Text>
						<Text size="13" weight="500" color="tertiary">Astria registered assets</Text>
					</Flex>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex direction="column" gap="8">
			<NuxtLink to="/accounts">
				<Flex gap="12" :class="$style.item">
					<Icon name="account" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Accounts</Text>
						<Text size="13" weight="500" color="tertiary">All blockchain accounts</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink to="/apps">
				<Flex gap="12" :class="$style.item">
					<Icon name="app" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Applications</Text>
						<Text size="13" weight="500" color="tertiary">All Astria applications</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink v-if="network === 'Dusk'" to="/quotes">
				<Flex gap="12" :class="$style.item">
					<Icon name="quotes" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Quotes</Text>
						<Text size="13" weight="500" color="tertiary">On-chain oracle data</Text>
					</Flex>
				</Flex>
			</NuxtLink>
			<NuxtLink v-else to="/stats">
				<Flex gap="12" :class="$style.item">
					<Icon name="bar-chart" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Statistics</Text>
						<Text size="13" weight="500" color="tertiary">Key blockchain metrics</Text>
					</Flex>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex direction="column" gap="8">
			<NuxtLink to="/txs">
				<Flex gap="12" :class="$style.item">
					<Icon name="tx" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Transactions</Text>
						<Text size="13" weight="500" color="tertiary">Transactions that change state</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink to="/validators">
				<Flex gap="12" :class="$style.item">
					<Icon name="validator" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Validators</Text>
						<Text size="13" weight="500" color="tertiary">Validators that produce blocks</Text>
					</Flex>
				</Flex>
			</NuxtLink>

			<NuxtLink v-if="network === 'Dusk'" to="/stats">
				<Flex gap="12" :class="$style.item">
					<Icon name="bar-chart" color="primary" size="20" :class="$style.item_icon" />

					<Flex direction="column" gap="6">
						<Text size="14" weight="600" color="primary">Statistics</Text>
						<Text size="13" weight="500" color="tertiary">Key blockchain metrics</Text>
					</Flex>
				</Flex>
			</NuxtLink>
		</Flex>
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
