<script setup>
/** Vendor */
import { cloneDeep } from "lodash"

/** Components */
import Button from "@/components/ui/Button.vue"
import Checkbox from "@/components/ui/Checkbox.vue"
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import Popover from "@/components/ui/Popover.vue"
import Toggle from "@/components/ui/Toggle.vue"

const props = defineProps({
	filters: {
		type: Array,
		default: [],
	},
	isActive: {
		tyep: Boolean,
		default: false,
	},
	showClear: {
		type: Boolean,
		default: true,
	},
	width: {
		type: [Number, String],
		default: 220,
	},
	height: {
		type: [Number, String],
		default: 300,
	},
})

const emit = defineEmits(["onUpdate"])

const selectedFilters = ref([])

const isOpen = ref(false)
const blockMainPopover = ref(false)

const getDisplayName = (value, index) => {
	if (!props.filters[index].displayName) return value

	if (typeof props.filters[index].displayName === "function") {
		return props.filters[index].displayName(value)
	}

	return props.filters[index].displayName
}

const handleOpen = (filter) => {
	if (filter) {
		blockMainPopover.value = true
		filter.open = true
	} else {
		selectedFilters.value = cloneDeep(props.filters)

		isOpen.value = true
	}
}
const handleClose = (filter) => {
	if (filter) {
		filter.open = false
		blockMainPopover.value = false
	} else {
		selectedFilters.value = []
		isOpen.value = false
	}
}

const handleApply = () => {
	isOpen.value = false

	emit('onUpdate', selectedFilters.value)
}

const handleClear = () => {
	isOpen.value = false

	emit('onUpdate', [])
}
</script>

<template>
	<Popover :open="isOpen" :blockOutside="blockMainPopover" @on-close="handleClose()" :width="width" :height="height" position="start">
		<Button @click="handleOpen()" type="secondary" size="mini" :disabled="!filters.length">
			<Icon name="filter" size="14" :color="isActive ? 'brand' : 'tertiary'" />
		</Button>


		<template #content>
			<Flex align="center" direction="column" justify="between" gap="12" wide>
				<Flex v-if="selectedFilters.length > 1" align="center" direction="column" gap="8" wide>
					<template v-for="(f, index) in selectedFilters" :class="$style.filter">
						<Flex v-if="f.type === 'toggle'" align="center" justify="between" gap="6" wide>
							<Text size="12" color="secondary"> {{ getDisplayName(f.name, index) }} </Text>
							<Toggle v-model="f.value" color="var(--brand)" />
						</Flex>
						
						<Flex v-if="f.type === 'multiselect'" align="center" wide>
							<Popover :open="f.open" @on-close="handleClose(f)" width="200" side="right" :class="$style.multiselect">
								<Flex
									@click="handleOpen(f)"
									align="center"
									justify="between"
									gap="12"
									wide
									:class="$style.multiselect_title"
								>
									<Text size="12" color="secondary"> {{ f.name }} </Text>
									<Icon name="chevron" size="12" color="secondary" />
								</Flex>
								<template #content>
									<Flex direction="column" gap="8" wide :class="$style.multiselect_content">
										<Flex
											v-for="v in Object.keys(f.values)"
											@click="f.values[v] = !f.values[v]"
											align="center"
											justify="between"
											:class="$style.item"
										>
											<Text size="12" :color="f.values[v] ? 'primary' : 'secondary'"> {{ getDisplayName(v, index) }} </Text>

											<Checkbox :checked="f.values[v]" :class="$style.value" />
										</Flex>
									</Flex>
								</template>
							</Popover>
						</Flex>
					</template>
				</Flex>
				
				<template v-else>
					<Flex v-if="selectedFilters[0].type = 'multiselect'" direction="column" align="center" gap="16" wide :class="$style.multiselect">
						<Flex align="center" justify="center">
							<Text size="12" color="tertiary"> {{ selectedFilters[0].name }} </Text>
						</Flex>

						<Flex direction="column" gap="8" wide :class="$style.content">
							<Flex
								v-for="v in Object.keys(selectedFilters[0].values)"
								@click="selectedFilters[0].values[v] = !selectedFilters[0].values[v]"
								align="center"
								justify="between"
								wide
								:class="$style.item"
							>
								<Text size="12" :color="selectedFilters[0].values[v] ? 'primary' : 'secondary'"> {{ getDisplayName(v, 0) }} </Text>

								<Checkbox :checked="selectedFilters[0].values[v]" :class="$style.value" />
							</Flex>
						</Flex>
					</Flex>
				</template>

				<Flex align="center" gap="12" wide>
					<Button @click="handleApply" type="secondary" size="mini" wide>
						<Text size="12" color="primary">Apply</Text>
					</Button>

					<Button v-if="showClear" @click="handleClear" type="secondary" size="mini" wide>
						<Text size="12" color="primary">Clear</Text>
					</Button>
				</Flex>
			</Flex>
		</template>
	</Popover>
</template>

<style module>
.filter {
	width: 100%;
}

.multiselect {
	width: 100%;
	/* height: 100%; */
	cursor: pointer;

	& .title {
		
	}

	& .content {
		min-height: 200px;
		max-height: 200px;
		/* height: 200px; */

		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
	}

	& .item {
		cursor: pointer;

		&:hover [class*="checkbox"] {
			border-color: var(--brand);
		}
	}

	& .value {
		padding-right: 4px;
	}
}

.multiselect_title {
	width: 100%;
}

.multiselect_content {
	height: 200px;
	max-height: 200px;

	overflow-y: auto;
	overflow-x: hidden;
	overscroll-behavior: contain;

	& .item {
		cursor: pointer;

		&:hover [class*="checkbox"] {
			border-color: var(--brand);
		}
	}

	& .value {
		padding-right: 4px;
	}
}

.multiselect_item {
	cursor: pointer;

	& .value {
		padding-right: 4px;
	}

	&:hover [class*="checkbox"] {
		border-color: var(--brand);
	}
}
</style>
