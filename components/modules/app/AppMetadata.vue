<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** Services */
import { getNativeAsset, spaces } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"
import { capitalize, capitalizeAndReplaceUnderscore, formatBytes } from "~/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "~/components/ui/Tooltip.vue"

const props = defineProps({
	app: {
		type: Object,
	},
})

const tagNames = ref(["category", "vm", "stack", "type", "provider"])
const appTags = ref([
	{
		name: "category",
		value: "",
		tooltip: "Category",
	},
	{
		name: "vm",
		value: "",
		tooltip: "VM",
	},
	{
		name: "stack",
		value: "",
		tooltip: "Stack",
	},
	{
		name: "type",
		value: "",
		tooltip: "Type",
	},
	{
		name: "provider",
		value: "",
		tooltip: "Provider",
	},
])
function getTagValueDisplayName(tagName, tagValue) {
	switch (tagName) {
		case "vm":
			return tagValue.toUpperCase()
		case "category":
			if (tagValue === "nft") return "NFT"

			return capitalize(tagValue)
		default:
			return capitalize(tagValue)
	}
}

function fillTags() {
	let arr = [...appTags.value]
	arr.forEach((tag, index) => {
		if (props.app[tag.name]) {
			appTags.value[index].value = getTagValueDisplayName(tag.name, props.app[tag.name])
		} else {
			appTags.value.splice(index, 1)
		}
	})
}

onMounted(() => {
	fillTags()
})
const showMore = ref(false)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex align="center" :class="$style.item" :style="{marginBottom: '2px'}">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Tags</Text>

			<Flex align="center" gap="12" :class="$style.value">
				<Tooltip v-for="tag in appTags">
					<Flex align="center" :class="$style.chip">
						<Flex align="center" :class="$style.chip_content">
							<Text size="12" color="primary"> {{ tag.value }} </Text>
						</Flex>
					</Flex>

					<template #content>
						{{ tag.tooltip }}
					</template>
				</Tooltip>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Description</Text>

			<Flex align="center" gap="8" :class="$style.value">
				<Text size="13" weight="600" color="secondary" mono> {{ app.description }} </Text>
			</Flex>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Native Bridge</Text>

			<NuxtLink :to="`/account/${app.native_bridge}`">
				<Flex align="center" gap="6" :class="$style.value">
					<CopyButton :text="app.native_bridge" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow"> {{ app.native_bridge }} </Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex align="center" :class="$style.item">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Rollup</Text>

			<NuxtLink :to="`/rollup/${getRollupHashSafeURL(app.rollup)}`">
				<Flex align="center" gap="6" :class="$style.value">
					<CopyButton :text="app.rollup" />
					<Text size="13" weight="600" color="primary" mono :class="$style.overflow"> {{ app.rollup }} </Text>
					<Icon name="arrow-narrow-up-right" size="10" color="secondary"></Icon>
				</Flex>
			</NuxtLink>
		</Flex>

		<Flex v-if="app.links?.length" align="start" :class="$style.item" :style="{ padding: '6px 12px' }">
			<Text size="13" weight="600" color="secondary" :class="$style.key">Related Links</Text>

			<Flex direction="column" gap="14" :class="$style.value">
				<Flex v-for="link in app.links" align="center" gap="4">
					<NuxtLink :to="link" target="blank" :class="$style.related_link">
						<Text size="13" weight="600" color="secondary"> {{ link }} </Text>
					</NuxtLink>
				</Flex>
			</Flex>
		</Flex>

		<template v-if="showMore">
			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Size</Text>
				
				<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ formatBytes(app.size) }} </Text>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Actions Count</Text>

				<Text size="13" weight="600" color="primary" mono :class="$style.value"> {{ app.actions_count }} </Text>
			</Flex>

			<Flex align="center" :class="$style.item">
				<Text size="13" weight="600" color="secondary" :class="$style.key">Last Active</Text>

				<Text size="13" weight="600" color="primary" mono :class="$style.value">
					{{ DateTime.fromISO(app.last_message_time).setLocale("en").toFormat("tt, LLL d, y") }}
				</Text>
			</Flex>
		</template>
	</Flex>

	<Flex @click="showMore = !showMore" align="center" justify="end" gap="4" :class="$style.show_more">
		<Icon size="12" name="chevron-double" color="brand" :rotate="showMore ? 180 : 0" />
		<Text size="12" weight="600" color="brand">Show {{ showMore ? 'Less' : 'More' }} </Text>
	</Flex>
</template>

<style module>
.wrapper {
	border-radius: 8px;
	box-shadow: inset 0 0 0 1px var(--op-5);
	background: var(--op-3);
}

.item {
	min-height: 36px;

	padding: 0 12px;

	&:last-child {
		border-bottom: none;
	}
}

.key {
	min-width: 300px;
}

.value {
	min-width: 0;
	/* max-width: 700px; */
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.chip {
    box-shadow: inset 0 0 0 1px var(--op-20);
    border-radius: 6px;
}

.chip_content {
    padding: 4px 8px;
}

.related_link:hover {
	span {
		color: var(--txt-primary);
	}
}

.show_more {
	margin-top: -10px;

	cursor: pointer;
}

@media (max-width: 750px) {
	.item {
		min-height: 54px;

		flex-direction: column;
		align-items: start;
		justify-content: center;
		gap: 8px;

		overflow: hidden;
	}

	.value {
		width: 100%;
	}
}
</style>
