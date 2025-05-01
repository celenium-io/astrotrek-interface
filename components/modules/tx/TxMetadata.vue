<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { formatBytes, space, comma, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

/** UI */
import Button from "@/components/ui/Button.vue"

const props = defineProps({
	tx: {
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
				<CopyButton :text="tx.hash" />
				<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ space(tx.hash) }}</Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Timestamp</Text>

			<Text size="13" weight="600" color="primary" mono :class="$style.value">
				{{ DateTime.fromISO(tx.time).setLocale("en").toFormat("tt, LLL d, y") }}
				<Text color="tertiary"> ({{ DateTime.fromISO(tx.time).toRelative({ locale: "en", style: "short" }) }}) </Text>
			</Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Action Types</Text>

			<Text v-if="tx.action_types.length" size="13" weight="600" color="primary" mono :class="$style.value">
				{{ tx.action_types.join(", ") }}
			</Text>
			<Text v-else size="13" weight="600" color="tertiary" mono :class="$style.value"> No action types </Text>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Total Fee</Text>

			<Flex v-if="tx.fees?.length" align="center" gap="8" :class="$style.value">
				<Flex v-for="fee in tx.fees" align="center" gap="4">
					<Text size="13" weight="600" color="primary"> {{ spaces(fee.amount) }} </Text>
					<Text size="13" weight="600" color="secondary"> {{ getAssetName(fee.asset) }} </Text>
				</Flex>
			</Flex>
			<Text v-else size="13" weight="600" color="tertiary" mono :class="$style.value"> 0 </Text>
		</Flex>

		<NuxtLink :to="`/block/${tx.height}`">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Block Height</Text>

				<Flex align="center" gap="6" :class="$style.value">
					<Text size="13" weight="600" color="primary" mono>{{ spaces(tx.height) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
				
			</Flex>
		</NuxtLink>

		<NuxtLink :to="`/account/${tx.signer.hash}`">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Signer</Text>

				<Flex align="center" gap="8" :class="$style.value">
					<CopyButton :text="tx.signer.hash" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ $getDisplayName('addresses', null, tx.signer, false) }}</Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</Flex>
		</NuxtLink>
		
		<template v-if="showMore">
				<Flex align="center" :class="$style.item">
					<Text size="13" weight="600" color="secondary" :class="$style.key">Signature</Text>

					<Flex align="center" gap="8" :class="$style.value">
						<CopyButton :text="tx.signature" />
						<Text size="13" weight="600" color="primary" mono :class="$style.overflow">{{ space(tx.signature) }}</Text>
					</Flex>
				</Flex>

				<Flex align="center" :class="$style.item">
					<Text size="13" weight="600" color="secondary" :class="$style.key">Nonce</Text>

					<Flex align="center" gap="8" :class="$style.value">
						<CopyButton :text="tx.nonce" />
						<Text size="13" weight="600" color="primary" mono>{{ tx.nonce }}</Text>
					</Flex>
					
				</Flex>
				
				<Flex align="center" :class="$style.item">
					<Text size="13" weight="600" color="secondary" :class="$style.key">Position</Text>

					<Text size="13" weight="600" color="primary" mono>{{ tx.position }}</Text>
				</Flex>
		</template>
	</Flex>

	<Flex @click="showMore = !showMore" align="center" justify="end" gap="4" :class="$style.show_more">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text size="12" weight="600" color="brand">Show {{ showMore ? 'Less' : 'More' }}</Text>
	</Flex>
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
	margin-right: 6px;
	margin-top: -4px;

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
