<script setup>
/** UI */
import Button from "~/components/ui/Button.vue"

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
		default: 16,
	},
})

cacheStore.current[props.name] = props.entity

const handleViewRawData = () => {
	cacheStore.current._target = props.name
	modalsStore.open("rawData")
}
</script>

<template>
	<Button @click="handleViewRawData" type="secondary" size="mini">
		<Icon name="code-brackets" :size="size" color="brand" />
		View Raw JSON
	</Button>
</template>
