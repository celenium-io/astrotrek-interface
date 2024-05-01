<script setup>
/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"
import Tooltip from "@/components/ui/Tooltip.vue";

/** Services */
import { midHash, spaces } from "@/services/utils"

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

const totalPower = computed(() => {
	let res = 0

	if (props.validators) {
		props.validators.forEach(v => {
			res += parseFloat(v.power)
		})
	}

	return res
})

const getSharePower = (validator) => {
	let share = 0
	if (totalPower.value && validator.power) {
		share = parseInt(parseFloat(validator.power) / totalPower.value * 100)
	}

	return share
}
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
			v-for="v in validators"
			@click="sidebarsStore.open('validator', v)"
			justify="between"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="validator" size="16" color="secondary" />

					<LinkToEntity :entity="{ title: midHash(v.address), type: 'validator', id: v.id}" color="primary" />
				</Flex>

				<Text size="12" weight="500" color="secondary">
					<Text color="tertiary">Name</Text>
					{{ v.name }}
				</Text>
			</Flex>

			<Tooltip>
				<Flex direction="column" align="end" gap="12">
					<Text size="13" weight="600" color="primary"> {{ v.power }} </Text>

					<Flex :class="$style.power_wrapper">
						<div
							:style="{
								width: `${getSharePower(v)}%`,
								background: 'var(--brand)',
							}"
						/>
					</Flex>
				</Flex>

				<template #content>
					<Flex direction="column" gap="8" :style="{width: '150px'}">
						<Flex align="center" justify="between">
							<Text size="12" weight="500" color="tertiary"> Voting Power </Text>

							<Text size="13" weight="600" color="primary"> {{ v.power }} </Text>
						</Flex>

						<Flex align="center" justify="between">
							<Text size="12" weight="500" color="tertiary">Total Power</Text>

							<Text size="13" weight="600" color="primary"> {{ totalPower }} </Text>
						</Flex>

						<Flex align="center" justify="between">
							<Text size="12" weight="500" color="tertiary">Validator Share</Text>

							<Text size="13" weight="600" color="primary"> {{ getSharePower(v) }}% </Text>
						</Flex>
					</Flex>
				</template>
			</Tooltip>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
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

	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		border-bottom: 1px solid var(--op-5);
	}

	&:active {
		background: var(--op-10);
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

.power_wrapper {
	width: 40px;
	height: 4px;

	border-radius: 50px;
	background: var(--op-10);
	overflow: hidden;

	& div {
		height: 4px;
	}
}

</style>
