<template>
	<div id="default">
		<modals-container id="modalsContainer"></modals-container>
		<nuxt></nuxt>
	</div>
</template>

<script>
export default {
	head() {
		return {
			title: this.$t("login logo text")
		}
	},
	beforeMount() {
		const getLanguageCode = sessionStorage.getItem("languageCode")
		if (!getLanguageCode) {
			let getBrowserLanguageCode = navigator.language || navigator.userLanguage
			getBrowserLanguageCode = getBrowserLanguageCode.substring(0, 2)
			sessionStorage.setItem("languageCode", getBrowserLanguageCode)
			this.$i18n.locale = getBrowserLanguageCode
		} else this.$i18n.locale = getLanguageCode
		if (!this.$i18n.locale || this.$i18n.locale == null) {
			this.$i18n.locale = "ko"
			sessionStorage.setItem("languageCode", "ko")
		}
	}
}
</script>

<style lang="sass" scoped>
#default
	width: 100%
	// min-width: 1260px
	height: 100%

@media screen and (max-width: 768px)
	height: 100%

@media screen and (max-width: 500px)
	#default
		min-width: unset
		height: 100%
</style>
