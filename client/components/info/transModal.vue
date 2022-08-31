<template lang="pug">
  .items-center.quideAlert
    .guideTitle
      span {{ $t("domain guide") }}
      //- span Domain Change Guide
      .row.localeBtn.globalRight.cursor-pointer
        .col-12.localeBtn(class="selected" @click="state = !state")
          img(v-if="langImg == 'ko'" :src="koflag").culLangImg
          img(v-else-if="langImg == 'en'" :src="enflag").culLangImg
          span {{ curLang }}
          img(src="@/assets/images/bt_kr-en.png")
        .col-12.localeBtn.cursor-pointer( v-show ="langImg != 'ko' && state") 
          img(src="@/assets/images/img.png")
          span(style="width:60%;" @click.prevent="switchLocale('ko', $event)") {{ $t("lang")[0] }}
        .col-12.localeBtn.cursor-pointer( v-show ="langImg != 'en' && state")
          //- .col-12.localeBtn.cursor-pointer( v-show ="$i18n.locale != 'en' && state")
          img(src="@/assets/images/american.png")
          span(style="width:60%;" @click.prevent="switchLocale('en', $event)") {{ $t("lang")[1] }}    
      
    .line
    .guideTextBox.row
      .text1.col-12
        span {{ $t("changed domain Text")[0] }}
        //- span We have changed the domain of WhatTalk
        span {{ $t("changed domain Text")[1] }}
        //- span from March 09, 2022 for better service.
      //- .contour.row.justify-center(style="border: 1px solid #2386D2")
      .changeNotice.row.col-12.justify-center
        .domain {{ $t("domain guide") }}
        //- .domain Domain Change Guide
      .text2.col-9.row.justify-center
        span.col-12 {{ this.beforeUrl }}
        span ▼ ▼
        span.col-12 {{ this.afterUrl }}
      //- .contour.row.justify-center(style="margin-top: 20px")
      .text3.row.justify-center.col-12
        span.col-12 {{ $t("changed domain Text")[2] }}
        //- span.col-12 On March 23, 2022, the secl.powertalk.kr
        span.col-12 {{ $t("changed domain Text")[3] }}
        //- span.col-12 service will be shut down.
        a(:href="this.afterUrl") {{ $t("changed domain Text")[4] }}
        //- a(:href="this.afterUrl") Go to change URL
    //-   button(@click="close") {{  $t("memberNotice")[2] }}
</template>

<script>
export default {
  components: {},
  props: ["changedDomain"],
  data() {
    return {
      beforeUrl: "",
      afterUrl: "",
      langImg: "ko",
      state: false,
      curLang: this.$t("lang")[0],
      koflag: require("@/assets/images/img.png"),
      enflag: require("@/assets/images/american.png")
    }
  },
  methods: {
    switchLocale(locale, e) {
      sessionStorage.setItem("languageCode", locale)
      this.curLang = e.target.innerHTML
      this.flag = e.target.previousSibling.src
      location.reload()
    }
  },
  mounted() {
    // window.location.href
    const href = window.location.href
    const res = href.indexOf("powertalk")
    const splitHref = href.split(".")
    this.beforeUrl = href.substring(0, href.lastIndexOf(":"))

    // url 주소에 powertalk주소를 포함할때
    if (res !== -1) {
      // powertalktwo.powertalk 일경우
      if (splitHref[0].includes("powertalktwo")) {
        const split = splitHref[0].split("//")
        splitHref[0] = split[0] + "//dev"
      }
      // powertalk -> watttalk으로 변경
      splitHref[1] = "watttalk"
    }
    // 변경한 주소 이어 붙이기
    for (let i = 0; i < splitHref.length; ++i) {
      this.afterUrl += splitHref[i] + "."
      if (i === splitHref.length - 1) {
        this.afterUrl = this.afterUrl.substring(
          0,
          this.afterUrl.lastIndexOf(":")
        )
      }
    }
    this.changedDomain(this.afterUrl)

    const currentLang = sessionStorage.getItem("languageCode")
    if (sessionStorage.getItem("languageCode") != null) {
      this.langImg = sessionStorage.getItem("languageCode")
    }
    // 초기 언어 설정
    // eslint-disable-next-line eqeqeq
    if (currentLang == "ko") {
      this.curLang = this.$t("lang")[0]
    } else {
      this.curLang = this.$t("lang")[1]
    }
  }
}
</script>

<style lang="sass" scoped>
::-webkit-scrollbar
  width: 4px

::-webkit-scrollbar-track
  background-color: #2f3542

::-webkit-scrollbar-thumb
  background: #4D4D4D
  border-radius: 15px

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
	overflow-y: scroll
	@media screen and (max-width: 479px)
		padding: 10px

.guideTitle
	width: 100%
	// background: yellow
	color: white
	>span
		padding: 30px 20px 10px 30px
		font-size: 20px
		font-weight: bold

.line
	width: 90%
	margin-left: 5%
	border: 1px solid #4D4D4D
	background: #2A2A2A 0% 0% no-repeat padding-box

.contour
	width: 70%
	margin: 30px 0px 20px 0px
	background: #2386D2 0% 0% no-repeat padding-box
	border: 1px solid #2386D2

.domain
  position: absolute
  top: 10px
  background: #2a8441
  padding: 4px 7px
  z-index: 1
  border-radius: 5px

.guideTextBox
	color: #f5f5f5
	justify-content: center
	text-align: center
	width: 100%
	padding-left: 15px
	padding-right: 15px
	word-break: keep-all
	@media screen and (max-width: 479px)
		padding-left: 10px
		padding-right: 10px
.text1
	>span
		font-size: 16px
		width: 100%
		margin-bottom: 10px
		&:first-child
			margin-top: 30px

.text2
  background: #413e3e
  padding: 10px
  margin: 25px 0px
  border-radius: 15px
  @media screen and (max-width: 479px)
    width: 100%

  >span
    margin-top: 20px
    font-size: 15px
    &:nth-child(2)
      margin-top: 10px
      font-size: 12px
    &:last-child
      font-size: 18px
      margin-top: 10px
      margin-bottom: 10px
      font-weight: bold
.text3
	>span
		padding-top: 10px
		font-size: 14px
		width: 100%
    justify-content: center
	>a
		color: white
		margin-top: 20px
		background: #1c8eff 0% 0% no-repeat padding-box
		padding: 7px 20px
		font-size: 13px
		border-radius: 25px
  &:hover
    color: white
    font-weight: 800
    background: #1473e6

.globalRight
	position: absolute
	right: -3px
	top: -4px
	width: 90px
	border: 1px solid #4d4d4d
  z-index: 4
	>div
		padding: 2px 5px
		padding-left: 6px
		border: 1px solid #4d4d4d
		&:first-child
			border-top: none
			background: #393939
		>img
			&:first-child
				margin-top: 2px
				height: 11px
				width: 14px
				margin-right: 8px
			&:last-child
				margin-top: 4px
				margin-left: 8px
		>span:not(:first-child)
			font-size: 11px
// @media only screen and (max-width: 800px) and (orientation: landscape)
// 	.guideTextBox
// 		color: white
// 		justify-content: center
// 		text-align: center
// 		width: 100%
// 		>div
// 			>span
// 				padding-top: 30px
// 				font-size: 16px
// 				width: 100%
// 		>button
// 			color: white
// 			margin-top: 20px
// 			background: #2386D2
// 			padding: 5px 10px
// 			font-size: 15px
// 			border-radius: 10px
</style>
