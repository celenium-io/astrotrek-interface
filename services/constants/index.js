export const ActionIconMap = {
	rollup_data_submission: "sequence",
	transfer: "transfer",
}

export const getCeleniumLink = (network) => {
	switch (network) {
		case "mainnet":
			return "https://celenium.io/"
		case "mocha":
			return "https://mocha.celenium.io/"
		case "arabica":
			return "https://arabica.celenium.io/"
		default:
			return "https://celenium.io/";
	}
}
