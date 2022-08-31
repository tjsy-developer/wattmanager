<template lang="pug">
	.row.justify-center.content-start.infoCreate
		.col-12.row.justify-center.titleBar
			span {{ $t("notice")[0] }}
		.col-12.row.justify-center.content-start
			span.col-12.createTitle {{ $t("notice")[6] }}
			.col-12.row(v-if="content.edit", v-for="(content, contentKey) in listFilters")
				.col-12.divisionLine
				.col-12.row.editOptions.items-center
					span.col-auto {{ content.text }}
					selectComp(v-if="content.edit == 'select'", :compData="content.selectCompData?content.selectCompData:undefined", :disabled="auth == 4 ? undefined : 'disabled'").col.selectCompClass
					textarea(v-else-if="content.edit == 'textarea'", rows=10, spellcheck="false").col.textareaClass
					input(v-else, :placeholder="contentKey == 1 ? '0000-00-00' : ''", :value="contentKey == 2 ? id : undefined", :disabled="contentKey != 2 ? undefined : 'disabled'").col
			.col-12.divisionLine
			.col-12.row.justify-end.createBtns
				button(@click="createBtnClick") {{ $t("noticeUpload")[0] }}
				button(@click="cancleBtnClick") {{ $t("noticeUpload")[1] }}
</template>

<script>
import createAndEditFiltersJson from "@/assets/jsons/info/notice/createAndEditFilters"
import getFilters from "@/assets/scripts/info/getFilters"
// import setComboBox from "@/assets/scripts/info/setComboBox"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"
import domain from "@/assets/jsons/domain/domain"

export default {
  layout: "main",
  data() {
    return {
      enSeq: undefined,
      id: undefined,
      auth: undefined,
      listFilters: undefined,
      token: undefined
    }
  },
  methods: {
    createBtnClick() {
      if (
        !/^(1|2)\d{3}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/.test(
          getInfo.getInputValue(0)
        )
      )
        return alert(this.$t("dateFormat"))

      let enSeq = 0
      // eslint-disable-next-line eqeqeq
      if (this.auth == 4) {
        enSeq = getInfo.getSelectValue(this.listFilters, 3)
      } else {
        enSeq = Number(this.enSeq)
      }
      btnsClick.create(
        this.listFilters,
        domain.domain.backend1 + "noticeRest/noti_insert",
        {
          en_seq: enSeq,
          content: getInfo.getTextareaValue(0),
          effective_date: this.getWorldTime(getInfo.getInputValue(0)),
          jwt: this.token,
          save_time: this.getSaveTime()
        }
      )
    },
    cancleBtnClick() {
      window.history.back()
    },
    getSaveTime() {
      const now = new Date()
      const standard = now.getTime() / 1000
      // eslint-disable-next-line no-new-wrappers
      const returnDate = Math.round(standard)
      return returnDate
    },
    getWorldTime(dateTime) {
      const dateTimeSplit = dateTime.split("-")
      const year = parseInt(dateTimeSplit[0])
      const month = parseInt(dateTimeSplit[1])
      const day = parseInt(dateTimeSplit[2])
      const date = new Date(year, month - 1, day)
      const standard = date.getTime() / 1000
      const returnDate = Math.round(standard + 86399)
      // console.log(Math.round(timestampUTC))
      return returnDate
    }
  },
  mounted() {
    this.enSeq = localStorage.getItem("enSeq")
    this.id = localStorage.getItem("id")
    this.auth = localStorage.getItem("auth")
    this.token = localStorage.getItem("jwt")
    getInfo.setLang(this.$t("getInfo"))
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[15]
    ])

    const self = this
    getInfo.enterprise().then(enterpriseRes => {
      getInfo.enterpriseCompData.options = enterpriseRes
      self.listFilters = getFilters(
        [
          self.$t("notice")[1],
          self.$t("notice")[7],
          self.$t("notice")[4],
          self.$t("noticeUpload")[2]
        ],
        createAndEditFiltersJson
      )
      self.listFilters[3].selectCompData = getInfo.enterpriseCompData
      // if (self.auth != 4)
      self.listFilters[3].selectCompData.selectedText = this.enSeq
      // eslint-disable-next-line eqeqeq
      if (self.auth == 4)
        self.listFilters[3].selectCompData.selectedText = this.$t("getInfo")[0]
    })
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.infoCreate
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: $contentBackground

.infoCreate>div:not(.titleBar),
.titleBar>span
	width: $contentMaxWidth

.titleBar
	margin-bottom: 36px

.infoImg
	>img,
	>video
		width: 660px
		margin: 35px 0 15px
		object-fit: cover

.createTitle
	font-size: 22px
	font-weight: 800
	margin-bottom: 21px

.divisionLine
	height: 1px !important
	background-color: #D9D9D9
	margin-top: 15px

.editOptions
	margin-top: 10px

.editOptions>span
	font-size: 14px
	padding-right: 20px
	min-width: 143px

.editOptions>input:not(.fileTypeInput)
	height: 38px
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px

.createBtns
	margin-top: 40px

.createBtns>button:nth-child(1)
	color: white
	background-color: #4070a6
	padding: 10px 36px

.createBtns>button:nth-child(2)
	color: white
	background-color: #9F9F9F
	padding: 10px 36px
	margin-left: 8px

.selectCompClass
	width: 100%
	padding: 10px
	border: 1px solid #D9D9D9
	background-color: white

.textareaClass
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px
	overflow: auto
</style>
