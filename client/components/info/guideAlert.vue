<template lang="pug">
  .items-center.quideAlert
    .guideTitle
      span {{  $t("memberNotice")[0] }}
    .line
    .guideTextBox.row
      div.col-12
        span.col-12 {{  $t("memberNotice")[1] }}
      button(@click="close") {{  $t("memberNotice")[2] }}
    
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {
    close() {
      this.$modal.hide("guideAlertModal")
    }
  }
}
</script>

<style lang="sass" scoped>
.icon
	position: absolute
	top: 4px
	right: 4px

.accountWinImg
	height: 100%
	object-fit: cover

.quideAlert
	height: 100%
	width: 100%
	padding: 20px
	border: 1px solid #4D4D4D
	background: #2A2A2A 0% 0% no-repeat padding-box

.guideTitle
	width: 100%
	// background: yellow
	color: white
	>span
		padding: 30px 20px 10px 30px
		font-size: 23px

.line
	width: 90%
	margin-left: 5%
	border: 1px solid #4D4D4D
	background: #2A2A2A 0% 0% no-repeat padding-box

.guideTextBox
	color: white
	justify-content: center
	text-align: center
	width: 100%
	padding-left: 15px
	padding-right: 15px
	word-break: keep-all
	>div
		>span
			padding-top: 30px
			font-size: 16px
			width: 100%
	>button
		color: white
		margin-top: 20px
		background: #2386D2
		padding: 5px 10px
		font-size: 15px
		border-radius: 10px
</style>
