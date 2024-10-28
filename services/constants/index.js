import { getNetworkName } from "@/services/utils"

export const ActionIconMap = {
	rollup_data_submission: "sequence",
	transfer: "transfer",
}

export const getCeleniumLink = () => {
	let network = getNetworkName()

	switch (network) {
		case "Mainnet":
			return "https://celenium.io/"
		case "Dusk":
			return "https://mocha.celenium.io/"
		case "Dawn":
			return "https://mocha.celenium.io/"
		default:
			return "https://celenium.io/"
	}
}
