<script setup>
/** API */
import { fetchConstants } from "~/services/api/main.js"

/** Services */
import { capitalize, getNetworkName, isObject } from "@/services/utils"

/** UI */
import Modal from "@/components/ui/Modal.vue"
import Button from "@/components/ui/Button.vue"

/** Store */
import { useAppStore } from "@/store/app"
import { useNotificationsStore } from "@/store/notifications"
const appStore = useAppStore()
const notificationsStore = useNotificationsStore()

const emit = defineEmits(["onClose"])
const props = defineProps({
	show: Boolean,
})

const lastHead = computed(() => appStore.lastHead)
const rawModules = ref({})

const modules = computed(() => {
	let result = []
	let constants = []

	Object.keys(rawModules.value).forEach(module => {
		Object.keys(rawModules.value[module]).forEach(item => {
			constants.push(
				{
					name: item,
					value: rawModules.value[module][item],
				}
			)
		})

		result.push({
			name: module,
			constants: constants,
		})

		constants = []
	})
	
	return result
})

const handleCopy = (target) => {
	if (isObject(target)) {
		window.navigator.clipboard.writeText(JSON.stringify(target, null, 2))
	} else {
		window.navigator.clipboard.writeText(target)
	}

	notificationsStore.create({
		notification: {
			type: "info",
			icon: "check",
			title: "Successfully copied to clipboard",
			autoDestroy: true,
		},
	})
}

watch(
	() => props.show,
	() => {
		nextTick(() => {
			if (!props.show) return
		})
	},
)

onMounted(async () => {
	const data = await fetchConstants()
	rawModules.value = data.module
})
</script>

<template>
	<Modal :show="show" @onClose="emit('onClose')" width="600" disable-trap>
		<Flex direction="column" gap="16">
			<Text size="16" weight="600" color="primary">Astria Constants</Text>

			<div :class="$style.divider" />

			<Flex direction="column" gap="20" :class="$style.modules">
				<Flex v-for="m in modules" align="center" direction="column" gap="14" :class="$style.module">
					<Flex align="center" justify="start" wide>
						<Text size="14" weight="600" color="tertiary"> {{ capitalize(m.name) }} </Text>
					</Flex>

					<Flex v-for="c in m.constants" align="center" justify="between" wide :class="$style.constant">
						<Text @click="handleCopy(c.name)" size="12" color="secondary"> {{ c.name }} </Text>
						<Text @click="handleCopy(c.value)" size="12" color="secondary"> {{ c.value }} </Text>
					</Flex>
				</Flex>
			</Flex>

			<Flex align="center" justify="between" wide :style="{ padding: '0 8px' }" :class="$style.constant">
				<Flex align="center" gap="4">
					<Text @click="handleCopy(getNetworkName())" size="12" color="tertiary"> {{ getNetworkName() }} </Text>
					<Text @click="handleCopy(lastHead.chain_id)" size="12" color="tertiary"> {{ `(${lastHead.chain_id})` }} </Text>
				</Flex>

				<Text @click="handleCopy(rawModules)" size="12" color="tertiary" :style="{ cursor: 'pointer' }"> Copy all constants </Text>
			</Flex>
		</Flex>
	</Modal>
</template>

<style module>
.modules {
	max-height: 800px;
	overflow: auto;
	overscroll-behavior: contain;
}

.module {
	padding: 12px;
	background-color: var(--op-2);
	border-radius: 6px;

	border: 1px solid var(--op-5);
}

.divider {
	width: 100%;
	height: 1px;

	background: var(--op-10);
}

.constant {
	& * {
		cursor: copy;

		&:active {
			color: var(--txt-primary);
		}
	}
}

.copy_constants {
	cursor: pointer;
}

@media (max-height: 900px) {
	.modules {
		max-height: 600px;
	}
}

@media (max-height: 750px) {
	.modules {
		max-height: 400px;
	}
}
</style>
