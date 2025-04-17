import {
	base64Decode,
	capitalizeAndReplaceUnderscore,
	formatBytes,
	getNativeAsset,
	midHash,
	pluralize,
	shortHash,
	spaces,
	strToHex
} from "./index.js";

export const getActionTitle = (actionType) => {
	if (!actionType) return "Action"

	let title = ""
	switch (actionType) {
		case "ibc_relay":
			title = "IBC Relay"
			break;
		case "ibc_relayer_change":
			title = "IBC Relayer Change"
			break;
		case "ics20_withdrawal":
			title = "ICS20 Withdrawal"
			break;
		default:
			title = capitalizeAndReplaceUnderscore(actionType)
			break;
	}

	return title
}

export const getActionDescription = (action) => {
	if (!action) return ""

	let description = ""
	let data = action.data
	switch (action.type) {
		case "rollup_data_submission":
			description = `Pushed ${formatBytes(base64Decode(data.data).length)} to ${data.rollup_id}`
			break;
		case "transfer":
			description = `Sent ${spaces(data.amount)} NRIA to ${midHash(data.to)}`
			break;
		case "mint":
			description = `Minted ${spaces(data.amount)} NRIA to ${midHash(data.to)}`
			break;
		case "sudo_address_change":
			description = `Set ${midHash(data.new_address)} as new sudo address`
			break;
		case "validator_update":
			description = `Now validator ${strToHex(base64Decode(data.pubkey))} has power ${data.power}`
			break;
		case "ibc_relay":
			if (data.type) {
				let type = data.type.split('.')
				description = `${type[type.length - 1]}`
			} else {
				description = 'Action'
			}

			break;
		case "ibc_relayer_change":
			if (data.addition) {
				description = `${midHash(data.addition)} was added as IBC relayer`
			} else if (data.removal) {
				description = `${midHash(data.removal)} was removed as IBC relayer`
			}
			break;
		case "ics20_withdrawal":
			description = `Withdraw ${spaces(data.amount)} ${getAssetName(data.denom)} to ${midHash(data.destination_address)}`
			break;
		case "init_bridge_account":
			description = `Bridge account was initialized for ${data.rollup_id}`
			break;
		case "bridge_lock":
			description = `Transfer ${spaces(data.amount)} ${getAssetName(data.asset)} from sequencer to ${midHash(data.to)}`
			break;
		case "bridge_transfer":
			description = `Transfer ${spaces(data.amount)} ${getAssetName(data.fee_asset)} from ${midHash(data.bridge_address)} to ${midHash(data.to)}`
			break;
		case "bridge_unlock":
			description = `Unlock ${spaces(data.amount)} ${getAssetName(data.fee_asset)} to ${midHash(data.to)}`
			break;
		case "bridge_sudo_change_action":
			let actions = []
			if (data.sudo) {
				actions.push(`Sudo address for ${shortHash(data.bridge)} was changed to ${shortHash(data.sudo)}`)
			}
			if (data.withdrawer) {
				actions.push(`Withdrawer address for ${shortHash(data.bridge)} was changed to ${shortHash(data.withdrawer)}`)
			}
			if (data.fee_asset) {
				actions.push(`Fee asset address for ${shortHash(data.bridge)} was changed to ${getAssetName(data.fee_asset)}`)
			}

			for (let i = 0; i < actions.length; i++) {
				description = description + (i === 0 ? '' : ' | ') + actions[i]
			}
			break;
		case "fee_change":
			Object.keys(data).forEach(k => {
				description = `${capitalizeAndReplaceUnderscore(k)} was change to ${data[k]}`
			})
			break;
		case "fee_asset_change":
			if (data.addition) {
				description = `${midHash(data.addition)} was added for fee payments`
			} else if (data.removal) {
				description = `${midHash(data.removal)} was removed for fee payments`
			}
			break;
		case "price_feed":
			if (data.addition) {
				description = `${pluralize(data.addition.length, "pair", {withBe: true})} added`
			} else if (data.removal) {
				description = `${pluralize(data.removal.length, "pair", {withBe: true})} removed`
			} else if (data.create) {
				description = `${data.create.length} market map ${pluralize(data.create.length, "item", {withBe: true, showCount: false})} created`
			} else if (data.remove) {
				description = `${data.remove.length} market map ${pluralize(data.remove.length, "item", {withBe: true, showCount: false})} removed`
			} else if (data.update) {
				description = `${data.update.length} market map ${pluralize(data.update.length, "item", {withBe: true, showCount: false})} updated`
			} else if (data.params) {
				description = "Market configuration was changed"
			}
			break;
		default:
			break;
	}
	
	return description
}

export const getActionDataLength = (action) => {
	if (!action) return
	
	return formatBytes(base64Decode(action.data.data).length)
}

export const getAssetName = (asset) => {
	if (!asset?.length) return getAssetName(getNativeAsset())

	switch (asset) {
		case "nria":
			return "NRIA"
	
		default:
			return asset.substring(asset.lastIndexOf('/') + 1).toUpperCase()
	}
}
