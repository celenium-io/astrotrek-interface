<script setup>
/** Vendor */
import { Buffer } from "buffer"

/** Components: Hex Viewer */
import HexViewer from "@/components/modules/hex/HexViewer.vue"
import DataInspector from "@/components/modules/hex/DataInspector.vue"

/** API */
import { fetchRollupActionByInternalId } from "@/services/api/rollup.js"

/** Store */
import { useCacheStore } from "@/store/cache"
const cacheStore = useCacheStore()

const route = useRoute()
const router = useRouter()

useSeoMeta({
	title: "Astrotrek Hex Viewer",
})

const data = computed(() => cacheStore.current.action?.data.data)
if (!data.value) {
	const { data: action } = await fetchRollupActionByInternalId({ id: route.query.action })
	if (action) cacheStore.current.action = action
}

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

			<Flex direction="column" gap="24" :class="$style.sidebar">
				<DataInspector :bytes="bytes" :range="range" :cursor="cursor" :action="cacheStore.current.action" />
			</Flex>
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

.sidebar {
	margin-left: 16px;
}

@media (max-width: 900px) {
	.wrapper {
		flex-direction: column;
		gap: 32px;
	}

	.sidebar {
		margin: 0;
	}
}

@media (max-width: 500px) {
	.wrapper {
		padding: 0 12px;
	}
}
</style>
