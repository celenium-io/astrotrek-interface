<script setup>
/** Vendor */
import { DateTime } from "luxon"

const props = defineProps({
	bytes: {
		type: Array,
	},
	range: {
		type: Object,
	},
	cursor: {
		type: Number,
	},
	action: {
		type: Object,
	},
})

const showDebugger = ref(true)
const showActionMetadata = ref(false)

const asciiMap = {
	0: "NUL - Null",
	1: "SOH - Start of heading",
	2: "STX - Start of text",
	3: "ETX - End of text",
	4: "EOT - End of transmission",
	5: "ENQ - Enquiry",
	6: "ACK - Acknowledge",
	7: "BEL - Bell",
	8: "BS - Backspace",
	9: "Tab - Horizontal tab",
	10: "LF - NL line feed, new line",
	11: "VT - Vertical tab",
	12: "FF - NP from feed, new page",
	13: "CR - Carriage return",
	14: "SO - Shift out",
	15: "SI - Shift in",
	16: "DLE - Data link escape",
	17: "DC1 - Device control 1",
	18: "DC2 - Device control 2",
	19: "DC3 - Device control 3",
	20: "DC4 - Device control 4",
	21: "NAK - Negative acknowledge",
	22: "SYN - Synchronous idle",
	23: "ETB - End of trans. block",
	24: "CAN - Cancel",
	25: "EM - End of medium",
	26: "SUB - Subtitute",
	27: "ESC - Escape",
	28: "FS - File separator",
	29: "GS - Group separator",
	30: "RS - Record separator",
	31: "US - Unit separator",
}

const hexToUint8Array = (hex) => {
	const arr = []
	for (let i = 0; i < hex.length; i += 2) {
		arr.push(parseInt(hex.substr(i, 2), 16))
	}
	return new Uint8Array(arr)
}

const decode = (bytes) => {
	return bytes.map((b) => String.fromCharCode(null, new Uint8Array([parseInt(`0x${b}`, 16)]))).join("")
}
</script>

<template>
	<Flex direction="column" gap="32" :class="$style.wrapper">
		<Flex direction="column" gap="16">
			<Flex @click="showDebugger = !showDebugger" align="center" gap="6" class="clickable">
				<Text size="12" weight="600" color="primary" mono>Debugger</Text>
				<Icon name="chevron" size="12" color="secondary" :style="{ transform: showDebugger ? 'rotate(180deg)' : null }" />
			</Flex>

			<template v-if="showDebugger">
				<Flex direction="column" gap="8" :class="$style.field">
					<Flex align="center" gap="6">
						<Text size="12" weight="600" color="secondary" mono>Binary</Text>
						<CopyButton v-if="range.start" :text="bytes[range.start].toString(2).padStart(8, '0')" size="12" />
					</Flex>

					<Text v-if="range.start" size="13" weight="600" color="primary" mono>
						{{ bytes[range.start].toString(2).padStart(8, "0") }}
					</Text>
					<Text v-else size="13" weight="600" color="tertiary" mono>No bytes selected</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Flex align="center" gap="6">
						<Text size="12" weight="600" color="secondary" mono>Uint8</Text>
						<CopyButton v-if="range.start" :text="hexToUint8Array(bytes[range.start]).toString()" size="12" />
					</Flex>

					<Text v-if="range.start" size="13" weight="600" color="primary" mono>
						{{ hexToUint8Array(bytes[range.start]) }}
					</Text>
					<Text v-else size="13" weight="600" color="tertiary" mono>No bytes selected</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Text size="12" weight="600" color="secondary" mono>Time</Text>

					<Text v-if="range.start" size="13" weight="600" color="primary" mono>
						{{ DateTime.fromISO(parseInt(bytes[range.start], 16)) }}
					</Text>
					<Text v-else size="13" weight="600" color="tertiary" mono>No bytes selected</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Flex align="center" gap="6">
						<Text size="12" weight="600" color="secondary" mono>ASCII</Text>
						<CopyButton
							v-if="range.start"
							:text="
								range.start < range.end
									? bytes
											.slice(range.start, range.end)
											.map((byte) => String.fromCharCode(parseInt(byte, 16)))
											.join('')
									: bytes
											.slice(range.end, range.start)
											.map((byte) => String.fromCharCode(parseInt(byte, 16)))
											.join('')
							"
							size="12"
						/>
					</Flex>

					<Text
						v-if="range.start !== null && range.end !== null"
						size="13"
						weight="600"
						height="140"
						color="primary"
						mono
						:class="$style.ascii"
					>
						<template v-if="range.start < range.end">
							{{ decode(bytes.slice(range.start, range.end)) }}
						</template>
						<template v-else-if="range.start > range.end">
							{{ decode(bytes.slice(range.end, range.start)) }}
						</template>
					</Text>
					<Text v-else size="13" weight="600" height="140" color="tertiary" mono> No bytes selected </Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Flex align="center" gap="6">
						<Text size="12" weight="600" color="secondary" mono>UTF-8 Character</Text>
						<CopyButton v-if="range.start" :text="123" size="12" />
					</Flex>

					<Text
						v-if="parseInt(bytes[cursor], 16) >= 0 && parseInt(bytes[cursor], 16) <= 31"
						size="13"
						weight="600"
						height="140"
						color="secondary"
						mono
					>
						{{ asciiMap[parseInt(bytes[cursor], 16)] }}
					</Text>
					<Text v-else size="13" weight="600" height="140" color="primary" mono>
						{{ decode([bytes[cursor]]) }}
					</Text>
				</Flex>
			</template>
		</Flex>

		<Flex direction="column" gap="16">
			<Flex @click="showActionMetadata = !showActionMetadata" align="center" gap="6" class="clickable">
				<Text size="12" weight="600" color="primary" mono>Action</Text>
				<Icon name="chevron" size="12" color="secondary" :style="{ transform: showActionMetadata ? 'rotate(180deg)' : null }" />
			</Flex>

			<template v-if="showActionMetadata">
				<Flex direction="column" gap="8" :class="$style.field">
					<Text size="12" weight="600" color="secondary" mono>Type</Text>

					<Text size="13" weight="600" color="primary" mono>
						{{ action.type }}
					</Text>
				</Flex>
				<Flex direction="column" gap="8" :class="$style.field">
					<Flex align="center" gap="6">
						<Text size="12" weight="600" color="secondary" mono>Transaction</Text>
						<CopyButton :text="action.tx_hash" size="12" />
					</Flex>

					<Text size="13" weight="600" color="primary" mono>
						{{ action.tx_hash.slice(0, 4) }}...{{ action.tx_hash.slice(-4) }}
					</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Text size="12" weight="600" color="secondary" mono>Date</Text>

					<Text as="pre" size="13" weight="600" color="primary" mono>
						{{ DateTime.fromISO(action.time) }}
					</Text>
				</Flex>

				<Flex direction="column" gap="8" :class="$style.field">
					<Text size="12" weight="600" color="secondary" mono>Block</Text>

					<Text as="pre" size="13" weight="600" color="primary" mono>
						{{ action.height }}
					</Text>
				</Flex>
			</template>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	overflow: hidden;
}

.header {
	cursor: pointer;
	border-radius: 6px;

	padding: 8px;
	margin: -8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}
}

.field {
	border-radius: 6px;
}

.value {
	cursor: pointer;

	transition: all 0.2s ease;

	&:hover {
		color: var(--txt-primary);
		background: var(--op-10);
	}

	&:nth-child(9) {
		margin-right: 10px;
	}
}

.ascii {
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
