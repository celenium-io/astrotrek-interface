<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { getRollupHashSafeURL } from "~/services/utils/rollups"
import { space, spaces } from "@/services/utils"

/** UI */
import Button from "@/components/ui/Button.vue"
import { capitalize } from "vue"

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
			<Text size="13" weight="600" color="secondary" :class="$style.key">Rollup</Text>
			
			<NuxtLink :to="`/rollup/${getRollupHashSafeURL(account.bridge.rollup)}`" :class="$style.value">
				<Flex align="center" gap="4">
					<CopyButton :text="account.bridge.rollup" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ account.bridge.rollup }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Admin</Text>
			
			<NuxtLink :to="`/account/${account.bridge.sudo.hash}`" :class="$style.value">
				<Flex align="center" gap="4">
					<CopyButton :text="account.bridge.sudo.hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ $getDisplayName('addresses', null, account.bridge.sudo, false) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Withdrawer</Text>
			
			<NuxtLink :to="`/account/${account.bridge.withdrawer.hash}`" :class="$style.value">
				<Flex align="center" gap="4">
					<CopyButton :text="account.bridge.withdrawer.hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ $getDisplayName('addresses', null, account.bridge.withdrawer, false) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Asset</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.bridge.asset.toUpperCase() }} </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Fee Asset</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ account.bridge.fee_asset.toUpperCase() }} </Text>
		</Flex>
	</Flex>
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

.disable {
	cursor: default;
	pointer-events: none;
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
