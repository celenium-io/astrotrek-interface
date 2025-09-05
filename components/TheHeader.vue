<script setup>
/** UI */
import { Dropdown, DropdownDivider, DropdownItem, DropdownTitle } from "@/components/ui/Dropdown"

/** Services */
import { getNetworkName } from "@/services/utils/general"

/** Store */
import { useAppStore } from "@/store/app"
import { useModalsStore } from "@/store/modals"
const appStore = useAppStore()
const modalsStore = useModalsStore()

let removeOutside = null
const lastHead = computed(() => appStore.lastHead)
const isLoading = computed(() => (lastHead.value?.chain_id ? false : true))

const handleViewConstants = () => {
	modalsStore.open("constants")
}

const handleNavigate = (url) => {
	window.location.replace(url)
}

const selectedNetworkName = computed(() => getNetworkName())

const networks = ref([
	{
		name: "Mainnet",
		url: "https://astrotrek.io",
	},
	{
		name: "Dusk",
		url: "https://dusk.astrotrek.io",
		disabled: true,
	},
	{
		name: "Dawn",
		url: "https://dawn.astrotrek.io",
	},
])
</script>

<template>
	<Flex tag="header" ref="headerEl" justify="center" wide :class="$style.wrapper">
		<Flex align="center" justify="between" wide :class="$style.container">
			<Flex align="center" gap="8">
				<NuxtLink to="/" style="display: flex">
					<Icon name="logo" size="18" color="black" :class="$style.logo" />
				</NuxtLink>

				<Flex
					@click="appStore.showNavigation = !appStore.showNavigation"
					align="center"
					justify="center"
					style="display: none"
					:class="$style.menu_btn"
				>
					<Icon :name="appStore.showNavigation ? 'close' : 'menu'" size="16" color="secondary" />
				</Flex>
			</Flex>

			<SearchField :disabled="isLoading" />

			<Dropdown>
				<Flex align="center" gap="8" :class="$style.network">
					<Icon name="globe" size="12" :color="lastHead.synced ? 'green' : 'red'" />
					<Text size="13" weight="600" color="primary" :class="$style.network_name"> {{ selectedNetworkName }} </Text>
					<Icon name="chevron" size="14" color="tertiary" />
				</Flex>

				<template #popup>
					<DropdownTitle @click="handleViewConstants" :style="{ cursor: 'pointer' }">
						<Flex gap="8">
							<div
								:class="$style.dot"
								:style="{ background: `${lastHead.synced ? 'var(--green)' : 'var(--red)'}`, marginTop: '3px' }"
							/>

							<Flex direction="column" gap="6">
								<Text color="secondary">Head {{ lastHead.synced ? "" : "not" }} synced </Text>
								<Text color="tertiary">{{ lastHead.chain_id }}</Text>
							</Flex>
						</Flex>
					</DropdownTitle>

					<DropdownDivider />

					<DropdownItem v-for="n in networks.filter((el) => el.name !== selectedNetworkName)" @click="handleNavigate(n.url)" :disabled="n.disabled">
						{{ n.name }}
					</DropdownItem>
				</template>
			</Dropdown>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;

	height: 62px;

	border-bottom: 2px solid var(--op-5);
}

.container {
	max-width: var(--base-width);

	margin: 0 24px;
}

.menu_btn {
	width: 24px;
	height: 24px;

	background: var(--op-10);
	border-radius: 6px;
	cursor: pointer;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-15);
	}
}

.logo {
	box-sizing: content-box;
	background: var(--brand);
	cursor: pointer;
	border-radius: 8px;

	padding: 3px;
}

.link {
	padding: 16px 0;

	cursor: pointer;
}

.network {
	height: 28px;

	border-radius: 6px;
	background: var(--op-8);
	cursor: pointer;

	padding: 0 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
	}
}

.dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

@media (max-width: 700px) {
	.logo_name {
		display: none;
	}
}

@media (max-width: 650px) {
	.network_name {
		display: none;
	}
}

@media (max-width: 600px) {
	.menu_btn {
		display: flex !important;
	}
}

@media (max-width: 500px) {
	.container {
		margin: 0 12px;
	}
}
</style>
