export const Server = {
	API: {
		mainnet: "https://api-dusk.astrotrek.io/v1",
		dawn: "https://api-dawn.astrotrek.io/v1",
		dev: process.env.API_DEV || "https://api-dusk.astrotrek.io/v1",
	},
	WSS: {
		mainnet: "wss://api-dusk.astrotrek.io/v1/ws",
		dawn: "wss://api-dawn.astrotrek.io/v1/ws",
		dev: process.env.WSS_DEV || "wss://api-dusk.astrotrek.io/v1/ws",
	},
}

export const useServerURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "dusk.astrotrek.io":
			return Server.API.mainnet

		case "dawn.astrotrek.io":
			return Server.API.dawn

		default:
			return runtimeConfig.public.API_DEV || Server.API.dev
	}
}

export const useSocketURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "dusk.astrotrek.io":
			return Server.WSS.mainnet
			
		case "dawn.astrotrek.io":
			return Server.WSS.dawn

		default:
			return runtimeConfig.public.WSS_DEV || Server.WSS.dev
	}
}
