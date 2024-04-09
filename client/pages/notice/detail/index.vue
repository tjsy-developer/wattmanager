<template>
  <div class="row justify-center content-start infoDetail">
    <div class="col-12 row justify-center titleBar">
      <span>{{ $t("notice")[0] }}</span>
    </div>
    <div class="col-12 row justify-center content-start">
      <span class="col-12 createTitle">{{ $t("notice")[5] }}</span>
      <div v-if="content.edit" class="col-12 row" v-for="(content, contentKey) in listFilters">
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row editOptions items-center">
          <span class="col-auto">{{ content.text }}</span>
          <selectComp v-if="content.edit == 'select'" class="col selectCompClass" :compData="content.selectCompData?content.selectCompData:undefined" disabled></selectComp>
          <textarea v-else-if="content.edit == 'textarea'" class="col textareaClass" rows=10 spellcheck="false" :readonly=" auth == 4 || auth == 3 && enSeq == selected[3] ? undefined : 'readonly'">{{ selected[contentKey] }}</textarea>
          <input
            v-else
            class="col"
            :placeholder="contentKey == 1 ? '0000-00-00' : ''"
            :value="contentKey == 1 ? getTimeZone(selected[contentKey]) : selected[contentKey]"
            :disabled="auth == 4 && contentKey != 2 || auth == 3 && enSeq == selected[3] && contentKey != 2 ? undefined : 'disabled'"
          />
        </div>
      </div>
      <div class="col-12 divisionLine"></div>
      <div class="col-12 row justify-end editBtns">
        <button v-if="auth == 4 || auth == 3 && enSeq == selected[3]" class="editBtn" @click="editBtnClick">{{ $t("createAndEditComp")[1] }}</button>
        <button v-if="auth == 4 || auth == 3 && enSeq == selected[3]" class="deleteBtn" @click="deleteBtnClick">{{ $t("createAndEditComp")[3] }}</button>
        <button class="cancelBtn" @click="cancelBtnClick">{{ $t("noticeUpload")[1] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import createAndEditFiltersJson from "@/assets/jsons/info/notice/createAndEditFilters"
import getFilters from "@/assets/scripts/info/getFilters"
// import setComboBox from "@/assets/scripts/info/setComboBox"
import getInfo from "@/assets/scripts/info/getInfo"
import btnsClick from "@/assets/scripts/info/btnsClick"

export default {
  layout: "main",
  data() {
    return {
      seq: Number(this.$route.query.seq),
      auth: undefined,
      enSeq: undefined,
      listFilters: undefined,
      selected: []
    }
  },
  methods: {
    editBtnClick() {
      if (
        !/^(1|2)\d{3}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/.test(
          getInfo.getInputValue(0)
        )
      )
        return alert(this.$t("dateFormat"))
      const token = sessionStorage.getItem("jwt")
      // this.getWorldTime(getInfo.getInputValue(0))
      btnsClick.edit(
        this.listFilters,
        process.env.backendURL + "noticeRest/noti_update",
        {
          noti_seq: this.seq,
          content: getInfo.getTextareaValue(0),
          effective_date: this.getWorldTime(getInfo.getInputValue(0)),
          jwt: token
        }
      )
    },
    cancelBtnClick() {
      window.history.back()
    },
    deleteBtnClick() {
      const token = sessionStorage.getItem("jwt")
      const result = confirm(btnsClick.lang[7])
      if (result) {
        btnsClick.delete(process.env.backendURL + "noticeRest/noti_delete", {
          noti_seq: this.seq,
          jwt: token
        })
      } else {
      }
    },
    getWorldTime(dateTime) {
      const dateTimeSplit = dateTime.split("-")

      const year = parseInt(dateTimeSplit[0])
      const month = parseInt(dateTimeSplit[1])
      const day = parseInt(dateTimeSplit[2])
      const date = new Date(year, month - 1, day)

      const standard = date.getTime() / 1000
      return Math.round(standard + 86399)
    },
    getTimeZone(standard) {
      const now = new Date(Number(standard) * 1000)
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)

      const convertToDate = now.getFullYear() + "-" + month + "-" + date

      return convertToDate
    }
  },
  mounted() {
    getInfo.setLang(this.$t("getInfo"))
    btnsClick.setLang([
      this.$t("btnsClick")[0],
      this.$t("btnsClick")[1],
      this.$t("account")[6],
      this.$t("attachment")[1],
      this.$t("attachment")[2],
      this.$t("listComp")[14],
      this.$t("listComp")[15],
      this.$t("notice")[8]
    ])
    this.auth = sessionStorage.getItem("auth")
    this.enSeq = sessionStorage.getItem("enSeq")
    const self = this
    const token = sessionStorage.getItem("jwt")
    this.$axios
      .post(process.env.backendURL + "noticeRest/noti_info_one", {
        noti_seq: self.seq,
        jwt: token
      })
      .then(function(res) {
        console.log(res)
        self.selected = [
          res.data[0].content,
          res.data[0].effective_date,
          res.data[0].user_name,
          res.data[0].en_seq
        ]
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
          console.log(self.selected[3])
          self.listFilters[3].selectCompData.selectedText = self.selected[3]
        })
      })
      .catch(function(error) {
        console.log("notice detail page error : ", error)
      })
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.infoDetail
	width: 100%
	min-width: 1260px
	min-height: $contentHeight
	background-color: $contentBackground

.infoDetail>div:not(.titleBar),
.titleBar>span
	width: 1260px

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

.editBtns
	margin-top: 40px

.editBtn
	color: white
	background-color: #008BCF
	padding: 10px 36px

.deleteBtn
	color: white
	background-color: #BF1D1D
	padding: 10px 36px
	margin-left: 8px

.cancelBtn
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
