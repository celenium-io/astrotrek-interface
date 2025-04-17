export const space = (s) => {
	if (!s?.length) return ""
	return s.match(/.{1,4}/g).join(" ")
}

export const capitalize = (s) => {
	if (!s?.length) return ""
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export function base64Decode(encodedString) {
    return atob(encodedString);
}

export function capitalizeAndReplaceUnderscore(s) {
    if (!s?.length) return ""

    let words = s.split('_');
    let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    
    return capitalizedWords.join(' ');
}

export function pluralize(count, singular, plural = null, options) {
    const {
        withBe = false,
        tense = 'past',
        showCount = true,
    } = options

    const isSingular = count === 1
    const noun = isSingular ? singular : plural || singular + 's'
    let be = ''
    if (withBe) {
        if (tense === 'present') {
            be = isSingular ? 'is' : 'are'
        } else {
            be = isSingular ? 'was' : 'were'
        }
    }

    return `${showCount ? count : ''} ${noun} ${be}`.trim()
}
