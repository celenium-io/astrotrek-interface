import { base64Decode, capitalize, capitalizeAndReplaceUnderscore, formatBytes, midHash, shortHash, spaces, strToHex } from "./index.js";

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
		case "sequence":
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
			description = `Withdraw ${spaces(data.amount)} ${data.denom} to ${midHash(data.destination_chain_address)}`
			break;
		case "init_bridge_account":
			description = `Bridge account was initialized for ${data.rollup_id}`
			break;
		case "bridge_lock":
			description = `Transfer ${spaces(data.amount)} ${(data.asset).toUpperCase()} from sequencer to ${midHash(data.to)}`
			break;
		case "bridge_unlock":
			description = `Unlock ${spaces(data.amount)} ${data.fee_asset.toUpperCase()} to ${midHash(data.to)}`
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
				actions.push(`Fee asset address for ${shortHash(data.bridge)} was changed to ${data.fee_asset.toUpperCase()}`)
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
		default:
			break;
	}
	
	return description
}

export const getActionDataLength = (action) => {
	if (!action) return
	
	return formatBytes(base64Decode(action.data.data).length)
}
