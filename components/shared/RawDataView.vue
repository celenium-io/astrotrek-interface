<script setup>
/** Store */
import { useCacheStore } from "@/store/cache"
import { useModalsStore } from "@/store/modals"
const cacheStore = useCacheStore()
const modalsStore = useModalsStore()

const props = defineProps({
	entity: {
		type: Object,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	size: {
		type: [Number, String],
		default: 18,
	}
})

cacheStore.current[props.name] = props.entity

const handleViewRawData = () => {
	cacheStore.current._target = props.name
	modalsStore.open("rawData")
}

</script>

<template>
	<Flex align="center" justify="center" :class="$style.wrapper">
		<Icon @click="handleViewRawData" name="code-brackets" :size="size" color="brand" />
	</Flex>
</template>

<style module>
.wrapper {
	cursor: pointer;
}

.wrapper:hover {
	transform: scale(1.2);
}

.wrapper:active {
	transform: scale(1.3);
	transition: all 0.2s ease;
}
</style>
