<script setup>
/** Store */
import { useAppStore } from "@/store/app"
const appStore = useAppStore()

const links = [
	{
		name: "Dashboard",
		path: "/",
		icon: "layout",
	},
	{
		name: "Blocks",
		path: "/blocks",
		icon: "block",
	},
	{
		name: "Transactions",
		path: "/txs",
		icon: "tx",
	},
	{
		name: "Rollups",
		path: "/rollups",
		icon: "rollup",
	},
	{
		name: "Accounts",
		path: "/accounts",
		icon: "account",
	},
	{
		name: "Validators",
		path: "/validators",
		icon: "validator",
	},
	{
		name: "Statistics",
		path: "/stats",
		icon: "bar-chart",
	},
	{
		name: "Applications",
		path: "/apps",
		icon: "app",
	},
	{
		name: "Assets",
		path: "/assets",
		icon: "coin",
	},
]
</script>

<template>
	<Flex
		@click="appStore.showNavigation = false"
		wide
		justify="center"
		:class="[$style.wrapper, appStore.showNavigation && $style.showMobile]"
	>
		<Flex wide justify="between" gap="16" :class="$style.content">
			<Flex wrap="wrap" gap="8" :class="$style.links">
				<NuxtLink v-for="link in links" :to="link.path" :class="$style.link" :active-class="$style.activeLink">
					<Flex align="center" gap="6">
						<Icon :name="link.icon" size="14" />
						<Text size="13" weight="600">{{ link.name }}</Text>
					</Flex>
				</NuxtLink>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	border-bottom: 1px solid var(--op-5);
}

.content {
	max-width: var(--base-width);

	margin: 6px 24px;
}

.links {
	margin: 0 -8px;
}

.link {
	display: flex;
	justify-content: center;
	min-height: 28px;

	color: var(--txt-secondary);

	user-select: none;
	cursor: pointer;
	border-radius: 8px;
	padding: 0 8px;

	& svg {
		fill: var(--txt-tertiary);

		transition: fill 0.2s ease;
	}

	&:hover {
		background: linear-gradient(var(--op-5), transparent);
	}

	&.activeLink:hover {
		background: linear-gradient(var(--op-10), var(--op-8));
	}
}

.activeLink {
	color: var(--txt-primary);
	background: linear-gradient(var(--op-10), var(--op-8));

	& svg {
		fill: var(--brand);
	}
}

@media (max-width: 600px) {
	.wrapper {
		display: none;
	}

	.wrapper.showMobile {
		display: flex;
		position: absolute;
		top: 62px;
		z-index: 100;

		background: var(--app-background);

		.content {
			flex-direction: column;
			align-items: center;
		}

		.links {
			width: 100%;

			flex-direction: column;
		}

		.link {
			min-height: 32px;

			justify-content: flex-start;
		}

		.tools_list {
			display: flex !important;
		}

		.tools_dropdown {
			display: none;
		}
	}
}

@media (max-width: 500px) {
	.content {
		margin: 6px 12px;
	}
}
</style>
