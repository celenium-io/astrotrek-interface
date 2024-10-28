<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { getNativeAsset, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	account: {
		type: Object,
	},
})

const showMore = ref(false)
const nativeAsset = ref(getNativeAsset())
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Hash</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="account.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ account.hash }}</Text>
			</Flex>
		</Flex>

		<Flex v-if="account?.balances.length < 2" align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Balance</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="account?.balances[0].value" />

				<Text size="13" weight="600" color="primary" mono> {{ spaces(account?.balances[0].value) }} </Text>

				<Text size="13" weight="600" color="secondary" mono>
					{{
						nativeAsset !== account?.balances[0].currency && account?.balances[0].value === 0
							? getAssetName(account?.balances[0].currency)
							: getAssetName(nativeAsset)
					}}
				</Text>
			</Flex>
			<!-- <Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ `${spaces(account.balances[0].value)} ${account.balances[0].currency.toUpperCase()}` }} </Text> -->
		</Flex>

		<Flex v-else align="start" :class="$style.item" :style="{ padding: '6px 12px' }">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Balance</Text>

			<Flex direction="column" gap="14" :class="$style.value">
				<Flex v-for="b in account?.balances" align="center" gap="8">
					<div v-if="b.value > 0">
						<CopyButton :text="b.value" />

						<Text size="13" weight="600" color="primary" mono> {{ spaces(b.value) }} </Text>

						<Text size="13" weight="600" color="secondary" mono> {{ b.currency.toUpperCase() }} </Text>
					</div>
				</Flex>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Signed Txs Count</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.signed_tx_count }} </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Actions Count</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.actions_count }} </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">First Height</Text>
			
			<NuxtLink :to="`/block/${account.first_height}`">
				<Flex align="center" gap="4" :class="$style.value">
					<Text size="13" weight="600" color="primary" mono>{{ spaces(account.first_height) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Nonce</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.nonce }} </Text>
		</Flex>

		<template v-if="showMore">
			<!-- <Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">App Hash</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="block.app_hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">
						{{ space(block.app_hash) }}
					</Text>
				</Flex>
			</Flex> -->
		</template>
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
	min-height: 36px;

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

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.show_more {
	margin-top: -10px;

	cursor: pointer;
}

@media (max-width: 650px) {
	.item {
		min-height: 54px;

		flex-direction: column;
		align-items: start;
		justify-content: center;
		gap: 8px;

		overflow: hidden;
	}

	.value {
		width: 100%;
	}
}
</style>
