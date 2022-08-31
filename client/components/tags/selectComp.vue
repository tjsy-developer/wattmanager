<template lang="pug">
	select(
		:id="compData.id"
		:class="compData.class"
		@change="selectChange"
		v-model="compData.selectedText"
		:multiple="this.compData.selectedText && this.compData.selectedText.constructor == Array"
		:disabled="this.compData.disabled"
	)
		option(v-if="compData.placeholder", disabled, :value="compData.placeholder") {{ compData.placeholder }}
		option(
			v-for="(option, optionKey) in compData.options"
			:key="optionKey"
			:id="compData.id?compData.id+optionKey:undefined"
			:value="option.value == 0 ? '0' : option.value ? option.value : option == 0 ? '0' : option"
		) {{ $i18n.locale === 'ko' ? option.text :  option.en_text }}
</template>

<script>
export default {
  props: ["compData"],
  methods: {
    selectChange(e) {
      this.compData.selectedValue = this.compData.selectedText
      if (this.compData.change) this.compData.change(e)
    }
  },
  created() {
    if (!this.compData) return console.log("selectComp - compData error")

    this.compData.selectedText = this.compData.selectedText
      ? this.compData.selectedText
      : this.compData.placeholder
      ? this.compData.placeholder
      : this.compData.options
      ? this.compData.options[0].value
        ? this.compData.options[0].value
        : this.compData.options[0]
      : undefined

    this.compData.selectedValue =
      this.compData.selectedText !== this.compData.placeholder
        ? this.compData.selectedText
        : undefined
  },
  watch: {
    "compData.options"(newVal, oldVal) {
      this.compData.selectedText =
        this.compData.selectedText &&
        this.compData.selectedText.constructor === Array
          ? []
          : this.compData.placeholder
          ? this.compData.placeholder
          : undefined
      this.compData.selectedValue = undefined
    },
    "compData.selectedText"(newVal, oldVal) {
      this.compData.selectedValue =
        newVal !== this.compData.placeholder ? newVal : undefined
    }
  }
}
</script>

<style lang="sass" scoped></style>
