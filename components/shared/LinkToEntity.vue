<script setup>
import { getCeleniumLink } from "@/services/constants"

const props = defineProps({
	entity: {
		type: Object,
		required: true,
	},
	mode: {
		type: String,
		default: "row",
	},
	size: {
		type: String,
		default: "12",
	},
	color: {
		type: String,
		default: "tertiary",
	},
	weight: {
		type: String,
		default: "500",
	},
	height: {
		type: String,
		default: "100",
	},
})

const router = useRouter()

const isDisable = computed(() => {
	if (props.entity.type === 'account') {
		return !(props.entity.id.startsWith('astria') || props.entity.id.startsWith('celestia'))
	}

	return false
})

const handleClick = (event) => {
	let link = `/${props.entity.type}/${props.entity.id}`
	if (event.ctrlKey || event.metaKey) {
		window.open(link, '_blank')
	} else {
		if (props.entity.type === 'account') {
			if (props.entity.id.startsWith('astria')) {
				router.push(link)
			} else if (props.entity.id.startsWith('celestia')) {
				link = `${getCeleniumLink()}address/${props.entity.id}`
				window.open(link, '_blank')
			}
		} else {
			router.push(link)
		}
	}
}
</script>

<template>
	<Flex align="center" :class="isDisable && $style.disabled">
		<Text v-if="mode === 'row'" @click.prevent.stop="handleClick" :size="size" :color="color" :weight="weight" :height="height" :class="$style.link"> {{ entity.title }} </Text>
		<Text v-else-if="mode === 'sidebar'" @click="handleClick" :size="size" :color="color" :weight="weight" :height="height" :class="$style.link"> {{ entity.title }} </Text>
	</Flex>
</template>

<style module>
.link {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	cursor: pointer;
}

.link:hover {
	color: var(--brand);
    text-decoration: underline;
}

.disabled {
	pointer-events: none;
	cursor: default;
}
</style>
