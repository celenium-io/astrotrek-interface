<script setup>
const emit = defineEmits(["onHide"])
</script>

<template>
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Flex align="center" gap="16">
			<Text size="32" weight="400" color="secondary">Explore</Text>
			<Flex align="center" gap="8">
				<Flex align="center" justify="center" :class="[$style.icon, $style.rollup]">
					<Icon name="rollup" size="28" color="black" />
				</Flex>
				<Text size="32" weight="500" color="primary">Rollups</Text>
			</Flex>
			<Text size="32" weight="400" color="secondary">and</Text>
			<Flex align="center" gap="8">
				<Flex align="center" justify="center" :class="[$style.icon, $style.validator]">
					<Icon name="validator" size="28" color="black" />
				</Flex>
				<Text size="32" weight="500" color="primary">Validators</Text>
			</Flex>
			<Text size="32" weight="400" color="secondary">on the shared sequencer.</Text>
		</Flex>
		<Flex align="center" gap="16">
			<Text size="32" weight="400" color="secondary">Find</Text>
			<Flex align="center" gap="8">
				<Flex align="center" justify="center" :class="[$style.icon, $style.block]">
					<Icon name="block" size="28" color="black" />
				</Flex>
				<Text size="32" weight="500" color="primary">Blocks</Text>
			</Flex>
			<Flex align="center" gap="8">
				<Flex align="center" justify="center" :class="[$style.icon, $style.tx]">
					<Icon name="tx" size="28" color="black" />
				</Flex>
				<Text size="32" weight="500" color="primary">Transactions</Text>
			</Flex>
			<Flex align="center" gap="8">
				<Flex align="center" justify="center" :class="[$style.icon, $style.account]">
					<Icon name="account" size="28" color="black" />
				</Flex>
				<Text size="32" weight="500" color="primary">Accounts</Text>
			</Flex>
			<Text size="32" weight="400" color="secondary">with Astrotrek.</Text>
		</Flex>

		<Flex @click="emit('onHide')" align="center" gap="4" :class="$style.hide_btn">
			<Icon name="close-square" size="12" color="secondary" />
			<Text size="12" weight="600" color="tertiary">Hide this section</Text>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;

	&:hover {
		.hide_btn {
			opacity: 1;
		}
	}
}

.hide_btn {
	position: absolute;
	bottom: -36px;

	opacity: 0;
	cursor: pointer;

	padding: 12px 0;

	transition: all 0.2s ease;

	&:hover {
		& span {
			color: var(--txt-secondary);
		}
	}
}

.icon {
	width: 42px;
	height: 32px;

	border-radius: 12px;

	&.rollup {
		background: var(--brand);
	}

	&.validator {
		background: var(--light-blue);
	}

	&.block {
		background: var(--yellow);
	}

	&.tx {
		background: var(--light-green);
	}

	&.account {
		background: var(--blue);
	}
}
</style>
