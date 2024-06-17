/** Vendor */
import { DateTime } from "luxon"
import { ref } from "vue";

const CACHE_DURATION = 3_600_000
const cacheKey = 'lastSeries'

async function fetchSeries({ name, timeframe, from, to }) {
	try {
		const url = new URL(`https://api-dusk.astrotrek.io/v1/stats/series/${name}/${timeframe}`)

		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("to", to)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

async function fetchStatsSeries() {

    const loadSeries = async (name, period) => {
        let rawData = await fetchSeries({
            name: name,
            timeframe: period.timeframe,
            from: Math.round(DateTime.now().minus({
                    days: period.timeframe === "day" ? period.value : 0,
                    hours: period.timeframe === "hour" ? period.value : 0,
                }).ts / 1_000),
        })
    
        // let resultData = []
        // let seriesMap = {}

        // rawData.forEach((item) => {
        //     seriesMap[DateTime.fromISO(item.time).toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")] =
        //         item.value
        // })
    
        // for (let i = 1; i < period.value + 1; i++) {
        //     const dt = DateTime.now().minus({
        //         days: period.timeframe === "day" ? period.value - i : 0,
        //         hours: period.timeframe === "hour" ? period.value - i : 0,
        //     })
        //     resultData.push({
        //         date: dt.toJSDate(),
        //         value: parseInt(seriesMap[dt.toFormat(period.timeframe === "day" ? "y-LL-dd" : "y-LL-dd-HH")]) || 0,
        //     })
        // }

        return rawData
    }

    const series = ref(['data_size', 'tps', 'bps', 'tx_count', 'bytes_in_block'])

    const periods = ref([
        {
            title: '24h',
            value: 24,
            timeframe: 'hour',
        },
        {
            title: '7d',
            value: 7,
            timeframe: 'day',
        },
        {
            title: '31d',
            value: 31,
            timeframe: 'day',
        },
    ])

    let data = {}

    for (let p of periods.value) {
        let periodData = {}
        for (let s of series.value) {
            periodData[s] = await loadSeries(s, p)
        }

        data[p.title] = periodData
    }

    return data
}

export default defineEventHandler(async (event) => {
    let series = await useStorage('db').getItem(cacheKey)

    if (!series || DateTime.now().minus(series?.timestamp).ts > CACHE_DURATION) {
        const data = await fetchStatsSeries()

        data.timestamp = DateTime.now().ts
        
        await useStorage('db').setItem(cacheKey, data)
        
        series = data
    }

    return series
})
