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
import { getRollupHashSafeURL } from "~/services/utils/rollups"

/** API */
import { search } from "@/services/api/store"

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
})

const router = useRouter()

let removeOutside = null

const searchEl = ref()
const inputEl = ref()

const searchTerm = ref()
const results = ref([])
const history = ref([])

const isLoading = ref(false)
const notFound = ref(false)

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
	if (!searchTerm.value) return

	isLoading.value = true
	const { data } = await search(searchTerm.value?.trim())

	if (data.value.length) {
		results.value = data.value.map((item) => {
			let newItem = { ...item }
			if (newItem.type === "validator" || newItem.type === "bridge") {
				newItem.body.hash = newItem.body.address
			}

			return newItem
		})
	} else {
		notFound.value = true
	}

	isLoading.value = false
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
	notFound.value = false
}

const handleClearHistory = () => {
	history.value = []
	localStorage.removeItem("history")
}

const handleSaveToHistory = (target) => {
	if (localStorage.history) {
		if (!JSON.parse(localStorage.history).find((item) => item.value === target.value)) {
			localStorage.history = JSON.stringify([target, ...JSON.parse(localStorage.history).slice(0, 4)])
		}
	} else {
		localStorage.history = JSON.stringify([target])
	}

	show.value = false
	inputEl.value.blur()
	handleClear()
}

const getResultPath = (result) => {
	if (!result) return

	switch (result.type) {
		case "address":
			return `/account/${result.body.hash}`
		case "block":
			return `/${result.type}/${result.body.height}`
		case "validator":
			return `/${result.type}/${result.body.id}`
		case "bridge":
			return `/account/${result.body.address}`
		case "rollup":
			return `/${result.type}/${getRollupHashSafeURL(result.body.hash)}`
		case "app":
			return `/app/${result.body.slug}`

		default:
			return `/${result.type}/${result.body.hash}`
	}
}

const getDisplayName = (item) => {
	if (!item) return

	switch (item.type) {
		case "app":
			return item.body.name

		default:
			return shortHash(item.body.hash)
	}
}

const onKeydown = (e) => {
	if (e.code === "Escape") {
		show.value = false
		inputEl.value.blur()
	}

	if (e.code === "Enter" && results.value.length) {
		const target = results.value[0]
		router.push(getResultPath(target))

		handleSaveToHistory(target)

		show.value = false
		inputEl.value.blur()
		handleClear()
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
			notFound.value = false

			window.removeEventListener("keydown", onKeydown)

			if (removeOutside) removeOutside()
		}
	},
)
</script>

<template>
	<Flex ref="searchEl" :class="[$style.wrapper, disabled && $style.disabled]">
		<Flex @click="inputEl.focus()" align="center" justify="between" gap="8" :class="$style.field">
			<Flex align="center" gap="8">
				<Icon name="search" size="16" color="secondary" />
				<input ref="inputEl" v-model="searchTerm" placeholder="Search" @focus="show = true" />
			</Flex>

			<Flex @click="handleClear" align="center" justify="center" :class="$style.kbd">
				<Spinner v-if="isLoading" size="12" />
				<Text v-else-if="!searchTerm" size="12" weight="600" color="secondary">/</Text>
				<Icon v-else name="close" size="12" color="secondary" />
			</Flex>
		</Flex>

		<Transition name="search">
			<div v-if="show" :class="$style.popup_controller">
				<Flex direction="column" :class="[$style.popup]">
					<Flex :class="$style.header">
						<Text v-if="!results.length && history.length" size="12" weight="600" color="secondary">Search History</Text>
						<Text v-else size="12" weight="600" color="secondary">Results</Text>
					</Flex>

					<Flex
						v-if="notFound && !results.length && searchTerm"
						direction="column"
						align="center"
						justify="center"
						gap="8"
						:class="$style.inner"
					>
						<Text size="13" weight="600" color="primary">Nothing was found</Text>
						<Text size="12" weight="500" color="tertiary">You can find blocks, transactions, or rollups</Text>
					</Flex>
					<Flex
						v-else-if="!results.length && !history.length"
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
						<NuxtLink v-for="item in history" :to="getResultPath(item)" @click="handleSaveToHistory(item)">
							<Flex align="center" justify="between" :class="$style.item">
								<Flex align="center" gap="6">
									<Icon name="time" size="12" color="secondary" />
									<Text size="13" weight="600" color="primary">
										{{ getDisplayName(item) }}
									</Text>
								</Flex>

								<Text size="13" weight="500" color="tertiary" style="text-transform: capitalize">
									{{ item.type }}
								</Text>
							</Flex>
						</NuxtLink>
					</Flex>
					<Flex v-else direction="column" gap="2" :class="$style.inner">
						<NuxtLink v-for="result in results" :to="getResultPath(result)" @click="handleSaveToHistory(result)">
							<Flex align="center" justify="between" :class="$style.item">
								<Flex align="center" gap="6">
									<Icon :name="result.type === 'address' ? 'account' : result.type" size="12" color="secondary" />
									<Text size="13" weight="600" color="primary">
										{{ getDisplayName(result) }}
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

						<Text v-if="results.length" @click="handleClear" size="12" weight="600" color="brand" :class="$style.txt_button">
							Clear results</Text
						>
						<Text
							v-if="history.length && !results.length"
							@click="handleClearHistory"
							size="12"
							weight="600"
							color="brand"
							:class="$style.txt_button"
						>
							Clear history</Text
						>
					</Flex>
				</Flex>
			</div>
		</Transition>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
	user-select: none;

	transition: opacity 0.2s ease;
}

.field {
	width: 450px;
	height: 32px;

	border-radius: 6px;
	background: var(--op-8);
	cursor: text;

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
	width: 24px;
	height: 22px;

	cursor: pointer;
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

.txt_button {
	cursor: pointer;
}

.disabled {
	cursor: default;
	pointer-events: none;
	opacity: 0.7;
}

@media (max-width: 600px) {
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
