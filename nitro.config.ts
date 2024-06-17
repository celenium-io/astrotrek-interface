export default defineNitroConfig({
    storage: {
        db: {
            driver: 'fs',
            base: './storage/db'
        }
    }
})
