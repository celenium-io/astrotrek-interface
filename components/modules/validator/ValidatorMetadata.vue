<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchValidators } from "@/services/api/validator"
import { fetchValidatorUptime } from "@/services/api/validator.js"

/** Services */
import { space, spaces } from "@/services/utils"

/** UI */
import ValidatorUptime from "@/components/modules/validator/ValidatorUptime.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import { capitalize } from "vue";

const props = defineProps({
	validator: {
		type: Object,
	},
})

const isLoadingUptime = ref(false)
const uptime = ref([])
const fetchUptime = async () => {
	isLoadingUptime.value = true

	const { data } = await fetchValidatorUptime({
		id: props.validator.id,
		limit: 100,
	})
	uptime.value = data.value || []

	if (uptime.value?.blocks?.length) {
		uptime.value.blocks = uptime.value.blocks.sort((a, b) => a.height - b.height)
	}

	isLoadingUptime.value = false
}

const totalPower = ref(props.validator.power)
const validatorShare = computed(() => parseInt(parseFloat(props.validator.power) / totalPower.value * 100))
const getValidators = async () => {
	const { data } = await fetchValidators({
		limit: 100,
	})
	if (data.value) {
		totalPower.value = 0
		data.value.forEach(v => {
			totalPower.value += parseFloat(v.power)
		})
	}
}

// const showMore = ref(false)

getValidators()
fetchUptime()
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex v-if="validator.name" align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Name</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="validator.name" />
				<Text size="13" weight="600" color="primary" mono>{{ validator.name }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Address</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="validator.address" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ validator.address }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Voting Power</Text>

			
			<Flex align="center" gap="8" :class="$style.value">
				<Tooltip>
					<Flex align="center" gap="6">
						<Text size="13" weight="600" color="primary" mono>{{ validator.power }}</Text>

						<Text size="13" weight="500" color="tertiary" mono>({{ validatorShare }}%)</Text>
					</Flex>

					<template #content>
						<Flex direction="column" gap="8" :style="{width: '150px'}">
							<Flex align="center" justify="between">
								<Text size="12" weight="500" color="tertiary"> Validator Power </Text>

								<Text size="13" weight="600" color="primary"> {{ validator.power }} </Text>
							</Flex>

							<Flex align="center" justify="between">
								<Text size="12" weight="500" color="tertiary">Total Power</Text>

								<Text size="13" weight="600" color="primary"> {{ totalPower }} </Text>
							</Flex>

							<Flex align="center" justify="between">
								<Text size="12" weight="500" color="tertiary">Validator Share</Text>

								<Text size="13" weight="600" color="primary"> {{ validatorShare }}% </Text>
							</Flex>
						</Flex>
					</template>
				</Tooltip>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Uptime</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<Text size="13" weight="600" color="primary" mono>{{ uptime.uptime * 100 }}%</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.uptime">
			<Text size="13" weight="600" color="secondary" :class="$style.key"></Text>

			<Flex align="center" gap="8" :class="$style.value">
				<ValidatorUptime v-if="uptime.blocks?.length" :blocks="uptime.blocks" openSidebar />
			</Flex>
		</Flex>

		<!-- <Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Nonce</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.nonce }} </Text>
		</Flex> -->
		
		<!-- <template v-if="showMore">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">App Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.app_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.app_hash) }}
					</Text>
				</Flex>
			</Flex>
		</template> -->
	</Flex>

	<!-- <Flex @click="showMore = !showMore" align="center" justify="end" gap="4" :class="$style.show_more">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text size="12" weight="600" color="brand">Show {{ showMore ? 'Less' : 'More' }}</Text>
	</Flex> -->
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}

.item {
	height: 36px;

	padding: 0 12px;

	&:last-child {
		border-bottom: none;
	}
}

.key {
	min-width: 300px;
}

.value {
	min-width: 0;
}

.uptime {
	height: 52px;

	padding: 0 12px 4px 12px;
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.show_more {
	margin-top: -10px;

	cursor: pointer;
}

@media (max-width: 900px) {
	.uptime {
		margin: 12px 0 12px 0;
	}
}

@media (max-width: 650px) {
	.item {
		height: 54px;

		flex-direction: column;
		align-items: start;
		justify-content: center;
		gap: 8px;

		overflow: hidden;
	}

	.value {
		width: 100%;
	}

	.uptime {
		height: 72px;

		flex-direction: column;
		align-items: start;
		justify-content: center;

		margin: 8px 0 8px 0;
	}

}

@media (max-width: 400px) {
	.uptime {
		height: 90px;

		margin: 4px 0 4px 0;
	}
}
</style>
