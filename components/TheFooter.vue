<script setup>
/** Store */
import { useModalsStore } from "@/store/modals"
const modalsStore = useModalsStore()

const appConfig = useAppConfig()

const handleViewConstants = () => {
	modalsStore.open("constants")
}
</script>

<template>
	<Flex tag="footer" justify="center" :class="$style.wrapper">
		<Flex justify="between" wide :class="[$style.container]">
			<Flex direction="column" gap="20" :class="$style.left">
				<Flex align="center" gap="8">
					<Icon name="logo" size="18" color="black" :class="$style.logo" />

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
							fill-opacity="0.9"
						/>
					</svg>
				</Flex>

				<Text size="14" weight="500" align="center" height="140" color="secondary"
					>Blockchain explorer for the shared sequencer network</Text
				>

				<Flex align="center" gap="16">
					<NuxtLink to="https://x.com/astrotrek_io" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="twitter" size="16" color="secondary" />
						</Flex>
					</NuxtLink>
					<NuxtLink to="https://github.com/celenium-io/astrotrek-interface" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="github" size="16" color="secondary" />
						</Flex>
					</NuxtLink>
					<NuxtLink to="https://discord.com/channels/846362414039695391/1168936555302355005" target="_blank">
						<Flex align="center" justify="center" :class="$style.social">
							<Icon name="discord" size="16" color="secondary" />
						</Flex>
					</NuxtLink>
				</Flex>
			</Flex>

			<Flex direction="column" align="end" gap="24" :class="$style.right">
				<Flex align="center" gap="16" wrap="wrap" :class="$style.links">
					<NuxtLink to="/blocks">
						<Text size="13" weight="600" color="secondary">Blocks</Text>
					</NuxtLink>
					<NuxtLink to="/txs">
						<Text size="13" weight="600" color="secondary">Transactions</Text>
					</NuxtLink>
					<NuxtLink to="/accounts">
						<Text size="13" weight="600" color="secondary">Accounts</Text>
					</NuxtLink>
					<NuxtLink to="/validators">
						<Text size="13" weight="600" color="secondary">Validators</Text>
					</NuxtLink>
					<NuxtLink to="/rollups">
						<Text size="13" weight="600" color="secondary">Rollups</Text>
					</NuxtLink>
					<Text @click="handleViewConstants" size="13" weight="600" color="secondary" :style="{ cursor: 'pointer' }">Constants</Text>
				</Flex>
				<Flex align="center" gap="16" :class="$style.links">
					<a href="/privacy-policy">
						<Text size="13" weight="600" color="secondary">Privacy Policy</Text>
					</a>
					<a href="/terms-of-use">
						<Text size="13" weight="600" color="secondary">Terms of use</Text>
					</a>
				</Flex>

				<Text size="12" weight="500" color="tertiary">
					Version <Text color="secondary">{{ appConfig.version }}</Text>
				</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module lang="scss">

.container {
	max-width: var(--base-width);

	padding: 24px 0;
	margin: 0 24px;
}

.logo {
	box-sizing: content-box;
	background: var(--brand);
	cursor: pointer;
	border-radius: 8px;

	padding: 3px;
}

.logo_name {
	fill: var(--logo-name);
}

.social {
	width: 24px;
	height: 24px;

	border-radius: 7px;
	background: var(--op-5);
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
