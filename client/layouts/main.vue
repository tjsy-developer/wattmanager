<template lang="pug">
	#main(v-show="isLoaded")
		mainHeader
		modals-container#modalsContainer
		nuxt
		loadingBar(v-if="fileUploadStatus" @setLoadingBar="set")
		mainFooter
</template>

<script>
export default {
  head() {
    return {
      title: this.$t("login logo text")
    }
  },
  data() {
    return {
      isLoaded: false,
      fileUploadStatus: false
    }
  },
  methods: {
    set(status) {
      this.fileUploadStatus = status
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
  },
  mounted() {
    this.isLoaded = true
  },
  created() {
    this.$nuxt.$on("setLoadingBar", $event => this.set($event))
  }
}
</script>

<style lang="sass" scoped>
#main
	width: 100%
	min-width: $contentMaxWidth
	height: 100%
</style>
