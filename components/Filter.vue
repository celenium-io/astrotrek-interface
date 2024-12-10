<script setup>
import Button from "@/components/ui/Button.vue"
import Popover from "@/components/ui/Popover.vue"

const props = defineProps({
	filters: {
		type: Object,
		required: false,
	},
})

const isOpen = ref(false)
const handleOpen = () => {
	isOpen.value = true
}
const handleClose = () => {
	isOpen.value = false
}
</script>

<template>
	<Popover :open="isOpen" @on-close="handleClose" width="200" height="200">
		<Button @click="handleOpen" type="secondary" size="mini">
			<Icon name="filter" size="14" color="tertiary" />
		</Button>


		<template #content>
			<Text color="primary"> Opened.. </Text>
		</template>
	</Popover>
</template>

<style module>
.wrapper {

}

.wrapper_1 {
	animation: skeleton 1s ease infinite;

	&.green {
		background: rgba(10, 219, 111, 30%);
	}

	&.yellow {
		background: rgba(255, 212, 0, 30%);
	}

	&.red {
		background: var(--red);
	}

	&.gray {
		background: var(--op-10);
	}
}

@keyframes skeleton {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
}
</style>
