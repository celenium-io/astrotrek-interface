export const Server = {
	API: {
		mainnet: "https://api-dusk-8.astrotrek.io/v1",
		dev: process.env.API_DEV || "https://api-dusk-8.astrotrek.io/v1",
	},
	WSS: {
		mainnet: "wss://api-dusk-8.astrotrek.io/v1/ws",
		dev: process.env.WSS_DEV || "wss://api-dusk-8.astrotrek.io/v1/ws",
	},
}

export const useServerURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.API.mainnet

		default:
			return runtimeConfig.public.API_DEV || Server.API.dev
	}
}

export const useSocketURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.WSS.mainnet

		default:
			return runtimeConfig.public.WSS_DEV || Server.WSS.dev
	}
}
