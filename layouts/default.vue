<template>
	<Flex direction="column">
		<Flex direction="column" align="center" :class="$style.wrapper">
			<TheHeader />
			
			<Flex align="center" justify="center" gap="12" wide :class="$style.notification">
				<Icon name="alert" size="36" color="yellow" />

				<Text size="16" color="yellow" weight="600">
					The Astrotrek service for the Astria Dusk Devnet has been discontinued due to the decommissioning of the network.
				</Text>
			</Flex>
			
			<Navigation />
			<Feed />

			<slot />
		</Flex>

		<TheFooter />
	</Flex>
</template>

<style module>
.wrapper {
	min-height: calc(100vh - 272px);

	z-index: 1;
}

.notification {
	padding: 12px;
	margin-bottom: 12px;
}
</style>
