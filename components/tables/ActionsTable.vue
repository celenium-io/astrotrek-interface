<script setup>
/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Services */
import { getDescription, getTitle } from "@/services/utils/actions.js";

/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
import { useSidebarsStore } from "@/store/sidebars"
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	actions: {
		type: Array,
		required: true,
	},
	txLink: {
		type: Boolean,
		default: false,
	}
})

const handleViewRawData = (action) => {
	cacheStore.current.action = action
	cacheStore.current._target = "action"
	modalsStore.open("rawData")
}

const handleOpenTx = async (action) => {
	const { data } = await fetchTxByHash(action.tx_hash)
	if (data.value) {
		sidebarsStore.open('tx', data.value)
	} else {
		// Add notification
	}
}

</script>

<template>
	<Flex direction="column" wide :class="$style.wrapper">
		<Flex
			v-for="act in actions"
			@click="handleViewRawData(act)"
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

			<Icon v-if="txLink" @click.prevent.stop="handleOpenTx(act)" name="tx" color="brand" />
			<Icon v-else name="code-brackets" size="18" color="brand" />
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
