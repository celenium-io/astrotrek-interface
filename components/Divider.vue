<template>
	<Flex direction="column" gap="6" :class="$style.wrapper">
		<Flex v-for="row in 3" align="center" wide :class="$style.row">
			<div v-for="dot in 48" :class="$style.dot" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	overflow: hidden;
}

.row {
	gap: 17px;
}

.row:nth-child(2) {
	margin-left: 11px;
}

.dot {
	width: 5px;
	height: 5px;

	border-radius: 50%;
	background: var(--op-8);
}
</style>
