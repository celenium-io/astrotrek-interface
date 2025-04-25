<script setup>
/** Services */
import { abbreviate } from "@/services/utils"
import { getAssetName } from "@/services/utils/actions.js"

const props = defineProps({
	assets: {
		type: Array,
	},
	sort: {
		type: Object,
		required: false,
	},
	isLoading: {
		type: Boolean,
	},
})

const emit = defineEmits(["onSort"])
const handleSort = (by) => {
	emit("onSort", {
		by: by,
		dir: props.sort?.by === by ? (props.sort?.dir === "asc" ? "desc" : "asc") : "asc",
	})
}
</script>

<template>
	<Flex direction="column" :class="$style.wrapper">
		<Flex v-if="isLoading" direction="column" align="center" gap="16" :class="$style.loading">
			<Spinner size="16" />

			<Flex direction="column" align="center" gap="8">
				<Text size="14" weight="500" color="primary">Fetching assets...</Text>
				<Text size="13" weight="500" color="tertiary">It's almost done</Text>
			</Flex>
		</Flex>

		<table v-else-if="assets.length" :class="$style.table">
			<thead>
				<tr>
					<th><Text size="13" weight="600" color="tertiary">Asset Name</Text></th>
					<th @click="handleSort('supply')" :class="$style.sortable">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="tertiary">Supply</Text>
							<Icon
								v-if="sort?.by === 'supply'"
								name="chevron"
								size="12"
								color="secondary"
								:style="{ transform: `rotate(${sort?.dir === 'asc' ? '180' : '0'}deg)` }"
							/>
						</Flex>
					</th>
					<th @click="handleSort('transferred')" :class="$style.sortable">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="tertiary">Transfers Amount</Text>
							<Icon
								v-if="sort?.by === 'transferred'"
								name="chevron"
								size="12"
								color="secondary"
								:style="{ transform: `rotate(${sort?.dir === 'asc' ? '180' : '0'}deg)` }"
							/>
						</Flex>
					</th>
					<th @click="handleSort('transfer_count')" :class="$style.sortable">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="tertiary">Transfers</Text>
							<Icon
								v-if="sort?.by === 'transfer_count'"
								name="chevron"
								size="12"
								color="secondary"
								:style="{ transform: `rotate(${sort?.dir === 'asc' ? '180' : '0'}deg)` }"
							/>
						</Flex>
					</th>
					<th @click="handleSort('fee')" :class="$style.sortable">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="tertiary">Fees Amount</Text>
							<Icon
								v-if="sort?.by === 'fee'"
								name="chevron"
								size="12"
								color="secondary"
								:style="{ transform: `rotate(${sort?.dir === 'asc' ? '180' : '0'}deg)` }"
							/>
						</Flex>
					</th>
					<th @click="handleSort('fee_count')" :class="$style.sortable">
						<Flex align="center" gap="6">
							<Text size="13" weight="600" color="tertiary">Fees</Text>
							<Icon
								v-if="sort?.by === 'fee_count'"
								name="chevron"
								size="12"
								color="secondary"
								:style="{ transform: `rotate(${sort?.dir === 'asc' ? '180' : '0'}deg)` }"
							/>
						</Flex>
					</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="ass in assets">
					<td>
						<Flex align="start" direction="column" gap="4">
							<Text size="13" weight="600" color="primary"> {{ getAssetName(ass.asset) }} </Text>
							<Text size="12" color="secondary"> {{ ass.asset }} </Text>
						</Flex>
					</td>
					<td>
						<Flex align="center">
							<Text size="13" weight="600" color="primary"> {{ abbreviate(ass.supply) }} </Text>
						</Flex>
					</td>
					<td>
						<Flex align="center">
							<Text size="13" weight="600" color="primary"> {{ abbreviate(ass.transferred) }} </Text>
						</Flex>
					</td>
					<td>
						<Flex align="center">
							<Text size="13" weight="600" color="primary"> {{ abbreviate(ass.transfer_count) }} </Text>
						</Flex>
					</td>
					<td>
						<Flex align="center">
							<Text size="13" weight="600" color="primary"> {{ abbreviate(ass.fee) }} </Text>
						</Flex>
					</td>
					<td>
						<Flex align="center">
							<Text size="13" weight="600" color="primary"> {{ abbreviate(ass.fee_count) }} </Text>
						</Flex>
					</td>
				</tr>
			</tbody>
		</table>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;
	overflow-x: auto;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateY(-30%) translateX(-50%);
}

.table {
	width: 100%;
	height: fit-content;

	border-spacing: 0px;
	& tbody {
		& tr {
			transition: all 0.05s ease;

			&:hover {
				background: var(--op-5);
			}

			&:last-child {
				& td:first-child {
					border-bottom-left-radius: 8px;
				}
				& td:last-child {
					border-bottom-right-radius: 8px;
				}
			}
		}
	}

	& tr th {
		text-align: left;
		padding: 0;
		padding-right: 16px;
		padding-top: 16px;
		padding-bottom: 12px;

		text-wrap: nowrap;

		&:first-child {
			padding-left: 16px;
		}

		& span {
			display: flex;
		}

		&.sortable {
			cursor: pointer;
		}
	}

	& tr td {
		padding: 0;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-right: 24px;

		border-top: 1px solid var(--op-5);

		white-space: nowrap;

		&:first-child {
			padding-left: 16px;
		}
	}
}

@media (max-width: 1000px) {
	.wrapper {
		width: 100%;
	}
}
</style>
