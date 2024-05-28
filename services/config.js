export const Server = {
	API: {
		mainnet: "https://api-dusk.astrotrek.io/v1",
		dev: process.env.API_DEV || "https://api-dusk.astrotrek.io/v1",
	},
	WSS: {
		mainnet: "wss://api-dusk.astrotrek.io/v1/ws",
		dev: process.env.WSS_DEV || "wss://api-dusk.astrotrek.io/v1/ws",
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
