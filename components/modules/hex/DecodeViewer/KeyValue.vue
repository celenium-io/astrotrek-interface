<script setup>
/** Vendor */
import { Buffer } from "buffer"

/** UI */
import Button from "@/components/ui/Button.vue"

const emit = defineEmits(["onCollapse"])
const props = defineProps({
	tx: Object,
	k: String,
	value: {
		type: [Object, String, Number, BigInt, Function],
	},
	collapsed: { type: Boolean, default: false },
})

const hasExecutionResult = ref(false)
const executionError = ref(false)
const executionResult = ref()
const executionResultType = ref()
const formattedResult = ref()
const isUint8Array = ref(false)
const execute = () => {
	if (hasExecutionResult.value) return

	try {
		const result = props.tx[props.k]()

		executionResultType.value = typeof result

		if (executionResultType.value === "bigint") {
			executionResult.value = Number(result)
		} else {
			executionResult.value = result
		}

		if (executionResult.value instanceof Uint8Array) {
			isUint8Array.value = true
		}
	} catch (error) {
		executionError.value = error
	} finally {
		hasExecutionResult.value = true
	}
}
const handleToString = () => {
	formattedResult.value = new TextDecoder().decode(executionResult.value)
}
const handleToHex = () => {
	formattedResult.value = Buffer.from(executionResult.value).toString("hex")
}
const handleClearResult = () => {
	executionError.value = null
	executionResult.value = null
	formattedResult.value = null
	hasExecutionResult.value = false
}
</script>

<template>
	<Flex @click="emit('onCollapse', k)" direction="column" gap="8" :class="$style.wrapper">
		<Flex align="center" gap="8" justify="between">
			<Flex align="center" gap="8">
				<Text size="12" weight="700" color="secondary" mono>
					{{ k }}
				</Text>
				<Text v-if="value !== undefined" size="12" weight="500" color="tertiary" mono>
					{{ typeof value }}
				</Text>
			</Flex>

			<Icon name="chevron" size="12" color="secondary" :style="{ transform: !collapsed ? 'rotate(180deg)' : null }" />
		</Flex>

		<template v-if="!collapsed">
			<Flex direction="column" gap="20">
				<Flex
					@click.stop
					justify="between"
					:class="$style.content"
					:style="{ minHeight: typeof value === 'function' ? '42px' : null }"
				>
					<Text as="pre" size="12" height="140" :color="value !== undefined ? 'secondary' : 'tertiary'" mono>
						{{ value !== undefined ? value : "Empty" }}
					</Text>

					<Button
						v-if="typeof value === 'function'"
						@click="execute"
						type="secondary"
						size="mini"
						:disabled="hasExecutionResult"
						:class="$style.execute_btn"
					>
						<Icon name="function" size="16" color="brand" />
						Execute
					</Button>
				</Flex>

				<Flex v-if="hasExecutionResult" direction="column" gap="8">
					<Flex align="center" justify="between">
						<Flex align="center" gap="6">
							<Icon name="tx" size="12" color="brand" />
							<Text size="12" color="primary" mono>
								Result: <Text color="tertiary">{{ executionResultType }}</Text>
							</Text>
						</Flex>

						<Flex align="center" gap="12">
							<Text v-if="isUint8Array" @click.stop="handleToHex" size="12" weight="600" color="brand" class="clickable">
								Hex
							</Text>
							<Text v-if="isUint8Array" @click.stop="handleToString" size="12" weight="600" color="brand" class="clickable">
								String
							</Text>
							<Text @click.stop="handleClearResult" size="12" weight="600" color="brand" class="clickable">Clear</Text>
						</Flex>
					</Flex>

					<Flex @click.stop direction="column" gap="8" :class="$style.content">
						<Text v-if="!executionError" as="pre" size="12" height="140" color="secondary" mono>
							{{ formattedResult ? formattedResult : executionResult }}
						</Text>
						<Text v-else as="pre" size="12" height="140" color="tertiary" mono>
							{{ executionError }}
							<br /><br />The visualizer does not support data passing to the called function. <br />Therefore, the execution
							of the function ended with an error.
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</template>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	background: var(--op-5);
	cursor: pointer;
	box-shadow: inset 0 0 0 1px var(--op-5);

	padding: 8px;

	&:hover {
		& .execute_btn {
			display: flex;
		}
	}
}

.content {
	position: relative;
	max-height: 300px;
	overflow: auto;

	cursor: text;
	border-radius: 8px;
	background: var(--card-background);

	padding: 8px 8px 8px 10px;

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

.execute_btn {
	position: absolute;
	top: 8px;
	right: 8px;

	display: none;
}
</style>
