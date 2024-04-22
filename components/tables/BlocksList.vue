<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { spaces } from "@/services/utils"

const props = defineProps({
	blocks: {
		type: Array,
	},
})
</script>

<template>
	<Flex direction="column" gap="6">
		<NuxtLink v-for="b in blocks.slice(0, Math.min(blocks.length, 5))" :to="`/block/${b.height}`" :class="$style.block">
			<Flex justify="between" align="center" wide>
				<Flex align="center" gap="8">
					<Icon name="block" size="12" color="secondary" />

					<Text size="12" weight="600" color="primary">{{ spaces(b.height) }}</Text>
				</Flex>

				<Text size="12" weight="500" color="tertiary">
					{{ DateTime.fromISO(b.time).toRelative({ locale: "en", style: "short" }) }}
				</Text>
			</Flex>
		</NuxtLink>
	</Flex>
</template>

<style module>
.block {
	cursor: pointer;

	padding: 2px 6px;

	transition: all 0.2s ease;

	&:hover * {
		color: var(--brand);
	}

	&:active {
		transform: translateY(1px);
	}
}
</style>
