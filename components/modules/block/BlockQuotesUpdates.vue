<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Components */
import LinkToEntity from "@/components/shared/LinkToEntity.vue"
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LoadingHolder from "~/components/shared/LoadingHolder.vue"

/** UI */
import Button from "@/components/ui/Button.vue"

/** Services */
import { spaces } from "@/services/utils"

const props = defineProps({
	quotesUpdates: {
		type: Array,
	},
	height: {
		type: [String, Number],
	},
	isLoading: {
		type: Boolean,
		default: false,
	}
})

const handleOpenQuotes = () => {
	window.open('/quotes', '_blank')
}
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<LoadingHolder v-if="isLoading" title="Loading quotes updates.." />

		<Flex
			v-if="quotesUpdates?.length"
			v-for="pupd in quotesUpdates"
			align="center"
			justify="between"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="8">
					<Icon name="quotes" size="16" color="tertiary" />

					<Flex align="center" gap="4">
						<Text size="12" color="secondary">Price for</Text>
						<Text size="12" color="primary"> {{ pupd.pair.replace("_", "/") }} </Text>
						<Text size="12" color="secondary">updated to</Text>
						<Text size="12" color="primary"> {{ `$${pupd.value}` }} </Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="tertiary">Block</Text>

					<LinkToEntity :entity="{ title: spaces(height), type: 'block', id: height}" color="secondary" />

					<div :class="$style.dot" />

					<Text size="12" weight="500" color="tertiary">
						{{ DateTime.fromISO(pupd.time).setLocale("en").toFormat("tt, LLL d, y") }}
					</Text>
				</Flex>
			</Flex>

			<Button @click.prevent.stop="handleOpenQuotes" size="mini" type="tertiary" :class="$style.extBtn">
				<Icon name="quotes" color="brand" />

				<Text color="brand">View Quotes</Text>
			</Button>
		</Flex>

		<EmptyHolder v-else-if="!isLoading" title="This block doesn't contain any quotes update" />
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}

.row {
	height: 60px;

	border-top: 1px solid var(--op-5);

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	overflow: hidden;
	white-space: nowrap;

	&:hover {
		background: var(--op-5);
	}
	
	&:first-child {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		border-top: none;
	}

	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}

	&:hover:has(.extBtn:hover) {
		background: transparent;
	}
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>
