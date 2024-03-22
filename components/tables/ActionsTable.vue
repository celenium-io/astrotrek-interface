<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** API */
import { fetchTxByHash } from "~/services/api/tx"

/** Services */
import { spaces } from "@/services/utils";
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
					<Icon name="action" size="13" color="tertiary" />

					<Flex align="center" gap="8">
						<Text size="13" weight="600" color="primary">
							{{ getTitle(act) }}
						</Text>
					</Flex>

					<Text size="13" weight="500" color="secondary" :class="$style.description">
						{{ getDescription(act) }}
					</Text>
				</Flex>

				<Flex align="center" gap="8">
					<Flex gap="4">
						<Text size="12" color="tertiary">Block</Text>

						<Text size="12" color="tertiary"> {{ spaces(act.height) }} </Text>
					</Flex>
					
					<Flex align="center" gap="4">
						<Text size="12" color="tertiary"> {{ DateTime.fromISO(act.time).setLocale("en").toFormat("tt, LLL d, y") }} </Text>
					</Flex>
				</Flex>
			</Flex>

			<Icon v-if="txLink" @click.prevent.stop="handleOpenTx(act)" name="tx" color="brand" :class="$style.extBtn" />
			<Icon v-else name="code-brackets" size="18" color="brand" :class="$style.extBtn" />
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

	&:first-child {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	&:last-child {
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		border-bottom: 1px solid var(--op-5);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.description {
	padding-left: 8px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.extBtn {
	/* background:; */
	background-color: transparent;
	transition: transform 0.2s, box-shadow 0.2s;
}

.extBtn:hover {
	transform: scale(1.3);
	/* box-shadow: 0 0 10px rgba(120, 119, 119, 0.3); */
}

@media (max-width: 800px) {
	.wrapper {
		width: 100%;
	}

	.row {
		width: 100%;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
	}

	.description {
		width: 400px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}

@media (max-width: 800px) {
	.wrapper {
		width: 100%;
	}

	.row {
		width: 100%;
	}

	.description {
		width: 400px;
	}
}

@media (max-width: 600px) {
	.wrapper {
		width: 100%;
	}

	.row {
		width: 100%;
	}

	.description {
		width: 300px;
	}
}

</style>
