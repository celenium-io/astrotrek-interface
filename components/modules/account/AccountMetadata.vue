<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { space, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	account: {
		type: Object,
	},
})

const showMore = ref(false)
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

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Balance</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ `${spaces(account.balances[0].value)} ${account.balances[0].currency.toUpperCase()}` }} </Text>
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
}
</style>
