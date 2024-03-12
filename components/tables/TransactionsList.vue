<script setup>
/** Services */
import { shortHash } from "@/services/utils"

/** UI */
import ActionsList from "@/components/shared/ActionsList.vue";

const props = defineProps({
	txs: {
		type: Array,
	},
})
</script>

<template>
    <Flex direction="column" gap="8">
        <NuxtLink v-for="t in txs.slice(0, Math.min(txs.length, 5))" :to="`/tx/${t.hash}`">
            <Outline wide height="32" padding="8" radius="6">
                <Flex justify="between" align="center" wide :class="$style.rows">
                    <Flex align="center" gap="8">
                        <Icon
                            name="tx"
                            size="12"
                            :color="t.status === 'success' ? 'green' : 'red'"
                        />

                        <Text size="12" weight="600" color="primary">{{ shortHash(t.hash) }}</Text>
                    </Flex>

                    <ActionsList :actions="t.action_types"></ActionsList>
                </Flex>
            </Outline>
        </NuxtLink>

        <Flex v-if="txs.length > 5" align="center" gap="6">
            <Icon name="help" size="12" color="tertiary" />
            <Text size="12" weight="500" color="tertiary">{{ txs.length - 5 }} more.</Text>
            <Text size="12" weight="500" color="support"> View all transactions on the block page </Text>
        </Flex>
    </Flex>
</template>

<style module>
.rows {
	padding-left: 8px;
}
</style>
