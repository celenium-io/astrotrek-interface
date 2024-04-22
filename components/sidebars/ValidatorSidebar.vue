<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchValidatorBlocks, fetchValidatorUptime } from "@/services/api/validator.js"

/** Services */
import { midHash, shortHash, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import Sidebar from "@/components/ui/Sidebar.vue"
import BlocksList from "@/components/tables/BlocksList.vue"
import ValidatorUptime from "@/components/modules/validator/ValidatorUptime.vue"

const props = defineProps({
	validator: {
		type: Object,
		requiered: true,
	},
	show: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(["onClose"])

const isLoadingBlocks = ref(false)
const blocks = ref([])
const fetchBlocks = async () => {
	isLoadingBlocks.value = true

	const { data } = await fetchValidatorBlocks({
		id: props.validator.id,
		limit: 6,
		sort: "desc",
	})
	blocks.value = data.value || []

	isLoadingBlocks.value = false
}

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

watch(
	() => props.show,
	() => {
		if (props.show) {
			fetchBlocks()
			fetchUptime()
		} else {
			blocks.value = []
		}
	},
)
</script>

<template>
	<Sidebar :show="show" @onClose="emit('onClose')">
		<Flex direction="column" justify="between" wide gap="16">
			<Flex direction="column" gap="16" :class="$style.content">
				<Flex direction="column" gap="8">
					<Flex align="center" gap="4">
						<Icon name="validator" size="12" color="secondary" />

						<Text size="13" weight="500" color="secondary"> Validator </Text>
					</Flex>

					<Flex align="center" gap="8">
						<Text size="16" weight="600" height="120" color="primary">
							{{ midHash(validator.address) }}
						</Text>

						<CopyButton :text="validator.address" />
					</Flex>
				</Flex>

				<!-- <NuxtLink @click="emit('onClose')" :to="`/block/${account.first_height}`">
					<Flex justify="between" :class="$style.card">
						<Flex direction="column" gap="8">
							<Text size="12" weight="600" color="secondary">First Height</Text>

							<Text size="12" weight="600" color="tertiary">{{ spaces(account.first_height) }}</Text>
						</Flex>

						<Icon name="arrow-narrow-up-right" size="12" color="secondary" />
					</Flex>
				</NuxtLink> -->

				<div :class="$style.divider" />

				<Flex align="center" justify="between">
					<Text size="13" weight="600" color="primary">Validated blocks</Text>
<!-- 
					<Text size="13" weight="600" color="primary">{{ account.signed_tx_count }}</Text> -->
				</Flex>

				<BlocksList v-if="blocks.length" :blocks="blocks.slice(0, 5)" />
				<Text v-else-if="isLoadingBlocks" size="12" weight="500" color="tertiary">Loading blocks...</Text>
				<Text v-else size="12" weight="500" color="tertiary">There is no blocks</Text>
				<Flex v-if="blocks.length > 5" align="center" justify="center">
					<NuxtLink @click="emit('onClose')" :to="`/validator/${validator.id}`">
						<Text size="12" weight="500" color="tertiary" :class="$style.link">View all blocks</Text>
					</NuxtLink>
				</Flex>

				<div :class="$style.divider" />

				<Flex direction="column" gap="16">
					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="primary">Validator uptime</Text>
	
						<Text size="13" weight="600" color="primary">{{ uptime.uptime * 100 }}%</Text>
					</Flex>

					<ValidatorUptime v-if="uptime.blocks?.length" :blocks="uptime.blocks" />
					<Text v-else-if="isLoadingUptime" size="12" weight="500" color="tertiary">Loading validator uptime...</Text>
				</Flex>

				<!-- <Flex direction="column" gap="16"> -->
					<!-- <Text size="12" weight="600" color="primary">Details</Text> -->

					<!-- <Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Balance</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ `${spaces(account.balance.value)} ${account.balance.currency.toUpperCase()}` }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Actions Count</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ account.actions_count }} </Text>
					</Flex>

					<Flex align="center" justify="between">
						<Text size="13" weight="600" color="tertiary">Nonce</Text>

						<Text size="13" weight="600" color="primary" tabular> {{ account.nonce }} </Text>
					</Flex> -->
				<!-- </Flex> -->
			</Flex>

			<Button @click="emit('onClose')" :link="`/validator/${validator.id}`" type="secondary" size="medium">Open Validator</Button>
		</Flex>
	</Sidebar>
</template>

<style module>
.card {
	border-radius: 6px;
	background: var(--op-8);
	cursor: pointer;

	padding: 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}

.content {
	height: 100%;
	overflow-y: auto;
}

.link {
	&:hover {
		color: var(--txt-primary);
	}
}
</style>
