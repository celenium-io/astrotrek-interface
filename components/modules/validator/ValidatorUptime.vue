<script setup>
/** API */
import { fetchBlockByHeight } from "~/services/api/block"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	blocks: {
		type: Array,
	},
	openSidebar: {
		type: Boolean,
		default: false,
	}
})

const router = useRouter()

const handleClick = async (height) => {
	if (!props.openSidebar) {
		router.push(`/block/${height}`)
	} else {
		const { data } = await fetchBlockByHeight(height)
		if (data.value) {
			sidebarsStore.open('block', data.value)
		}
	}
}
</script>

<template>
	<Flex :class="$style.uptime_wrapper">
		<Tooltip v-for="b in blocks">
			<Flex
				@click.prevent.stop="handleClick(b.height)"
				:class="$style.uptime"
				:style="{
					background: b.signed ? 'var(--green)' : 'red',
				}"
			/>

			<template #content>
				<Flex direction="column" gap="4">
					<Text color="primary">{{ b.height }}</Text>
					<Text color="secondary">{{ b.signed ? 'Signed' : 'Missed' }}</Text>
				</Flex>
			</template>
		</Tooltip>
	</Flex>
</template>

<style module>
/* .wrapper {
	position: relative;
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
} */

.uptime_wrapper {
	/* max-width: 384px; */
	flex-wrap: wrap;
}

.uptime {
	width: 0.6rem;
	height: 0.6rem;

	border-radius: 2px;
	cursor: pointer;
	opacity: 0.8;

	margin-right: 0.35rem;
	margin-bottom: 0.35rem;
}

</style>
