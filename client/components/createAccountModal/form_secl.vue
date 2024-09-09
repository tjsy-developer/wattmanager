<template>
  <div class="col-6 column items-center accountRight">
    <button class="icon" @click="close">
      <img src="@/assets/images/ic_popup_finish.png" />
    </button>
    <div class="col row items-center">
      <div v-if="!isCreateQR" class="maxWidth">
        <div class="row justify-center items-end title">
          <span class="col-auto">{{ $t("account")[12] }}</span>
        </div>
        <input class="idInput" id="accountID" :placeholder="$t('account')[13]" v-model="id" @keyup.enter="idCheckBtnClick" />
        <button class="idChkBtn col-auto" @click="idCheckBtnClick">{{ $t("account")[18] }}</button>
        <input class="input" :placeholder="$t('account')[14]" v-model="password" type="password" />
        <input class="input" :placeholder="$t('account')[15]" v-model="passwordCheck" type="password" />
        <input class="nameInput" id="accountName" :placeholder="$t('account')[16]" v-model="name" @keyup.enter="nameCheckBtnClick" />
        <button class="nameChkBtn col-auto" @click="nameCheckBtnClick">{{ $t("account")[18] }}</button>
        <input class="emailInput" id="accountEMail" :placeholder="$t('account')[17]" v-model="EMail" @keyup.enter="emailCheckBtnClick" />
        <button class="nameChkBtn col-auto" @click="emailCheckBtnClick">{{ $t("account")[18] }}</button>
        <input class="enInput" id="enterpriseName" :placeholder='$t("enName")' v-model="enName" @keyup.enter="enterpriseCheckBtnClick" />
        <button class="nameChkBtn col-auto" @click="enterpriseCheckBtnClick">{{ $t("account")[18] }}</button>
        <selectComp :compData="hqCompData"></selectComp>
        <selectComp :compData="branchCompData"></selectComp>
        <selectComp :compData="deviceTypeCompData"></selectComp>
        <button class="signUpBtn" @click="signUpBtnClick">{{ !deviceTypeCompData.selectedValue || deviceTypeCompData.selectedValue == 3 ? $t("account")[19] : $t("account")[20] }}</button>
      </div>
      <div v-else class="maxWidth qrcode">
        <transition name="qrcode" mode="out-in">
          <div v-if="!qrCodeImg" class="emptyQrCode" key="emptyQrCode">
            <div class="col-12 row justify-center">
              <div class="emptyQrCodeBox"></div>
              <span>{{ $t("account")[0] }}</span>
            </div>
          </div>
          <div v-else class="loadQrCode" key="loadQrCode">
            <div class="col-12 row justify-center">
              <img :src="qrCodeImg" id="image" />
            </div>
            <span>{{ $t("account")[1] }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios";
import getInfo from "@/assets/scripts/info/getInfo";
import QRCode from "qrcode";

export default {
  components: {},
  data() {
    return {
      id: undefined,
      idCheck: undefined,
      password: undefined,
      passwordCheck: undefined,
      name: undefined,
      nameCheck: undefined,
      EMail: undefined,
      EMailCheck: undefined,
      enterpriseNameCheck: undefined,
      enterpriseEmailCheck: undefined,
      enName: "",
      enNameCheck: "",
      deviceTypeCompData: {
        placeholder: this.$i18n.t("account")[21],
        options: getInfo.deviceTypeObj(),
        selectedText: undefined,
        selectedValue: undefined
      },
      enterpriseCompData: getInfo.enterprise().then(res => {
        getInfo.enterpriseCompData.options = res
        this.enterpriseCompData = getInfo.enterpriseCompData
      }),
      hqCompData: getInfo.hqCompData,
      branchCompData: getInfo.branchCompData,
      isCreateQR: false,
      qrCodeImg: undefined,
      ret: undefined
    }
  },
  methods: {
    close() {
      this.$modal.hide("createAccountModal")
    },
    switchLocale(locale) {
      sessionStorage.setItem("languageCode", locale)
      location.reload()
    },
    idCheckBtnClick() {
      if (this.id) {
        // eslint-disable-next-line no-global-assign
        self = this
        this.$axios
          .post(process.env.backendURL + axiosJson.account.user_id_check, {
            id: this.id
          })
          .then(function(response) {
            if (response.data) {
              self.idCheck = self.id
              alert(self.$t("account")[3])
            } else {
              self.idCheck = undefined
              alert(self.$t("account")[4])
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      } else {
        document.getElementById("accountID").focus()
        alert(this.$t("account")[5])
      }
    },
    nameCheckBtnClick() {
      this.enterpriseNameCheck = this.enNameCheck
      console.log(this.enterpriseCompData.selectedValue)
      if (this.enName !== "") {
        if (this.name) {
          const pattern = /\s/g
          if (this.name.match(pattern)) {
            alert(this.$t("no spaces text"))
          } else {
            // eslint-disable-next-line no-global-assign
            self = this
            this.$axios
              // .post(axiosJson.account.user_id_check, {
              .post(
                process.env.backendURL + axiosJson.account.user_name_check,
                {
                  en_seq: this.enterpriseCompData.selectedValue,
                  name: this.name
                }
              )
              .then(function(response) {
                if (response.data) {
                  if (self.enName !== self.enNameCheck) {
                    document.getElementById("enterpriseName").focus()
                    return alert(self.$t("please check company"))
                  }
                  self.nameCheck = self.name
                  alert(self.$t("account")[22])
                } else {
                  self.nameCheck = undefined
                  alert(self.$t("account")[23])
                }
              })
              .catch(function(error) {
                console.log(error)
              })
          }
        } else {
          document.getElementById("accountName").focus()
          alert(this.$t("account")[24])
        }
      } else {
        alert(this.$t("please select enterprise"))
      }
    },
    // 이메일 체크하는 함수
    emailCheckBtnClick() {
      this.enterpriseEmailCheck = this.enNameCheck
      if (this.enName !== "") {
        if (this.EMail) {
          // eslint-disable-next-line no-global-assign
          self = this
          this.$axios
            // .post(axiosJson.account.user_id_check, {
            .post(process.env.backendURL + axiosJson.account.user_email_check, {
              email: this.EMail,
              en_seq: this.enterpriseCompData.selectedValue
            })
            .then(function(response) {
              if (response.data) {
                if (self.enName !== self.enNameCheck) {
                  document.getElementById("enterpriseName").focus()
                  return alert(self.$t("please check company"))
                }
                self.EMailCheck = self.EMail
                alert(self.$t("account")[26])
              } else {
                self.EMailCheck = undefined
                alert(self.$t("account")[27])
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        } else {
          document.getElementById("accountEMail").focus()
          alert(this.$t("account")[28])
        }
      } else {
        alert(this.$t("please enter enterprise"))
      }
    },
    // 입력한 기업으로 기업seq를 가져온다
    enterpriseCheckBtnClick() {
      if (this.enName !== "") {
        // if (this.enName) {
        const pattern = /\s/g
        if (this.enName.match(pattern)) {
          alert(this.$t("no spaces text"))
        } else {
          // eslint-disable-next-line no-global-assign
          self = this
          this.$axios
            // .post(axiosJson.account.user_id_check, {
            .post(
              process.env.backendURL + axiosJson.account.en_list_where_enName,
              {
                enName: this.enName,
                language: sessionStorage.getItem("languageCode")
              }
            )
            .then(function(response) {
              console.log(response.data)
              if (response.data.length) {
                // 기업확인 버튼클릭 후 존재하는 기업이 확인되었을때 해당기업이름을 변수에 저장 --> 회원가입확인버튼을 누를 때 기업확인하기위해서
                self.enNameCheck = self.enName
                self.enterpriseCompData.selectedValue = response.data[0].en_seq

                // 기업번호를 가져오면 본부리스트를 가져온다
                getInfo.hq(response.data[0].en_seq).then(res => {
                  getInfo.hqCompData.options = res
                  self.hqCompData = getInfo.hqCompData
                })
                getInfo.branchCompData.options = undefined
                alert(self.$t("exist company"))
              } else {
                getInfo.hqCompData.options = undefined
                getInfo.branchCompData.options = undefined
                self.enNameCheck = ""
                alert(self.$t("not exist company"))
              }
            })
            .catch(function(error) {
              console.log(error)
            })
        }
        // } else {
        //   document.getElementById("accountName").focus()
        //   alert(this.$t("account")[24])
        // }
      } else {
        alert(this.$t("please enter enterprise"))
      }
    },
    signUpBtnClick() {
      if (this.deviceTypeCompData.selectedValue === 3) {
        // eslint-disable-next-line no-global-assign
        self = this
        if (
          !this.id ||
          !this.password ||
          !this.passwordCheck ||
          !this.name ||
          !this.EMail ||
          !this.enterpriseCompData.selectedValue ||
          !this.hqCompData.selectedValue ||
          !this.branchCompData.selectedValue
        )
          return alert(this.$t("account")[6])

        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck)
          return alert(this.$t("account")[8])

        if (this.name !== this.nameCheck) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        if (this.EMail !== this.EMailCheck) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }

        // 확인된 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enName !== this.enNameCheck) {
          document.getElementById("enterpriseName").focus()
          return alert(this.$t("please check company"))
        }

        // 이름 확인했을때의 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enterpriseNameCheck !== this.enName) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        // 이메일 확인했을때의 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enterpriseEmailCheck !== this.enName) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }
        this.$axios
          // .post(axiosJson.account.user_insert, {
          .post(process.env.backendURL + axiosJson.account.user_insert, {
            id: this.id,
            password: this.password,
            name: this.name,
            email: this.EMail,
            en_seq: this.enterpriseCompData.selectedValue,
            hq_seq: this.hqCompData.selectedValue,
            br_seq: this.branchCompData.selectedValue,
            device_type: this.deviceTypeCompData.selectedValue
          })
          .then(function(response) {
            if (response.data) {
              alert(self.$t("account")[9])
              window.open("/", "_self")
            } else alert(self.$t("account")[10])
          })
          .catch(function(error) {
            console.log(error)
          })
      } else if (this.deviceTypeCompData.selectedValue === 2) {
        // 디바이스타입이 글라스라면
        if (
          // 빈값이나 선택값이 남아있는 경우 팝업창
          !this.id ||
          !this.password ||
          !this.passwordCheck ||
          !this.name ||
          !this.EMail ||
          !this.enterpriseCompData.selectedValue ||
          !this.hqCompData.selectedValue ||
          !this.branchCompData.selectedValue
        )
          return alert(this.$t("account")[6])

        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck)
          return alert(this.$t("account")[8])

        if (this.name !== this.nameCheck) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }
        if (this.EMail !== this.EMailCheck) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }
        // 확인된 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enName !== this.enNameCheck) {
          document.getElementById("enterpriseName").focus()
          return alert(this.$t("please check company"))
        }

        // 이름 확인했을때의 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enterpriseNameCheck !== this.enName) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        // 이메일 확인했을때의 기업명과 회원가입 확인눌렀을때의 기업명과 같은지 확인
        if (this.enterpriseEmailCheck !== this.enName) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }
        // Qr생성 true
        this.isCreateQR = true

        // const enSelect = document.querySelectorAll("select")[1]
        const hqSelect = document.querySelectorAll("select")[1]
        const brSelect = document.querySelectorAll("select")[2]

        const QrInfo =
          '{"id":"' +
          this.id +
          '","name":"' +
          this.name +
          '","email":"' +
          this.EMail +
          '","password":"' +
          this.password +
          '","enSeq":"' +
          this.enterpriseCompData.selectedValue +
          '","enAlias":"' +
          this.enNameCheck +
          '","hqSeq":"' +
          this.hqCompData.selectedValue +
          '","hqAlias":"' +
          hqSelect[hqSelect.selectedIndex].text +
          '","brSeq":"' +
          this.branchCompData.selectedValue +
          '","brAlias":"' +
          brSelect[brSelect.selectedIndex].text +
          '"}'
        console.log(QrInfo)

        const opts = {
          errorCorrectionLevel: "H",
          type: "image/png",
          quality: 0.3,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff"
          }
        }
        const qr = QRCode.create(QrInfo, opts)
        console.log(qr)
        const imgUrl = QRCode.toDataURL(QrInfo, opts)

        // prototype promise
        imgUrl.then(value => {
          this.qrCodeImg = value
        })
      } else alert(this.$t("account")[2])
    }
  },
  mounted() {
    getInfo.setLang(this.$t("getInfo"))
  }
}
</script>

