<script setup>
/**
 * Vendor
 */
import { useDebounceFn } from "@vueuse/core"

/**
 * Composable
 */
import { useOutside } from "@/composables/outside"

/** Services */
import { shortHash } from "~/services/utils"

/** API */
import { search } from "@/services/api/store"

let removeOutside = null

const searchEl = ref()
const inputEl = ref()

const searchTerm = ref()
const results = ref([])
const history = ref([])

const show = ref(false)

const tabs = ref([
	{
		icon: "block",
		name: "Blocks",
	},
	{
		icon: "rollup",
		name: "Rollups",
	},
	{
		icon: "account",
		name: "Accounts",
	},
	{
		icon: "validator",
		name: "Validators",
	},
])
const activeTab = ref(tabs.value[0].name)

onMounted(() => {
	window.addEventListener("keydown", (e) => {
		if (e.code === "Slash" && !show.value) {
			inputEl.value.focus()
			e.preventDefault()
		}
	})
})

const debouncedSearch = useDebounceFn(async (e) => {
	const { data } = await search(searchTerm.value?.trim())
	results.value = data.value || []
}, 250)
watch(
	() => searchTerm.value,
	() => {
		if (searchTerm.value?.length > 1000) return
		debouncedSearch()
	},
)

const handleClear = () => {
	results.value = []
	searchTerm.value = null
}

const handleSaveToHistory = (item) => {
	if (localStorage.history) {
		localStorage.history = JSON.stringify([item, ...JSON.parse(localStorage.history).slice(0, 4)])
	} else {
		localStorage.history = JSON.stringify([item])
	}
}

const onKeydown = (e) => {
	if (e.code === "Escape") {
		show.value = false
		inputEl.value.blur()
	}
}
watch(
	() => show.value,
	() => {
		if (show.value) {
			window.addEventListener("keydown", onKeydown)

			history.value = localStorage.history ? JSON.parse(localStorage.history) : []

			nextTick(() => {
				removeOutside = useOutside(searchEl.value.wrapper, () => {
					show.value = false
				})
			})
		} else {
			activeTab.value = tabs.value[0].name

			searchTerm.value = null

			window.removeEventListener("keydown", onKeydown)

			if (removeOutside) removeOutside()
		}
	},
)
</script>

<template>
	<Flex ref="searchEl" :class="$style.wrapper">
		<Flex @click="inputEl.focus()" align="center" justify="between" :class="$style.field">
			<Flex align="center" gap="8">
				<Icon name="search" size="16" color="secondary" />
				<input ref="inputEl" v-model="searchTerm" placeholder="Search" @focus="show = true" />
			</Flex>

			<Flex align="center" justify="center" :class="$style.kbd">
				<Text size="12" weight="600" color="secondary">/</Text>
			</Flex>
		</Flex>

		<Transition name="search">
			<div v-if="show" :class="$style.popup_controller">
				<Flex direction="column" :class="$style.popup">
					<Flex :class="$style.header">
						<Text v-if="!results.length && history.length" size="12" weight="600" color="secondary">Search History</Text>
						<Text v-else size="12" weight="600" color="secondary">Results</Text>
					</Flex>

					<Flex
						v-if="!results.length && !history.length"
						direction="column"
						align="center"
						justify="center"
						gap="8"
						:class="$style.inner"
					>
						<Text size="13" weight="600" color="primary">Start typing to search</Text>
						<Text size="12" weight="500" color="tertiary">Here will be the history after the first query</Text>
					</Flex>
					<Flex v-else-if="!results.length && history.length" direction="column" gap="2" :class="$style.inner">
						<NuxtLink v-for="item in history" :to="`/${item.type}/${item.body.hash}`" @click="handleSaveToHistory(item)">
							<Flex align="center" justify="between" :class="$style.item">
								<Flex align="center" gap="6">
									<Icon name="time" size="12" color="secondary" />
									<Text size="13" weight="600" color="primary">
										{{ shortHash(item.body.hash) }}
									</Text>
								</Flex>

								<Text size="13" weight="500" color="tertiary" style="text-transform: capitalize">
									{{ item.type }}
								</Text>
							</Flex>
						</NuxtLink>
					</Flex>
					<Flex v-else direction="column" gap="2" :class="$style.inner">
						<NuxtLink
							v-for="result in results"
							:to="`/${result.type}/${result.body.hash}`"
							@click="handleSaveToHistory(result)"
						>
							<Flex align="center" justify="between" :class="$style.item">
								<Flex align="center" gap="6">
									<Icon :name="result.type" size="12" color="secondary" />
									<Text size="13" weight="600" color="primary">
										{{ shortHash(result.body.hash) }}
									</Text>
								</Flex>

								<Text size="13" weight="500" color="tertiary" style="text-transform: capitalize">
									{{ result.type }}
								</Text>
							</Flex>
						</NuxtLink>
					</Flex>

					<Flex align="center" justify="between" :class="$style.bottom">
						<Text v-if="results.length" size="12" weight="600" color="tertiary">{{ results.length }} results</Text>
						<Text v-else size="12" weight="600" color="tertiary">No results</Text>

						<Flex align="center" gap="8">
							<Text v-if="results.length" @click="handleClear" size="12" weight="600" color="brand"> Clear results</Text>
						</Flex>
					</Flex>
				</Flex>
			</div>
		</Transition>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
}

.field {
	width: 200px;
	height: 32px;

	border-radius: 6px;
	background: var(--op-8);
	cursor: text;
	box-shadow: inset 0 0 0 1px var(--op-5);

	padding: 0 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.field input {
	width: 100%;

	font-size: 14px;
	line-height: 1;
	font-weight: 500;
	color: var(--txt-primary);
}

.kbd {
	height: 22px;

	box-shadow: inset 0 0 0 1px var(--op-8);
	border-radius: 5px;

	padding: 0 8px;
}

.popup_controller {
	position: absolute;
	top: 40px;
	right: 0;

	z-index: 100;
}

.popup {
	width: 450px;

	background: var(--card-background);
	box-shadow: inset 0 0 0 1px var(--op-5);
	border-radius: 8px;
}

.header {
	padding: 12px 12px 4px 12px;
}

.inner {
	min-height: 120px;

	padding: 8px;
}

.item {
	height: 28px;

	border-radius: 5px;
	background: var(--op-8);
	cursor: pointer;

	padding: 0 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.bottom {
	height: 32px;

	border-top: 1px solid var(--op-5);

	padding: 0 12px;
}

.tab {
	border-radius: 6px;
	background: transparent;
	box-shadow: inset 0 0 0 1px var(--op-5);
	cursor: pointer;

	padding: 6px 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-5);
	}

	&.active {
		background: rgba(221, 80, 34, 15%);
	}
}

@media (max-width: 500px) {
	.field {
		width: 150px;
	}

	.popup_controller {
		position: fixed;
		left: 12px;
		right: 12px;
		top: 60px;
	}

	.popup {
		width: 100%;
	}
}
</style>
