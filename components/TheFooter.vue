<script setup>
/** Store */
import { useModalsStore } from "@/store/modals"
const modalsStore = useModalsStore()

const classes = useCssModule()

const appConfig = useAppConfig()

const show = ref(false)

const handleViewConstants = () => {
	modalsStore.open("constants")
}

const isAnimationBlocked = ref(false)
const svgEl = useTemplateRef("svgEl")
const defsEl = useTemplateRef("defsEl")
const pos = reactive({
	x: 0,
	y: 0,
})
const handlePatternClick = (e) => {
	if (isAnimationBlocked.value) return

	isAnimationBlocked.value = true
	setTimeout(() => {
		isAnimationBlocked.value = false
	}, 500)

	pos.x = e.layerX
	pos.y = e.layerY

	const id = new Date().getTime()
	const svgns = "http://www.w3.org/2000/svg"

	const newMask = document.createElementNS(svgns, "mask")
	newMask.setAttribute("id", `waveMask_${id}`)

	const maskGroup = document.createElementNS(svgns, "g")
	maskGroup.setAttribute("transform-origin", `${e.layerX}px ${e.layerY}px`)
	maskGroup.setAttribute("transform-box", "fill-box")
	const newMaskCircle = document.createElementNS(svgns, "circle")
	newMaskCircle.setAttribute("cx", `${e.layerX}px`)
	newMaskCircle.setAttribute("cy", `${e.layerY}px`)
	newMaskCircle.setAttribute("r", "74")
	newMaskCircle.setAttribute("stroke", "#fff")
	newMaskCircle.setAttribute("stroke-width", "24")
	newMaskCircle.setAttribute("fill", "transparent")
	newMaskCircle.setAttribute("style", "filter: blur(12px); opacity: 0.1;")
	const animateMaskCircle = document.createElementNS(svgns, "animateTransform")
	animateMaskCircle.setAttribute("attributeName", "transform")
	animateMaskCircle.setAttribute("attributeType", "XML")
	animateMaskCircle.setAttribute("type", "scale")
	animateMaskCircle.setAttribute("from", ".2")
	animateMaskCircle.setAttribute("to", "35")
	animateMaskCircle.setAttribute("begin", "indefinite")
	animateMaskCircle.setAttribute("dur", "5s")
	maskGroup.appendChild(newMaskCircle)
	maskGroup.appendChild(animateMaskCircle)
	newMask.appendChild(maskGroup)
	defsEl.value.appendChild(newMask)
	const rectMask = document.createElementNS(svgns, "rect")
	rectMask.setAttribute("width", "100%")
	rectMask.setAttribute("height", "100%")
	rectMask.setAttribute("fill", "url(#logoPattern)")
	rectMask.setAttribute("mask", `url(#waveMask_${id})`)
	svgEl.value.appendChild(rectMask)
	animateMaskCircle.beginElement()

	setTimeout(() => {
		svgEl.value.removeChild(rectMask)
		defsEl.value.removeChild(newMask)
	}, 4_900)
}
</script>