<style lang="sass" scoped>
// .account
// 	width: 100%
// 	min-width: 1260px
// 	height: 100%
// 	background: #EFF0F1

// .accountWin
// 	width: 1170px
// 	height: 900px
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

.accountRight
	height: 100%
	width: 100%
	border: 1px solid #4D4D4D
	overflow-y: scroll
	background: #2A2A2A 0% 0% no-repeat padding-box
	// opacity: 0.95

	>a
		color: #26439A
		font-weight: 800
		margin-bottom: 30px

.maxWidth
	width: 455px
	padding: 10px

	.title
		width: 100%
		margin-bottom: 15px
		color: white

		>span
			font-size: 20px
			text-align: center

		>button
			margin-left: 10px

	input[type=password]
		font-family: auto
		>::placeholder
			font-family: monospace

	>.input,
	>select
		outline: none
		width: 100%
		color: white
		padding: 16px
		font-size: 15px
		font-weight: bold
		margin-top: 12px
		background-color: #3E3E3E
		opacity: 1
		border: 1px solid #4B4B4B

	>.idInput
    display: flex
    flex-direction: column
	.nameInput
    display: flex
    flex-direction: column
	.emailInput,
	.enInput
		outline: none !important
		width: 78.2%
		color: white
		padding: 15px 10px
		background-color: #3E3E3E
		opacity: 1
		border: 1px solid #4B4B4B
		font-size: 15px
		font-weight: bold
		margin-top: 10px
		margin-right: 10px
		@media screen and (max-width: 468px)
			// width: inherit
			margin-right: 8px
			padding: 15px 8px
			font-size: 13px

	>.signUpBtn
		width: 100%
		padding: 16px
		margin-top: 8px
		background: #2386D2
		color: white

	>.idChkBtn,
	.nameChkBtn
		width: 18.8%
		padding: 15px
		margin-top: 11px
		background: #2386D2
		color: white
		@media screen and (max-width: 468px)
			// width: inherit
			font-size: 13px
			padding: 15px 0px
			// margin-right: 10px

::placeholder
	color: #696969

.qrcode
	>.emptyQrCode
      display: flex
      justify-content: center
	>.loadQrCode
    width: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

		>span
			margin-top: 20px
			margin-left: auto
			margin-right: auto
			color: white

.emptyQrCodeBox
	width: 320px
	height: 320px
	background-color: #efefef

.qrcode-enter-active, .qrcode-leave-active
	transition: opacity .5s

.qrcode-enter, .qrcode-leave-to
	opacity: 0

input:focus
	border: 2px solid #2386D2 !important

select:focus
	border: 2px solid #2386D2 !important

@media screen and (max-width: 500px)
	.account
		min-width: unset

	.accountWin
		width: inherit

	.accountRight
		width: inherit
		padding: 10px


		.maxWidth
			width: inherit

	.accountWinImg
		display: none

	.accountRight>a
		margin-bottom: unset
</style>
