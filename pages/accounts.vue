<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

definePageMeta({
	layout: "default",
})

useHead({
	title: "Accounts - Astria Explorer",
	link: [
		{
			rel: "canonical",
			href: "https://astrotrek.io/",
		},
	],
	meta: [
		{
			name: "description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:title",
			content: "Accounts - Astria Explorer",
		},
		{
			property: "og:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			property: "og:url",
			content: `https://astrotrek.io/`,
		},
		{
			property: "og:image",
			content: "/img/seo/main.png",
		},
		{
			name: "twitter:title",
			content: "Accounts - Astria Explorer",
		},
		{
			name: "twitter:description",
			content:
				"Astrotrek allows you to explore and search the Astria blockchain for transactions, addresses, blocks, namespaces and blobs.",
		},
		{
			name: "twitter:card",
			content: "summary_large_image",
		},
		{
			name: "twitter:image",
			content: "https://astrotrek.io/img/seo/main.png",
		},
	],
})
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex direction="column" :class="$style.card">
			<Flex justify="between" align="start" wide :class="$style.top">
				<Flex direction="column" gap="20">
					<Text size="16" weight="600" color="primary">Accounts</Text>

					<Flex align="center" gap="12">
						<Button size="mini" type="secondary">Sort by Time</Button>
						<Button size="mini" type="secondary">New Filter</Button>
					</Flex>
				</Flex>

				<Flex align="center" gap="6">
					<Button size="mini" type="secondary">Left</Button>
					<Button size="mini" type="secondary">Page 1</Button>
					<Button size="mini" type="secondary">Right</Button>
				</Flex>
			</Flex>

			<Flex direction="column" :class="$style.rows">
				<Flex v-for="row in 10" justify="between" align="center" :class="$style.row">
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
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	padding: 0 24px;
	margin-top: 60px;
	margin-bottom: 120px;
}

.card {
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

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
