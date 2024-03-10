<script setup>
/** Services */
import { capitalize, midHash, shortHash, splitAddress } from "@/services/utils"

/** UI */
import ActionsList from "@/components/shared/ActionsList.vue";

/** Store */
import { useSidebarsStore } from "@/store/sidebars"
const sidebarsStore = useSidebarsStore()

const props = defineProps({
	txs: {
		type: Array,
	},
})
</script>

<template>
    <Flex direction="column" gap="8">
        <NuxtLink v-for="t in txs.slice(0, 5)" :to="`/tx/${t.hash}`">
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
                    <!-- <Flex v-if="t.actions_count" align="center" gap="6">
                        <Text size="12" height="160" weight="600" color="tertiary">
                            {{ capitalize(t.action_types[0]) }}
                        </Text>
                        <Text
                            v-if="t.actions_count > 1"
                            size="12"
                            weight="600"
                            color="primary"
                            :class="$style.badge"
                        >
                            +{{ t.actions_count - 1 }}
                        </Text>
                    </Flex> -->
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
