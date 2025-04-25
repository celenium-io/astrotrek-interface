<script setup>
/** Services */
import { getNativeAsset, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

const props = defineProps({
	account: {
		type: Object,
	},
})

const nativeAsset = ref(getNativeAsset())
const balances = computed(() => {
	let res = []

	if (props.account?.balances.length > 1) {
		res = props.account?.balances.filter((el) => +el.value !== 0)
		if (res.length === 0) {
			res = props.account?.balances.slice(0, 1)
		}

		res.forEach((b) => (b.currency = getAssetName(b.currency)))
	} else {
		res = props.account?.balances
		if (nativeAsset.value !== res[0].currency && +res[0].value === 0) {
			res[0].currency = getAssetName(nativeAsset)
		} else {
			res[0].currency = getAssetName(res[0].currency)
		}
	}

	return res
})
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

		<Flex v-if="balances.length < 2" align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Balance</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<CopyButton :text="balances[0].value" />

				<Text size="13" weight="600" color="primary" mono> {{ spaces(balances[0].value) }} </Text>

				<Text size="13" weight="600" color="secondary" mono>
					{{ balances[0].currency }}
				</Text>
			</Flex>
		</Flex>

		<Flex v-else align="start" :class="$style.item" :style="{ padding: '6px 12px' }">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Balance</Text>

			<Flex direction="column" gap="14" :class="$style.value">
				<Flex v-for="b in balances" align="center" gap="8">
					<CopyButton :text="b.value" />

					<Text size="13" weight="600" color="primary" mono> {{ spaces(b.value) }} </Text>

					<Text size="13" weight="600" color="secondary" mono> {{ b.currency }} </Text>
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

		<NuxtLink :to="`/block/${account.first_height}`" :class="[$style.item, $style.link]">
			<Flex align="center">
				<Text size="13" weight="600" color="secondary" :class="$style.key">First Height</Text>

				<Flex align="center" gap="4" :class="$style.value">
					<Text size="13" weight="600" color="primary" mono>{{ spaces(account.first_height) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</Flex>
		</NuxtLink>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Nonce</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.nonce }} </Text>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--op-10);
	background: var(--op-3);
}

.item {
	min-height: 36px;

	border-bottom: 1px solid var(--op-10);

	padding: 0 12px;

	&.link {
		display: flex;
		align-items: center;

		transition: all 0.2s ease;

		&:hover {
			background: var(--op-5);
		}
	}

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
