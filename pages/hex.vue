<script setup>
/** Vendor */
import { Buffer } from "buffer"

/** Components: Hex Viewer */
import HexViewer from "@/components/modules/hex/HexViewer.vue"
import DataInspector from "@/components/modules/hex/DataInspector.vue"

/** Store */
import { useCacheStore } from "@/store/cache"
const cacheStore = useCacheStore()

const router = useRouter()

useSeoMeta({
	title: "Astrotrek Hex Viewer",
})

const data = computed(() => cacheStore.current.action?.data.data)
if (!data.value) router.push("/")

const hex = ref([])
const size = ref(0)
const bytes = computed(() => {
	return hex.value.flat()
})

/** Selected byte (1) */
const cursor = ref(0)
const handleSelectCursor = (target) => {
	if (target < 0 || target > bytes.value.length) return
	cursor.value = target
}
/** Range of selected bytes */
const range = reactive({ start: 0, end: 0 })
const handleBytesSelect = (selection) => {
	const [start, end] = selection

	if (start !== undefined) {
		range.start = start
	}
	if (end !== undefined) {
		range.end = end
	}
}

onMounted(() => {
	if (!data.value) return

	const buffer = Buffer.from(data.value, "base64")
	size.value = Buffer.byteLength(buffer)

	hex.value = buffer
		.toString("hex")
		.match(/../g)
		.reduce((acc, current, idx) => {
			const chunkIdx = Math.floor(idx / 16)
			acc[chunkIdx] = acc[chunkIdx] || []
			acc[chunkIdx].push(current)
			return acc
		}, [])
})
</script>

<template>
	<Flex wide :class="$style.wrapper">
		<ClientOnly>
			<HexViewer :hex :bytes :cursor :range :size @onSelect="handleBytesSelect" @onCursorSelect="handleSelectCursor" />
			<DataInspector :bytes="bytes" :range="range" :cursor="cursor" />
		</ClientOnly>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: calc(var(--base-width) + 48px);

	margin-top: 24px;
	margin-bottom: 120px;
	padding: 0 24px;
}
</style>
