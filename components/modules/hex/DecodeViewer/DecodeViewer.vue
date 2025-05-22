<script setup>
/** Vendor */
import { Buffer } from "buffer"
import { createTxFromRLP } from "@ethereumjs/tx"

/** UI */
import Button from "@/components/ui/Button.vue"

/** Components */
import KeyValue from "./KeyValue.vue"

const props = defineProps({
	data: String,
})

const isParsed = ref(true)
const tx = ref({})
const txMethods = computed(() => Object.getOwnPropertyNames(tx.value.__proto__).filter((m) => !["constructor"].includes(m)))

const showContent = ref(true)

const activeTab = ref(0)
const tabs = ref([
	{
		name: "Visualizer",
	},
	{
		name: "Raw JSON",
	},
	{
		name: "Raw Data",
	},
])

const activeSelector = ref("props")

const collapsedItems = ref([])
const onCollapse = (target) => {
	const targetIdx = collapsedItems.value.indexOf(target)
	if (targetIdx === -1) {
		collapsedItems.value.push(target)
	} else {
		collapsedItems.value.splice(targetIdx, 1)
	}
}
const handleCollapseAll = () => {
	collapsedItems.value = [...Object.keys(tx.value), ...txMethods.value]
}

onMounted(() => {
	try {
		const buffer = Buffer.from(props.data, "base64")
		tx.value = createTxFromRLP(buffer)

		collapsedItems.value = [...txMethods.value]
	} catch (error) {
		console.log(error)
		isParsed.value = false
	}
})
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex @click="showContent = !showContent" align="center" justify="between" :class="[$style.top, 'clickable']">
			<Flex align="center" gap="8">
				<Icon :name="isParsed ? 'check-circle' : 'close'" size="12" :color="isParsed ? 'green' : 'red'" />
				<Text size="12" weight="700" color="primary" mono>Decoder</Text>
				<Text size="12" weight="700" color="tertiary" mono>{{ isParsed ? "Successfully parsed" : "Error during parsing" }}</Text>
			</Flex>

			<Icon name="chevron" size="12" color="secondary" :style="{ transform: showContent ? 'rotate(180deg)' : null }" />
		</Flex>

		<Flex v-if="showContent && isParsed" direction="column" gap="16" :class="$style.content">
			<Flex align="center" gap="8" :class="$style.tabs">
				<Text
					v-for="(tab, tabIdx) in tabs"
					@click="activeTab = tabIdx"
					size="12"
					weight="600"
					color="tertiary"
					:class="[$style.tab_item, activeTab === tabIdx && $style.active]"
				>
					{{ tab.name }}
				</Text>
			</Flex>

			<!-- Visualizer -->
			<template v-if="activeTab === 0">
				<Flex align="center" gap="16">
					<Flex align="center" justify="center" gap="4" :class="$style.selector">
						<Flex
							@click="activeSelector = 'props'"
							align="center"
							justify="center"
							gap="6"
							:class="[$style.selector_item, activeSelector === 'props' && $style.active]"
						>
							<Icon name="property" size="16" color="tertiary" />
							<Text size="13" weight="600" color="tertiary">Properties</Text>
						</Flex>

						<Flex
							@click="activeSelector = 'funcs'"
							align="center"
							justify="center"
							gap="6"
							:class="[$style.selector_item, activeSelector === 'funcs' && $style.active]"
						>
							<Icon name="function" size="16" color="tertiary" />
							<Text size="13" weight="600" color="tertiary">Functions</Text>
						</Flex>
					</Flex>

					<Button @click="handleCollapseAll" type="secondary" size="mini">
						<Icon name="collapse" size="16" color="secondary" />
						Collapse all
					</Button>
				</Flex>

				<Flex v-if="activeSelector === 'props'" direction="column" gap="8">
					<KeyValue
						v-for="[key, value] in Object.entries(tx)"
						:tx
						:k="key"
						:value
						:collapsed="collapsedItems.includes(key)"
						@onCollapse="onCollapse"
					/>
				</Flex>

				<Flex v-if="activeSelector === 'funcs'" direction="column" gap="8">
					<KeyValue
						v-for="method in txMethods"
						:tx
						:k="method"
						:value="tx[method]"
						:collapsed="collapsedItems.includes(method)"
						@onCollapse="onCollapse"
					/>
				</Flex>
			</template>

			<!-- Raw JSON -->
			<template v-if="activeTab === 1">
				<div :class="$style.raw_content">
					<Text as="pre" size="12" height="140" color="secondary" mono>{{ tx }}</Text>
				</div>
			</template>

			<!-- Raw Data -->
			<template v-if="activeTab === 2">
				<div :class="$style.raw_content">
					<Text as="pre" size="12" height="140" color="secondary" mono>{{ data }}</Text>
				</div>
			</template>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	background: var(--card-background);
	box-shadow: 0 0 0 1px var(--op-10);

	overflow: hidden;

	user-select: none;

	& pre {
		min-width: 0;
		width: 100%;
	}
}

.top {
	height: 32px;

	background: var(--app-background);
	border-radius: 8px;

	padding: 0 8px;
}

.content {
	padding: 12px;
}

.tabs {
	position: relative;

	&:before {
		content: "";

		position: absolute;
		bottom: -4px;
		left: 0;
		right: 0;

		height: 2px;

		background: var(--op-5);
		border-radius: 50px;
	}
}

.tab_item {
	position: relative;

	cursor: pointer;

	padding-bottom: 6px;

	transition: none;

	&.active {
		color: var(--txt-primary);

		&:before {
			content: "";

			position: absolute;
			bottom: -4px;
			left: 0;
			right: 0;

			height: 2px;

			background: var(--brand);
			border-radius: 50px;
		}
	}

	&:hover {
		color: var(--txt-primary);
	}
}

.raw_content {
	border-radius: 8px;
	background: var(--app-background);

	padding: 12px;

	& pre {
		word-break: break-all;
		white-space: pre-wrap;
		user-select: all;

		&::selection {
			background: var(--brand);
			color: var(--txt-black);
		}
	}
}

.selector {
	flex: 1;
	height: 32px;

	background: var(--app-background);
	border-radius: 8px;

	padding: 0 4px;
}

.selector_item {
	flex: 1;

	height: 24px;

	cursor: pointer;
	border-radius: 5px;

	padding: 0 6px;

	& span {
		transition: none;
	}

	& svg {
		transition: none;
	}

	&.active {
		background: var(--op-10);

		& span {
			color: var(--txt-primary);
		}

		& svg {
			fill: var(--brand);
		}
	}
}
</style>
