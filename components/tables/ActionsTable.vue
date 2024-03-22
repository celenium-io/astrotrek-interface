<script setup>
/** Services */
import { getDescription, getTitle } from "@/services/utils/actions.js";

/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()

const props = defineProps({
	actions: {
		type: Array,
	},
})

const handleViewRawData = () => {
	cacheStore.current._target = "action"
	modalsStore.open("rawData")
}
</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex
			v-for="act in actions"
			@click="handleViewRawData"
			justify="between"
			align="center"
			:class="$style.row"
		>
			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Icon name="action" size="12" color="tertiary" />

					<Flex align="center" gap="8">
						<Text size="13" weight="600" color="primary">
							{{ getTitle(act) }}
						</Text>
					</Flex>
				</Flex>

				<Flex align="center" gap="8">
					<Text size="12" weight="500" color="secondary">
						{{ getDescription(act) }}
					</Text>
				</Flex>
			</Flex>

			<Icon name="code-brackets" size="18" color="brand" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
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

	&:active {
		background: var(--op-10);
	}

	&:last-child {
		border-bottom: 1px solid var(--op-5);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
