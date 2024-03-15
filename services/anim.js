let old = createNumberArray(5)

/**
 * Funktion zum erzeugen eines Array aus jeder einzelnen Stelle.
 * Dabei werden die Stellen immer auf 6 aufgerundet.
 * @example mit der Zahl 5
 * createNumberArray(5) => [0, 0, 0, 0, 0, 5]
 * @example mit der Zahl 552
 * createNumberArray(5) => [0, 0, 0, 5, 5, 2]
 * @param {number} number Die zu einem Array werden soll.
 */
function createNumberArray(number) {
	let isNegativ = false
	const numberArray = number.toString().split("")
	for (let i = 0; numberArray.length < 6; i++) {
		if (numberArray[0] === "-") {
			numberArray[0] = 0
			isNegativ = true
		}
		numberArray.unshift(0)
	}
	if (isNegativ) {
		numberArray.unshift("-")
	} else {
		numberArray.unshift("+")
	}
	return numberArray.map((x) => (x === "-" || x === "+" ? x : parseInt(x)))
}

function animateNumber(number, element) {
	element.innerHTML = ""
	const numberArray = createNumberArray(number)
	createNumberHTML(numberArray, old, element)
	const ticks = [...element.querySelectorAll("span[data-value]")]
	setTimeout(() => {
		for (let tick of ticks) {
			let dist = parseInt(tick.getAttribute("data-value") - 1)
			tick.style.transform = `translateY(-${dist * 100}%)`
		}
	}, 0)
	old = numberArray
}

function createNumberHTML(numbers, old, element) {
	for (let i = 0; i < numbers.length; i++) {
		if (isNaN(numbers[i]) || isNaN(old[i])) {
			element.insertAdjacentHTML(
				"beforeend",
				`<span data-value="${calcDeltaSight(old[i], numbers[i]).length}">${calcDeltaSight(old[i], numbers[i]).join("")}</span>`,
			)
		} else {
			element.insertAdjacentHTML(
				"beforeend",
				`<span data-value="${calcDeltaBetweenNumbers(old[i], numbers[i]).length}">${calcDeltaBetweenNumbers(
					old[i],
					numbers[i],
				).join("")}</span>`,
			)
		}
	}
	return element
}

function calcDeltaSight(oldSight, newSight) {
	return oldSight !== newSight ? [`<span>${oldSight}</span>`, `<span>${newSight}</span>`] : [`<span>${newSight}</span>`]
}

function calcDeltaBetweenNumbers(oldNumber, newNumber) {
	let numberArray = [oldNumber]
	let notFound = true
	if (oldNumber === newNumber) return numberArray.map((x) => `<span>${x}</span>`)
	while (notFound) {
		oldNumber++
		if (oldNumber > 9) oldNumber = 0
		numberArray.push(oldNumber)
		if (oldNumber === newNumber) notFound = false
	}
	return numberArray.map((x) => `<span>${x}</span>`)
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

setInterval(() => {
	const diff = randomNumber(-20, 20)
	document.querySelector(".diff").innerHTML = diff
	const value = parseInt(old.join("")) + diff
	animateNumber(value, document.querySelector(".numbers"))
}, 2500)
