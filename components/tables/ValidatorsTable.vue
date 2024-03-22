<script setup>
/** Services */
import { shortHash, comma } from "@/services/utils"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	validators: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<ClientOnly>
			<Transition name="fade">
				<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
					<Spinner size="16" />

					<Flex direction="column" align="center" gap="8">
						<Text size="14" weight="500" color="primary">Fetching validators...</Text>
						<Text size="13" weight="500" color="tertiary">It's almost done</Text>
					</Flex>
				</Flex>
			</Transition>
		</ClientOnly>

		<Flex
			v-if="validators"
			v-for="validator in validators"
			@click="sidebarsStore.open('block', b)"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="validator" size="16" color="secondary" />

					<Text size="13" weight="600" color="primary"> {{ shortHash(validator.address) }} </Text>
				</Flex>

				<Text size="12" weight="500" color="secondary">
					<Text color="tertiary">Name</Text>
					{{ validator.name }}
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	min-height: 900px;
	position: relative;

	margin-top: 20px;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-50%) translateX(-50%);
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

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>