<script setup>
/**
 * Composable
 */
import { useOutside } from "@/composables/outside"

let removeOutside = null

const searchEl = ref()
const inputEl = ref()

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

			nextTick(() => {
				removeOutside = useOutside(searchEl.value.wrapper, () => {
					show.value = false
				})
			})
		} else {
			activeTab.value = tabs.value[0].name

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
				<input ref="inputEl" placeholder="Search" @focus="show = true" />
			</Flex>

			<Flex align="center" justify="center" :class="$style.kbd">
				<Text size="12" weight="600" color="secondary">/</Text>
			</Flex>
		</Flex>

		<Transition name="search">
			<div v-if="show" :class="$style.popup_controller">
				<Flex direction="column" :class="$style.popup">
					<Flex align="center" gap="8" :class="$style.header">
						<Flex
							v-for="tab in tabs"
							@click="activeTab = tab.name"
							align="center"
							gap="6"
							:class="[$style.tab, activeTab === tab.name && $style.active]"
						>
							<Icon :name="tab.icon" size="14" :color="activeTab === tab.name ? 'brand' : 'secondary'" />
							<Text size="13" weight="600" :color="activeTab === tab.name ? 'brand' : 'primary'">{{ tab.name }}</Text>
						</Flex>
					</Flex>

					<Flex direction="column" align="center" justify="center" gap="8" :class="$style.inner">
						<Text size="13" weight="600" color="primary">Title about search</Text>
						<Text size="12" weight="500" color="tertiary">Description about search</Text>
					</Flex>

					<Flex align="center" justify="between" :class="$style.bottom">
						<Text size="12" weight="600" color="tertiary">234 results</Text>

						<Flex align="center" gap="8">
							<Text size="11" weight="600" color="support"> <Text color="tertiary">Enter</Text> to open </Text>

							<Text size="11" weight="600" color="support"> <Text color="tertiary">Arrows</Text> to navigate </Text>
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
}

.popup {
	width: 450px;

	background: var(--card-background);
	box-shadow: inset 0 0 0 1px var(--op-5);
	border-radius: 8px;
}

.header {
	border-bottom: 1px solid var(--op-5);

	padding: 12px;
}

.inner {
	height: 120px;
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
</style>