<template>
	<Flex tag="footer" justify="center" :class="$style.wrapper">
		<Flex justify="between" wide :class="[$style.container]">
			<Flex direction="column" gap="20" :class="$style.left">
				<Flex align="center" gap="8">
					<Icon @click="show = true" name="logo" size="18" color="black" :class="$style.logo" />

					<svg
						width="117"
						height="18"
						viewBox="0 0 117 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						:class="$style.logo_name"
					>
						<path
							d="M2.88 17H0L7.176 0.92H10.824L18 17H15.072L13.224 12.824H4.728L2.88 17ZM7.944 5.6L5.76 10.496H12.192L10.008 5.6L9.072 3.32H8.88L7.944 5.6ZM24.84 17.24C21 17.24 18.816 15.728 18.816 12.968V12.896H21.408V13.088C21.408 14.648 22.344 15.152 24.84 15.152C27.168 15.152 27.864 14.672 27.864 13.616C27.864 12.632 27.288 12.32 25.584 12.08L22.32 11.648C20.064 11.36 18.696 10.4 18.696 8.408C18.696 6.32 20.592 4.832 24.264 4.832C27.912 4.832 30.12 6.296 30.12 9.128V9.2H27.552V9.056C27.552 7.64 26.832 6.896 24.192 6.896C22.008 6.896 21.24 7.376 21.24 8.504C21.24 9.44 21.72 9.776 23.52 10.016L26.28 10.4C29.112 10.76 30.408 11.72 30.408 13.688C30.408 15.92 28.2 17.24 24.84 17.24ZM40.1021 17H37.3661C34.7981 17 33.2141 15.872 33.2141 12.968V7.232H31.1981V5.072H33.2141V2.456H35.7821V5.072H40.1021V7.232H35.7821V12.824C35.7821 14.288 36.4541 14.672 37.9421 14.672H40.1021V17ZM44.3154 17H41.7234V5.072H44.0994V8.288H44.2674C44.6274 6.368 45.9234 4.832 48.3714 4.832C51.0834 4.832 52.2594 6.776 52.2594 9.032V10.592H49.6914V9.536C49.6914 7.832 48.9714 7.04 47.1954 7.04C45.1554 7.04 44.3154 8.168 44.3154 10.304V17ZM59.9835 17.24C56.0235 17.24 53.3595 14.72 53.3595 11.048C53.3595 7.328 56.0235 4.832 59.9835 4.832C63.9675 4.832 66.6315 7.328 66.6315 11.048C66.6315 14.72 63.9675 17.24 59.9835 17.24ZM59.9835 14.936C62.8875 14.936 64.0875 13.568 64.0875 11.048C64.0875 8.504 62.8875 7.112 59.9835 7.112C57.1035 7.112 55.9035 8.504 55.9035 11.048C55.9035 13.568 57.1035 14.936 59.9835 14.936ZM76.3365 17H73.6005C71.0325 17 69.4485 15.872 69.4485 12.968V7.232H67.4325V5.072H69.4485V2.456H72.0165V5.072H76.3365V7.232H72.0165V12.824C72.0165 14.288 72.6885 14.672 74.1765 14.672H76.3365V17ZM80.5498 17H77.9578V5.072H80.3338V8.288H80.5018C80.8618 6.368 82.1578 4.832 84.6058 4.832C87.3178 4.832 88.4938 6.776 88.4938 9.032V10.592H85.9258V9.536C85.9258 7.832 85.2058 7.04 83.4298 7.04C81.3898 7.04 80.5498 8.168 80.5498 10.304V17ZM96.1219 17.24C92.2099 17.24 89.6419 15.032 89.6419 11.048C89.6419 7.328 92.1859 4.832 96.0739 4.832C99.7699 4.832 102.29 6.872 102.29 10.496C102.29 10.928 102.266 11.264 102.194 11.624H92.0659C92.1619 13.928 93.2899 15.152 96.0499 15.152C98.5459 15.152 99.5779 14.336 99.5779 12.92V12.728H102.17V12.944C102.17 15.488 99.6739 17.24 96.1219 17.24ZM96.0259 6.872C93.3859 6.872 92.2339 8.048 92.0899 10.184H99.8419V10.136C99.8419 7.928 98.5699 6.872 96.0259 6.872ZM106.823 17H104.231V0.92H106.823V9.8H110.231L113.807 5.072H116.831L112.343 10.808L116.807 17H113.759L110.231 12.128H106.823V17Z"
							fill="white"
							fill-opacity="0.8"
						/>
					</svg>
				</Flex>

				<Text size="14" weight="500" align="center" color="tertiary" style="line-height: 16px">
					Blockchain explorer for the shared sequencer network
				</Text>

				<Flex align="center" gap="16">
					<NuxtLink to="https://x.com/astrotrek_io" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="twitter" size="16" color="primary" />
						</Flex>
					</NuxtLink>
					<NuxtLink to="https://github.com/celenium-io/astrotrek-interface" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="github" size="16" color="primary" />
						</Flex>
					</NuxtLink>
					<NuxtLink to="https://discord.com/channels/846362414039695391/1168936555302355005" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="discord" size="16" color="primary" />
						</Flex>
					</NuxtLink>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="24" :class="$style.right">
				<Flex align="center" gap="16" wrap="wrap" :class="$style.links">
					<NuxtLink to="/blocks">
						<Text size="13" weight="500" color="secondary">Blocks</Text>
					</NuxtLink>
					<NuxtLink to="/txs">
						<Text size="13" weight="500" color="secondary">Transactions</Text>
					</NuxtLink>
					<NuxtLink to="/accounts">
						<Text size="13" weight="500" color="secondary">Accounts</Text>
					</NuxtLink>
					<NuxtLink to="/validators">
						<Text size="13" weight="500" color="secondary">Validators</Text>
					</NuxtLink>
					<NuxtLink to="/rollups">
						<Text size="13" weight="500" color="secondary">Rollups</Text>
					</NuxtLink>
					<Text @click="handleViewConstants" size="13" weight="500" color="secondary" :style="{ cursor: 'pointer' }"
						>Constants</Text
					>
				</Flex>
				<Flex align="center" gap="16" :class="$style.links">
					<a href="/privacy-policy">
						<Text size="13" weight="500" color="secondary">Privacy Policy</Text>
					</a>
					<a href="/terms-of-use">
						<Text size="13" weight="500" color="secondary">Terms of use</Text>
					</a>
				</Flex>

				<a href="https://bakingbad.dev" target="_blank" style="line-height: 100%">
					<Text size="12" weight="600" color="tertiary" mono>Made by <Text color="secondary">Bakind Bad</Text> </Text>
				</a>
			</Flex>

			<svg ref="svgEl" @click="handlePatternClick" width="1296" height="360" view-box="0 0 1296 360" :class="$style.wave_container">
				<defs ref="defsEl">
					<pattern id="logoPattern" viewBox="0,0,40,40" width="40" height="40" patternUnits="userSpaceOnUse">
						<path
							d="M20.7998 8C24.7199 8 26.6804 7.99987 28.1777 8.7627C29.4949 9.43381 30.5662 10.5051 31.2373 11.8223C32.0001 13.3196 32 15.2801 32 19.2002V20.7998C32 24.7199 32.0001 26.6804 31.2373 28.1777C30.5662 29.4949 29.4949 30.5662 28.1777 31.2373C26.6804 32.0001 24.7199 32 20.7998 32H19.2002C15.2801 32 13.3196 32.0001 11.8223 31.2373C10.5051 30.5662 9.43381 29.4949 8.7627 28.1777C7.99987 26.6804 8 24.7199 8 20.7998V19.2002C8 15.2801 7.99987 13.3196 8.7627 11.8223C9.43381 10.5051 10.5051 9.43381 11.8223 8.7627C13.3196 7.99987 15.2801 8 19.2002 8H20.7998ZM27.5342 19.5303C26.9482 20.0659 26.242 20.4533 25.4756 20.6602L21.3818 28.0303C21.3062 28.1746 21.2893 28.3428 21.3359 28.499C21.3827 28.6553 21.4893 28.787 21.6318 28.8662C21.7745 28.9454 21.9422 28.9658 22.0996 28.9229C22.257 28.8799 22.392 28.7774 22.4746 28.6367L27.5342 19.5303ZM13.7246 25.3916C13.6143 25.5101 13.5548 25.6673 13.5576 25.8291C13.5606 25.9909 13.6258 26.1453 13.7402 26.2598C13.8547 26.3742 14.0091 26.4394 14.1709 26.4424C14.3327 26.4452 14.4899 26.3857 14.6084 26.2754L21.0996 19.7832C20.7699 19.5267 20.4733 19.2301 20.2168 18.9004L13.7246 25.3916ZM21.1006 19.7832C21.7122 20.258 22.4264 20.5842 23.1855 20.7363C23.9445 20.8884 24.7284 20.8625 25.4756 20.6602L26.1836 19.3867C26.0445 19.3134 25.8858 19.227 25.7109 19.1221C25.1251 18.7704 24.3521 18.2258 23.4746 17.4092L21.1006 19.7832ZM19.3398 14.5254C19.1373 15.2725 19.1119 16.0564 19.2637 16.8154C19.4155 17.5746 19.7414 18.2886 20.2158 18.9004L22.5908 16.5254C21.7742 15.6479 21.2297 14.8749 20.8789 14.2891C20.774 14.1141 20.6858 13.9555 20.6133 13.8164L19.3398 14.5254ZM24.5352 10.8477C23.3416 10.7591 22.1559 11.1012 21.1934 11.8125L21.2568 12.0293L21.4932 12.7412L21.4961 12.7471L21.5098 12.7842C21.5239 12.82 21.5472 12.8786 21.583 12.9561C21.653 13.1119 21.7711 13.3474 21.9502 13.6465C22.3102 14.2448 22.9199 15.1026 23.9082 16.0918C24.8974 17.0801 25.7552 17.6898 26.3535 18.0498C26.6535 18.229 26.8891 18.347 27.0449 18.417C27.1132 18.4483 27.1827 18.4771 27.2529 18.5039L27.2578 18.5059L27.9707 18.7432L28.1924 18.7988C28.9019 17.835 29.2421 16.6484 29.1514 15.4551C29.0606 14.2618 28.5452 13.1404 27.6982 12.2949C26.8512 11.4494 25.7287 10.9362 24.5352 10.8477ZM11.3633 17.5254C11.2226 17.608 11.1201 17.743 11.0771 17.9004C11.0342 18.0578 11.0546 18.2255 11.1338 18.3682C11.213 18.5107 11.3447 18.6173 11.501 18.6641C11.6572 18.7107 11.8254 18.6938 11.9697 18.6182L19.3398 14.5254C19.5468 13.759 19.9342 13.0528 20.4697 12.4668L11.3633 17.5254Z"
							fill="#fff"
						/>
					</pattern>
				</defs>
			</svg>
		</Flex>
	</Flex>
