export default defineNuxtConfig({
 modules: ["@pinia/nuxt"],

 app: {
					head: {
									htmlAttrs: {
													lang: "en",
									},
									meta: [
													{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
													{
																	name: "lang",
																	content: "en",
													},
									],
									link: [
													{
																	id: "favicon",
																	rel: "icon",
																	type: "image/png",
													},
													{
																	rel: "preconnect",
																	href: "https://fonts.googleapis.com",
													},
													{
																	rel: "preconnect",
																	href: "https://fonts.gstatic.com",
																	crossorigin: "anonymous",
													},
													{
																	rel: "preload",
																	as: "style",
																	href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap",
																	onload: "this.onload=null;this.rel='stylesheet'",
													},
									],
					},
	},

 css: ["@/assets/styles/base.scss", "@/assets/styles/flex.scss", "@/assets/styles/text.scss"],
 devtools: { enabled: true },

 runtimeConfig: {
					public: {
									API_DEV: process.env.API_DEV,
									WSS_DEV: process.env.WSS_DEV,
					},
	},

 compatibilityDate: "2025-01-27",
})