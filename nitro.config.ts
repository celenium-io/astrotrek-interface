export default defineNitroConfig({
    "preset": "cloudflare-pages",
    storage: {
        db: {
            driver: 'fs',
            base: './storage/db'
        }
    }
})
