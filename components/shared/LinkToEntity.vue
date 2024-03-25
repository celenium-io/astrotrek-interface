<script setup>
const props = defineProps({
	entity: {
		type: Object,
		required: true,
	},
	size: {
		type: [Number, String],
		default: 12,
	},
	color: {
		type: String,
		default: "tertiary",
	},
	weight: {
		type: [Number, String],
		default: 500,
	}
})

const router = useRouter()

const handleClick = (event) => {
	let link = `/${props.entity.type}/${props.entity.id}`
	if (event.ctrlKey || event.metaKey) {
		window.open(link, '_blank')
	} else {
		router.push(link)
	}
}

</script>

<template>
	<Flex align="center">
		<Text @click.prevent.stop="handleClick" :size="size" :color="color" :weight="weight" :class="$style.link"> {{ entity.title }} </Text>
	</Flex>
</template>

<style module>
.link:hover {
	color: var(--brand);
    text-decoration: underline;
}
</style>
