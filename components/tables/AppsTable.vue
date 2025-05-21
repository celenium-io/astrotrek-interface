<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** Components */
import EmptyHolder from "~/components/shared/EmptyHolder.vue"
import LinkToEntity from "@/components/shared/LinkToEntity.vue"

/** Services */
import { capitalize, formatBytes, isMobile, midHash, spaces } from "@/services/utils"
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	apps: {
		type: Array,
	},
	isLoading: {
		type: Boolean,
	},
})

const preparedApps = ref([])
const tagNames = ref(["category", "vm", "stack", "type", "provider"])
function getTagDisplayName(tagName) {
	switch (tagName) {
		case "vm":
			return "VM"
		default:
			return capitalize(tagName)
	}
}
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
	preparedApps.value = [...props.apps]
	preparedApps.value.forEach((app) => {
		let res = []
		tagNames.value.forEach((tag) => {
			if (app[tag]) {
				res.push({
					name: getTagDisplayName(tag),
					value: getTagValueDisplayName(tag, app[tag]),
				})
			}
		})

		app.tags = res
	})
}

watch(
	() => props.apps,
	() => {
		if (props.apps.length) {
			fillTags()
		}
	},
)
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
			<Spinner size="16" />

			<Flex direction="column" align="center" gap="8">
				<Text size="14" color="primary">Fetching applications...</Text>
				<Text size="13" color="tertiary">It's almost done</Text>
			</Flex>
		</Flex>

		<Flex
			v-else-if="preparedApps.length > 0"
			v-for="app in preparedApps"
			align="center"
			:class="[$style.row, isLoading && $style.disabled]"
		>
			<NuxtLink :to="`/app/${app.slug}`" :style="{ width: '100%' }">
				<Flex align="center" justify="between" wide>
					<Flex align="center" gap="12">
						<Flex v-if="app.logo" align="center" justify="center" :class="$style.avatar_container">
							<img :src="app.logo" :class="$style.avatar_image" />
						</Flex>
						<Flex direction="column" gap="8">
							<Text size="12" color="primary"> {{ app.name }} </Text>

							<Flex v-if="!isMobile()" align="center" gap="8">
								<Flex v-for="tag in app.tags" align="center" gap="8">
									<Text size="12" color="secondary">
										{{ tag.value }}
									</Text>

									<div :class="$style.dot" />
								</Flex>

								<Text size="12" color="tertiary">Last Active</Text>

								<Text size="12" color="secondary">
									{{ DateTime.fromISO(app.last_message_time).setLocale("en").toFormat("tt, LLL d, y") }}
								</Text>
							</Flex>
						</Flex>
					</Flex>

					<Tooltip>
						<Flex align="center" gap="4">
							<Text size="13" weight="600" color="primary"> {{ spaces(app.actions_count) }} </Text>

							<Icon name="action" size="13" color="tertiary" />
						</Flex>

						<template #content>
							<Text size="12" color="tertiary">Actions count</Text>
						</template>
					</Tooltip>
				</Flex>
			</NuxtLink>
		</Flex>

		<EmptyHolder v-else-if="!isLoading" title="There are no apps" :style="{ borderTop: '1px solid var(--op-5)' }" />
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-30%) translateX(-50%);
}

.row {
	height: 60px;

	border-top: 1px solid var(--op-5);
	border-radius: 0;

	cursor: pointer;

	padding: 0 16px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&:active {
		background: var(--op-10);
	}

	&.disabled {
		pointer-events: none;
		opacity: 0.2;
	}
}

.avatar_container {
	position: relative;
	width: 40px;
	height: 40px;
	overflow: hidden;
	border-radius: 50%;
}

.avatar_image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.dot {
	width: 4px;
	height: 4px;

	border-radius: 50%;
	background: var(--op-10);
}
</style>
