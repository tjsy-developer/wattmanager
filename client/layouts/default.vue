<template lang="pug">
	#default
		modals-container#modalsContainer
		nuxt
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
  }
}
</script>

<style lang="sass" scoped>
#default
	width: 100%
	// min-width: $contentMaxWidth
	height: 100%

@media screen and (max-width: 768px)
	height: 100%

@media screen and (max-width: 500px)
	#default
		min-width: unset
		height: 100%
</style>
