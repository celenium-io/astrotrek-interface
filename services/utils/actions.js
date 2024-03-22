import { base64Decode, capitalize, strToHex } from "./index.js";

export const getTitle = (action) => {
	if (!action) return "Action"

	let title = ""
	switch (action.type) {
		case "sudo_address_change":
			title = "Sudo Address Change"
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
		case "transfer":
			description = `Sent ${data.amount} to ${data.to}`
			break;
		case "mint":
			description = `Minted ${data.amount} to ${data.to}`
			break;
		case "sudo_address_change":
			description = `Set new sudo address as ${data.new_address}`
			break;
		case "sequence":
			description = `Pushed ${base64Decode(data.data).length} bytes to ${strToHex(base64Decode(data.rollup_id))}`
			break;
		default:
			break;
	}
	
	return description
}
