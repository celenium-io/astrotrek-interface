export const Server = {
	API: {
		mainnet: "https://api-dusk-test.astrotrek.io/v1",
		dev: "https://api-dusk-test.astrotrek.io/v1",
	},
	WSS: {
		mainnet: "wss://api-dusk-test.astrotrek.io/v1/ws",
		dev: "wss://api-dusk-test.astrotrek.io/v1/ws",
	},
}

export const useServerURL = () => {
	const requestURL = useRequestURL()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.API.mainnet

		default:
			return Server.API.dev
	}
}

export const useSocketURL = () => {
	const requestURL = useRequestURL()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.WSS.mainnet

		default:
			return Server.WSS.dev
	}
}
