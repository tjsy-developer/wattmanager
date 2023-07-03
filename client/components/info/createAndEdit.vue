<template>
  <div class="row justify-center content-start infoCreateAndEditContainer">
    <div class="col-12 row justify-center titleBar">
      <span>{{ compData.listTitle }}</span>
    </div>
    <div class="col-12 row justify-center content-start">
      <span v-if="compData.createAndEditTitle" class="createTitle" :class="[ $route.name == 'app-edit' || $route.name == 'app-create' ? 'col':'col-12' ]">
        {{ compData.createAndEditTitle }}
      </span>
      <span v-if="$route.name == 'app-edit' || $route.name == 'app-create'" class="appInfoText">{{ $t("app")[3] }}</span>
      <selectComp v-if="$route.name == 'app-edit' || $route.name == 'app-create'" class="appCopyEnterprise col-1" :compData="enList"></selectComp>
      <selectComp v-if="$route.name == 'app-edit' || $route.name == 'app-create'" class="appCopyHeadquaters col-1" :compData="hqList"></selectComp>
      <selectComp v-if="$route.name == 'app-edit' || $route.name == 'app-create'" class="appCopyBranch col-1" :compData="brList"></selectComp>
      <button v-if="$route.name == 'app-edit' || $route.name == 'app-create'" class="col-1 appCopyBtn"  @click="appInfoCopy">{{ $t("appCopy") }}</button>
      <div v-if="compData.type != 'edit'" class="row justify-left infoImg" style="margin-top:50px; ">
        <img v-if="compData.type == 'pictureEdit'" :src="compData.selected[0]" />
      </div>
      <div v-if="content.edit" class="col-12 row" v-for="(content, contentKey) in compData.listFilters" :key="contentKey">
        <div class="col-12 divisionLine"></div>
        <div class="col-12 row editOptions items-center">
          <span class="col-auto" :style="{ minWidth: compData.createAndEditSpanSize + 'px' }">{{ content.text }}</span>
          <selectComp v-if="content.edit == 'select'" class="col selectCompClass" :compData="content.selectCompData?content.selectCompData:undefined"></selectComp>
          <div v-else-if="content.edit == 'checkbox'" class="col">
            <div class="appSettingContents" v-for="(checkbox, checkboxKey) in content.checkboxCompData.list" :key="checkboxKey">
              <input class="appSettingSort" type="number" v-model="checkbox.sort" />
              <label class="row items-center checkbox">
                <input class="col-auto" type="checkbox" :value="checkbox.value" v-model="content.checkboxCompData.selected" />
                <span class="col-auto">{{ checkbox.text }}</span>
              </label>
            </div>
          </div>
          <textarea v-else-if="content.edit == 'textarea'" class="detailJson col textareaClass" id="textarea" :rows="rows" spellcheck="false" @keydown="resize($event)">{{ compData.type == 'create' ? undefined : compData.selected[contentKey-1] }}</textarea>
          <div v-else-if="content.edit == 'file'" class="fileTypeInputContainer">
            <img id="fileTypeInputImg" :src="compData.selected[contentKey-1] ? compData.selected[contentKey-1] : require('@/assets/images/human_contact_list.png')" />
            <input class="fileTypeInput" id="fileTypeInput" type="file" accept="image/*" @change="fileTypeInputChange($event, contentKey-1)" ref="fileTypeInput" />
          </div>
          <input
            v-else
            class="col"
            :value="compData.type == 'edit' ? compData.selected[contentKey - 1] : compData.type == 'create' ? undefined : contentKey == 4 ? getTimeZone(compData.selected[contentKey+1]) : compData.selected[contentKey + 1]"
            :disabled="content.edit=='disabled'"
           />
           <button
            v-if="contentKey == 8 && compData.type == 'edit' && compData.listFilters[8].text == $t('profile text')[6]"
            class="changePhone-btn"
            @click="changePhoneBtnClick"
          >
            {{ $t("changePhoneNumber") }}
          </button>
        </div>
      </div>
      <div class="col-12 divisionLine"></div>
      <div v-if="compData.type=='create'" class="col-12 createBtns">
        <button @click="createBtnClick">{{ $t("createAndEditComp")[0] }}</button>
        <button @click="cancleBtnClick">{{ $t("createAndEditComp")[2] }}</button>
      </div>
      <div v-else class="col-12 editBtns">
        <button @click="editBtnClick">{{ $t("createAndEditComp")[1] }}</button>
        <button @click="cancleBtnClick">{{ $t("createAndEditComp")[2] }}</button>
        <button @click="deleteBtnClick">{{ $route.name == "profile" ? $t("change password") : $t("createAndEditComp")[3] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// import createAndEditFiltersJson from "@/assets/jsons/info/app/createAndEditFilters"
import domain from "@/assets/jsons/domain/domain"
import axiosJson from "@/assets/jsons/axios"
import getInfo from "@/assets/scripts/info/getInfo"
import changePhoneModal from "@/components/info/changePhoneModal"
// import setComboBox from "@/assets/scripts/info/setComboBox"
// import getFilters from "@/assets/scripts/info/getFilters"

export default {
  props: ["compData"],
  data() {
    return {
      profileImage: "",
      rows: 5,
      cnt: 0,
      cellPhoneNum: undefined,
      useEnterprise: undefined,
      // useEnterprise: "dlenc",
      // 앱 복사 기업 리스트
      enList: getInfo.enterprise().then(res => {
        getInfo.enList.options = res
        this.enList = getInfo.enList
      }),
      // 앱 복사 본부, 지사 리스트 불러오기
      hqList: getInfo.hqList,
      brList: getInfo.brList,
      checkAdmin: false,
      check2Factor: false
    }
  },
  methods: {
    createBtnClick() {
      console.log("생성이벤트 만드는 곳")
      sessionStorage.setItem("mutationState", "true")
      if (this.compData.createBtnClick) this.compData.createBtnClick()
      sessionStorage.removeItem("check2Factor")
    },
    editBtnClick() {
      console.log("수정이벤트 만드는 곳")
      sessionStorage.setItem("mutationState", "true")
      if (this.compData.editBtnClick) this.compData.editBtnClick()
      sessionStorage.removeItem("check2Factor")
    },
    cancleBtnClick() {
      window.history.back()
      sessionStorage.removeItem("check2Factor")
    },
    deleteBtnClick() {
      console.log("삭제이벤트 만드는 곳")
      sessionStorage.setItem("mutationState", "true")
      if (this.compData.deleteBtnClick) this.compData.deleteBtnClick()
      sessionStorage.removeItem("check2Factor")
    },
    fileTypeInputChange(input, index) {
      if (input.target.files[0]) {
        const fileSize = input.target.files[0].size
        const maxSize = 1 * 1024 * 1024
        if (fileSize > maxSize) {
          alert(this.$t("maxSize"))
          document.getElementById("fileTypeInput").value = ""
          return
        }

        const reader = new FileReader()
        reader.readAsDataURL(input.target.files[0])
        const self = this

        // 파일 정보 가져오기 - blob 처리하기 위해서
        const fileInfo = input.target.files.item(0)
        reader.onload = function(e) {
          // 로드 된 후에 blob 처리하여 url 생성
          self.profileImage = URL.createObjectURL(fileInfo)
          console.log(e.target.result)
          self.compData.selected[index] = e.target.result

          // img url 변경
          document.getElementById("fileTypeInputImg").src = self.profileImage
        }
      }
    },
    getTimeZone(standard) {
      const now = new Date(standard * 1000)
      const month = ("0" + (now.getMonth() + 1)).slice(-2)
      const date = ("0" + now.getDate()).slice(-2)
      const hours = ("0" + now.getHours()).slice(-2)
      const minutes = ("0" + now.getMinutes()).slice(-2)
      const seconds = ("0" + now.getSeconds()).slice(-2)
      const milliseconds = now.getMilliseconds()

      const convertToDate =
        now.getFullYear() +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        "." +
        milliseconds

      console.log("getTimeZone:  date = " + now)
      return convertToDate
    },
    // textArea keydown 이벤트 인식 및 rows 계산 함수 실행
    resize(e) {
      console.log(this.$route.name)
      if (this.$route.name === "app-edit") {
        const changeAppDetailJson = document.getElementById("textarea")
        this.computeTextRows(changeAppDetailJson.value)
      }
    },
    // textArea rows 계산 함수
    computeTextRows(textContent) {
      if (this.$route.name === "app-edit") {
        // const rows = textContent.split("\n").length

        const changeAppDetailJson = document.getElementById("textarea")
        if (changeAppDetailJson == null) {
        } else {
          const csize =
            changeAppDetailJson.scrollHeight >= 161
              ? changeAppDetailJson.scrollHeight + "px"
              : 131 + "px"
          changeAppDetailJson.style.height = csize
        }
        // return Math.round(textContent.length / 161) + this.rows - 1
      }
    },
    changePhoneBtnClick() {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block"
      const modalParameter = {
        phone: this.compData.selected[7],
        data: this.compData.selected,
        id: this.compData.selected[0]
      }
      this.$modal.show(
        changePhoneModal,
        {
          propsData: modalParameter
        },
        {
          name: "changePhoneModal",
          width: 600,
          height: 200,
          clickToClose: false,
          adaptive: true,
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      )
    },
    // - 앱정보 복사
    appInfoCopy() {
      // 복사할 기업,본부,지사,앱코드 선택체크
      const self = this
      const appCopyEnSeq = this.enList.selectedValue
      const appCopyHqSeq = this.hqList.selectedValue
      const appCopyBrSeq = this.brList.selectedValue

      const appCodeSeq = getInfo.getSelectValue(this.compData.listFilters, 1)

      if (appCodeSeq === undefined) {
        alert(self.$t("appCopy noneSelectBox")[0])
      } else if (appCopyEnSeq === undefined) {
        alert(self.$t("appCopy noneSelectBox")[1])
      } else if (appCopyHqSeq === undefined) {
        alert(self.$t("appCopy noneSelectBox")[2])
      } else if (appCopyBrSeq === undefined) {
        alert(self.$t("appCopy noneSelectBox")[3])
      } else {
        this.$axios
          .post(domain.domain.backend1 + axiosJson.app.app_info_copy, {
            app_code_seq: appCodeSeq,
            en_seq: appCopyEnSeq,
            hq_seq: appCopyHqSeq,
            br_seq: appCopyBrSeq,
            jwt: localStorage.getItem("jwt")
          })
          .then(function(res) {
            console.log(res.data)

            // eslint-disable-next-line prettier/prettier
            // self.compData.listFilters[1].selectCompData.selectedValue = res.data.app_code_seq
            document.querySelectorAll("input")[0].value = res.data.app_name_kor
            document.querySelectorAll("input")[1].value = res.data.app_name_eng
            // eslint-disable-next-line prettier/prettier
            document.querySelectorAll("input")[2].value = res.data.app_package_name
            document.querySelectorAll("input")[3].value = res.data.app_version

            self.compData.listFilters[9].selectCompData.selectedText = String(
              res.data.use_on_pc
            )
            self.compData.listFilters[10].selectCompData.selectedText = String(
              res.data.use_on_glass
            )

            document.querySelectorAll("textarea")[0].value =
              res.data.app_detail_json

            // if (res.data.use_on_glass === 0) {
            //   self.compData.listFilters[10].selectCompData.selectedText = String(
            //     res.data.use_on_glass
            //   )
            // } else {
            //   self.compData.listFilters[10].selectCompData.selectedText = String(
            //     res.data.use_on_glass
            //   )
            // }
          })
          .catch(function(error) {
            console.log("app edit page error : ", error)
          })
      }
    },
    sessionStorageChange() {
      this.compData.selected[7] = sessionStorage.getItem("phoneNum")
      sessionStorage.removeItem("phoneNum")
      this.$forceUpdate()
    },
    changedCompData() {
      const enSeq = Number(document.getElementsByClassName("selectCompClass")[0].value)
      const hqSeq = Number(document.getElementsByClassName("selectCompClass")[1].value)
      const brSeq = Number(document.getElementsByClassName("selectCompClass")[2].value)
      console.log(enSeq, hqSeq, brSeq)
      const self = this
      this.$axios
        .post(domain.domain.backend1 + axiosJson.app.app_powertalkweb_info, {
          en_seq: enSeq,
          hq_seq: hqSeq,
          br_seq: brSeq
        })
        .then((res) => {
          const jsonFactorList = res.data[0].app_detail_json
          const factorList = JSON.parse(jsonFactorList)
          self.check2Factor = factorList["2factor"]
          console.log(self.check2Factor)
        })
        .catch((err) => {
          if (err == "TypeError: Cannot read properties of undefined (reading 'app_detail_json')") {
            self.check2Factor = "False"
          } else {
            console.log("2Factor Error :", err)
          }
        })
    }
  },
  updated() {
    // if (this.$route.name === "app-edit") {
    //   const textContent = this.compData.selected[10]
    //   this.rows =
    //     String(textContent).length / 161 +
    //     String(textContent).split("\n").length
    //   if (this.cnt < 2) {
    //   }
    // }
  },
  mounted() {
    this.check2Factor = sessionStorage.getItem("check2Factor")
    // dlenc 분기처리!!
    if (window.location.hostname == "dlenc.watttalk.kr") {
      this.useEnterprise = "dlenc"
    }else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
      this.useEnterprise = "dlenc"
    }
    window.addEventListener("sessionStorageUpdated", this.sessionStorageChange)
    window.addEventListener("changedCompData", this.changedCompData)
    sessionStorage.removeItem("mutationState")
  },
  beforeDestroy() {
    if (this.profileImage !== "") {
      URL.revokeObjectURL(this.profileImage)
    }
    window.removeEventListener("sessionStorageUpdated", this.sessionStorageChange)
    window.removeEventListener("changedCompData", this.changedCompData)
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/styles/infoTitle"

.infoCreateAndEditContainer
	width: 100%
	min-width: $contentMaxWidth
	min-height: $contentHeight
	background-color: $contentBackground

.infoCreateAndEditContainer>div:not(.titleBar),
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

.editOptions>input:not(.fileTypeInput)
	height: 38px
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px


.createBtns,
.editBtns
	margin-top: 40px

.createBtns>button:nth-child(1)
	color: white
	background-color: #1DBFA4
	padding: 10px 36px

.createBtns>button:nth-child(2),
.editBtns>button:nth-child(2)
	color: white
	background-color: #9F9F9F
	padding: 10px 36px
	margin-left: 8px

.editBtns>button:nth-child(1)
	color: white
	background-color: #008BCF
	padding: 10px 36px

.editBtns>button:nth-child(3)
	color: white
	background-color: #BF1D1D
	padding: 10px 36px
	margin-left: 8px

.selectCompClass
	width: 100%
	padding: 10px
	border: 1px solid #D9D9D9
	background-color: white

.checkbox
	padding: 10px

	>span
		padding-left: 8px

.textareaClass
	font-size: 14px
	background-color: white
	border: 1px solid #D9D9D9
	padding: 12px
	overflow: auto

#fileTypeInputImg
	width: 50px
	height: 50px
	border-radius: 25px
	object-fit: cover

.fileTypeInput
	margin-top: 14px
	margin-left: 20px

.appSettingSort
	width: 60px
	height: 38px
	font-size: 14px
	background-color: #fff
	border: 1px solid #d9d9d9
	padding: 12px

.appSettingContents
	padding: 4px

.appInfoText
	margin-top: 8px
	font-weight: bold

.appCopyBtn
	background: #1DBFA4 0% 0% no-repeat padding-box
	border-radius: 2px
	width: 60px
	height: 38px
	margin-left: 12px
	color: white

.appCopyEnterprise,
.appCopyHeadquaters,
.appCopyBranch
	width: 98px
	height: 38px
	padding-left: 10px
	border: 1px solid #D9D9D9
	background-color: white
	margin-bottom: 20px
	margin-left: 10px
.changePhone-btn
  width: 130px
  height: 38px
  font-size: 14px
  text-align: center
  background: #008BCF
  margin-left: 10px
  color: white
</style>
