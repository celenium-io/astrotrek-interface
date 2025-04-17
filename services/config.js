export const Server = {
	API: {
		mainnet: "https://api.astrotrek.io/v1",
		dusk: "https://api-dusk.astrotrek.io/v1",
		dawn: "https://api-dawn.astrotrek.io/v1",
		dev: process.env.API_DEV || "https://api-dusk.astrotrek.io/v1",
	},
	WSS: {
		mainnet: "wss://api.astrotrek.io/v1/ws",
		dusk: "wss://api-dusk.astrotrek.io/v1/ws",
		dawn: "wss://api-dawn.astrotrek.io/v1/ws",
		dev: process.env.WSS_DEV || "wss://api-dusk.astrotrek.io/v1/ws",
	},
}

export const useServerURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.API.mainnet

		case "dusk.astrotrek.io":
			return Server.API.dusk

		case "dawn.astrotrek.io":
			return Server.API.dawn

		default:
			return runtimeConfig.public.API_DEV || Server.API.dusk
	}
}

export const useSocketURL = () => {
	const requestURL = useRequestURL()
	const runtimeConfig = useRuntimeConfig()

	switch (requestURL.hostname) {
		case "astrotrek.io":
			return Server.WSS.mainnet
			
		case "dusk.astrotrek.io":
			return Server.WSS.dusk
			
		case "dawn.astrotrek.io":
			return Server.WSS.dawn

		default:
			return runtimeConfig.public.WSS_DEV || Server.WSS.dusk
	}
}