</template>

<style module lang="scss">
.wrapper {
	margin-top: 120px;
}

.container {
	position: relative;

	max-width: var(--base-width);

	padding: 24px 0;
	margin: 0 24px;

	&::before {
		content: "";
		position: absolute;
		top: -224px;
		left: -128px;
		right: -128px;
		bottom: 16px;
		z-index: -1;

		background-image: url("@/assets/logo.svg");
		background-repeat: repeat;
		background-size: 40px 40px;
		mask-image: radial-gradient(ellipse at 50% 100%, black 0%, transparent 75%);
		opacity: 0.1;
		pointer-events: none;
	}
}

.left,
.right {
	z-index: 1;
}

.wave_container {
	position: absolute;
	top: -224px;
	left: -128px;
	right: -128px;
	bottom: 16px;
	z-index: 0;
}

.logo {
	box-sizing: content-box;
	background: var(--txt-tertiary);
	border-radius: 8px;

	padding: 3px;

	transition: all 0.2s ease;
}

.logo_name {
	fill: var(--logo-name);
}

.social {
	width: 24px;
	height: 24px;

	border-radius: 7px;
	background: var(--op-10);
}

.links {
	& a {
		display: flex;
	}
}

@media (max-width: 800px) {
	.container {
		flex-direction: column;
		gap: 40px;
	}

	.right {
		align-items: center;
	}

	.left {
		align-items: center;
	}

	.links {
		justify-content: center;
	}
}
</style>
