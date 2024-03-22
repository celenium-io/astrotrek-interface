import { base64Decode, capitalize, strToHex } from "./index.js";

export const getTitle = (action) => {
	if (!action) return "Action"

	let title = ""
	switch (action.type) {
		case "sudo_address_change":
			title = "Sudo Address Change"
			break;
		case "validator_update":
			title = "Validator Update"
			break;
		case "ibc_relay":
			title = "IBC Relay"
			break;
		case "ibc_relayer_change":
			title = "IBC Relayer Change"
			break;
		case "ics20_withdrawal":
			title = "ICS20 Withdrawal"
			break;
		case "init_bridge_account":
			title = "Init Bridge Account"
			break;
		case "bridge_lock":
			title = "Bridge Lock"
			break;
		case "fee_asset_change":
			title = "Fee Asset Change"
			break;
		default:
			title = capitalize(action.type)
			break;
	}

	return title
}

export const getDescription = (action) => {
	if (!action) return ""

	let description = ""
	let data = action.data
	switch (action.type) {
		case "sequence":
			description = `Pushed ${base64Decode(data.data).length} bytes to ${strToHex(base64Decode(data.rollup_id))}`
			break;
		case "transfer":
			description = `Sent ${data.amount} to ${data.to}`
			break;
		case "mint":
			description = `Minted ${data.amount} to ${data.to}`
			break;
		case "sudo_address_change":
			description = `Set ${data.new_address} as new sudo address`
			break;
		case "validator_update":
			description = `Now validator ${strToHex(base64Decode(data.pub_key))} has power ${data.power}`
			break;
		case "ibc_relay":
			description = `Action`
			break;
		case "ibc_relayer_change":
			if (data.addition) {
				description = `${data.addition} was added as IBC relayer`
			} else if (data.removal) {
				description = `${data.removal} was removed as IBC relayer`
			}
			break;
		case "ics20_withdrawal":
			description = `withdraw ${data.amount} ${data.denom} to ${data.destination_chain_address}`
			break;
		case "init_bridge_account":
			description = `Bridge account was initialized for ${strToHex(base64Decode(data.rollup_id))}`
			break;
		case "bridge_lock":
			description = `Transfer ${data.amount} from ${data.to} to ${data.destination_chain_address}`
			break;
		case "fee_asset_change":
			if (data.addition) {
				description = `${strToHex(base64Decode(data.addition))} was added for fee payments`
			} else if (data.removal) {
				description = `${strToHex(base64Decode(data.removal))} was removed for fee payments`
			}
			break;
		default:
			break;
	}
	
	return description
}
