/** Vendor */
import { DateTime } from "luxon"
import { ref } from "vue"

/** Services */
import { useServerURL } from "../../services/config.js";

const CACHE_DURATION = 3_600_000
const series = ref({})

async function fetchSeries({ hostname, name, timeframe, from, to }) {
	try {
		const url = new URL(`${useServerURL(hostname)}/stats/series/${name}/${timeframe}`)

		if (from) url.searchParams.append("from", from)
		if (to) url.searchParams.append("to", to)

		const data = await $fetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

async function fetchStatsSeries(hostname) {

    const loadSeries = async (name, period) => {
        let rawData = await fetchSeries({
            hostname: hostname,
            name: name,
            timeframe: period.timeframe,
            from: Math.round(DateTime.now().minus({
                    days: period.timeframe === "day" ? period.value : 0,
                    hours: period.timeframe === "hour" ? period.value : 0,
                }).ts / 1_000),
        })
    
        return rawData
    }

    const seriesList = ref(['data_size', 'tps', 'bps', 'tx_count', 'bytes_in_block'])

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
        for (let s of seriesList.value) {
            periodData[s] = await loadSeries(s, p)
        }

        data[p.title] = periodData
    }

    return data
}

export default defineEventHandler(async (event) => {
    if (!series.value?.data || DateTime.now().minus(series.value?.timestamp).ts > CACHE_DURATION) {
        const data = await fetchStatsSeries(event.node.req.headers.host)

        data.timestamp = DateTime.now().ts
        
        series.value = data
    }

    return series.value
})
