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
        <input class="idInput col" id="accountID" :placeholder="$t('account')[13]" v-model="id" @keyup.enter="idCheckBtnClick" />
        <button class="idChkBtn col-auto" @click="idCheckBtnClick">{{ $t("account")[18] }}</button>
        <input class="input" id="accountPWD" :placeholder="$t('account')[14]" v-model="password" @change="passWordPaternCheck()" type="password" />
        <!-- 비밀번호 규칙이 있는 경우만 -->
        <span v-if="checkPatern == 'true'" class="pswPatern">{{ $t("checkPswPatern")[0] }}</span>
        <input class="input" :placeholder="$t('account')[15]" v-model="passwordCheck" type="password" />
        <input class="nameInput col" id="accountName" :placeholder="$t('account')[16]" v-model="name" @keyup.enter="nameCheckBtnClick" />
        <button class="nameChkBtn col-auto" @click="nameCheckBtnClick">{{ $t("account")[18] }}</button>
        <input class="emailInput" id="accountEMail" :placeholder="$t('account')[17]" v-model="EMail" @keyup.enter="emailCheckBtnClick" />
        <button class="nameChkBtn col-auto" @click="emailCheckBtnClick">{{ $t("account")[18] }}</button>
        <input
          v-if="deviceTypeCompData.selectedValue == 3"
          class="input"
          id="birthday"
          :placeholder="$t('account')[35]"
          v-model="birthday"
          type="birthday"
        />
        <input
          v-if="deviceTypeCompData.selectedValue == 3"
          id="phoneNumber"
          :placeholder="$t('account')[33]"
          v-model="phoneNum"
          :class="[check2Factor != 'True' ? 'input' : checkAdminId == true ? 'input' : 'phoneInput']"
        />
        <button
          v-if="deviceTypeCompData.selectedValue == 3 && check2Factor == 'True' && checkAdminId == false"
          class="phoneChkBtn col-auto"
          id="verifyBtn"
          @click="phoneCheckBtnClick"
        >
          {{ $t("account")[34] }}
        </button>
        <selectComp :compData="deviceTypeCompData"></selectComp>
        <selectComp :compData="enterpriseCompData"></selectComp>
        <selectComp :compData="hqCompData"></selectComp>
        <selectComp :compData="branchCompData"></selectComp>
        <div class="policyNotice col-auto">
          <div class="policyWrap" id="policyCheck">
            <input type="checkbox" class="policyCheck" v-model="policyCheck" />
            <span>{{ $t("personalTermAgree")[0] }}</span>
          </div>
          <button class="policyBtn" @click="openPolicy()">{{ $t("personalTermAgree")[1] }}</button>
        </div>
        <button class="signUpBtn" @click="signUpBtnClick">{{ !deviceTypeCompData.selectedValue || deviceTypeCompData.selectedValue == 3 ? $t("account")[19] : $t("account")[20] }}</button>
      </div>
      <div v-else class="maxWidth qrcode">
        <transition name="qrcode" mode="out-in">
          <div v-if="!qrCodeImg"  class="emptyQrCode" key="emptyQrCode">
            <div class="col-12 row justify-center">
              <div class="emptyQrCodeBox"></div>
            </div>
            <span>{{ $t("account")[0] }}</span>
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
import QRCode from "qrcode"
import getInfo from "@/assets/scripts/info/getInfo"
import axiosJson from "@/assets/jsons/axios"

import { danalVerify } from "@/assets/scripts/danalVerify"

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
      enSeqCheck: undefined,
      phoneNum: "",
      phoneCheck: undefined,
      certificationUniqueKey: "",
      birthday: "",
      birthdayCheck: undefined,
      useEnterprise: process.env.useEnterprise,
      check2Factor: "False",
      checkAdminId: false,
      policyCheck: false,
      bypassId: [],
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
      ret: undefined,
      checkPhone: undefined,
      checkPatern: process.env.checkPswPatern,
      syncManager2: false,
      manager2ServerUrl: "https://dev.watttalk.kr:8222"
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
        // eslint-disable-next-line no-useless-escape
        if (!/^[A-Za-z0-9_\-]{4,50}$/.test(this.id))
          return alert(this.$t("account")[11])
        // eslint-disable-next-line no-global-assign
        self = this
        this.$axios
          // .post(axiosJson.account.user_id_check, {
          .post(process.env.backendURL + axiosJson.account.user_id_check, {
            id: this.id
          })
          .then(function(response) {
            if (response.data) {
              self.idCheck = self.id
              if (self.syncManager2) {
                self.$axios
                  .post(self.manager2ServerUrl + axiosJson.manger2Server.user_id_check, {
                    user_id: self.id
                  })
                  .then((res) => {
                    if (res.data.data.result == true) {
                      alert(self.$t("account")[3])
                      document.getElementById("accountPWD").focus()
                    } else {
                      self.idCheck = undefined
                     alert(self.$t("account")[4])
                    }
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              } else {
                console.log("===================================")
                alert(self.$t("account")[3])
                document.getElementById("accountPWD").focus()
              }
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
      this.enterpriseEnseq = this.enterpriseCompData.selectedValue
      if (this.enterpriseCompData.selectedValue) {
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
                  if (self.syncManager2) {
                    self.$axios
                      .post(self.manager2ServerUrl + axiosJson.manger2Server.user_name_check, {
                        en_seq: self.enterpriseCompData.selectedValue,
                        user_name: self.name
                      })
                      .then((res) => {
                        if (res.data.data.result == true) {
                          self.nameCheck = self.name
                          alert(self.$t("account")[22])
                        } else {
                          self.nameCheck = undefined
                          alert(self.$t("account")[23])
                        }
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                  } else {
                    self.nameCheck = self.name
                    alert(self.$t("account")[22])
                  }
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
      self = this
      this.enSeqCheck = this.enterpriseCompData.selectedValue
      if (this.enterpriseCompData.selectedValue) {
        if (this.EMail) {
          // eslint-disable-next-line no-global-assign
          this.$axios
            // .post(axiosJson.account.user_id_check, {
            .post(process.env.backendURL + axiosJson.account.user_email_check, {
              email: this.EMail,
              en_seq: this.enterpriseCompData.selectedValue
            })
            .then(function(response) {
              if (response.data) {
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
        alert(this.$t("please select enterprise"))
      }
    },
    async phoneCheckBtnClick() {
      if (this.enterpriseCompData.selectedValue == undefined) {
        alert(this.$t("phonCheck")[0])
      } else if (!this.name) {
        alert(this.$t("phonCheck")[1])
      } else if (!this.birthday) {
        alert(this.$t("phonCheck")[2])
      } else if (!this.phoneNum) {
        alert(this.$t("phonCheck")[3])
      } else {
        // 휴대폰번호 중복 첵크
        this.$axios
        .post(process.env.backendURL + axiosJson.account.user_phone_number_check, {
          phone_number: this.phoneNum,
          en_seq: this.enterpriseCompData.selectedValue
        })
        .then((res) => {
          if (res.data == true) {
            const params = {
              name: this.name,
              birthday: this.birthday,
              phone: this.phoneNum,
              lang: sessionStorage.getItem("languageCode")
            }
            danalVerify(params, 1)
          } else if (res.data == false) {
            alert(this.$t("phonCheck")[4])
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    },
    signUpBtnClick() {
      let checkVerify = sessionStorage.getItem("verify")
      console.log(checkVerify, 1)
      if (this.check2Factor != "True") {
        checkVerify = "true"
        this.phoneCheck = this.phoneNum
        this.birthdayCheck = this.birthday
      }
      if (this.checkAdminId == true) {
        checkVerify = "true"
        this.phoneCheck = this.phoneNum
        this.birthdayCheck = this.birthday
      }
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
          !this.branchCompData.selectedValue ||
          !this.phoneNum ||
          !this.birthday
        ) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[6])
        }
        const checkPhoneStyle = this.filterKeyPress(this.phoneNum, 1)
        const checkBirthStyle = this.filterKeyPress(this.birthday, 2)
        if (checkBirthStyle == false) {
          document.getElementById("birthday").focus()
          return alert(this.$t("account")[39])
        }
        if (checkPhoneStyle == false) {
          document.getElementById("phoneNumber").focus()
          return alert(this.$t("account")[40])
        }
        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck) {
          document.getElementById("accountPWD").focus()
          return alert(this.$t("account")[8])
        }
        if (this.name !== this.nameCheck) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        if (this.EMail !== this.EMailCheck) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }

        if (this.enterpriseEnseq !== this.enterpriseCompData.selectedValue) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        if (this.enSeqCheck !== this.enterpriseCompData.selectedValue) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }
        if (checkVerify != "true") {
          document.getElementById("verifyBtn").focus()
          return alert(this.$t("account")[38])
        }
        if (this.phoneNum != this.phoneCheck) {
          document.getElementById("verifyBtn").focus()
          return alert(this.$t("account")[41])
        }
        if (this.policyCheck == false) {
          document.getElementById("policyCheck").focus()
          return alert(this.$t("personalTermAgree")[2])
        }
        this.$axios
          .post(process.env.backendURL + axiosJson.account.user_phone_number_check, {
            phone_number: this.phoneNum,
            en_seq: this.enterpriseCompData.selectedValue
          })
          .then((res) => {
            if (res.data == true) {
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
                  device_type: this.deviceTypeCompData.selectedValue,
                  phone_number: this.phoneNum,
                  birthday: this.birthday,
                  certification_uniquekey: this.certificationUniqueKey,
                  personal_information_checked: 1
                })
                .then(function(response) {
                  if (response.data) {
                    if (self.syncManager2) {
                      self.$axios
                      .post(self.manager2ServerUrl + axiosJson.manger2Server.user_insert, {
                        user_id: self.id,
                        user_password: self.password,
                        user_name: self.name,
                        phone_number: "",
                        en_seq: self.enterpriseCompData.selectedValue,
                        hq_seq: self.hqCompData.selectedValue,
                        br_seq: self.branchCompData.selectedValue,
                        device_type: self.deviceTypeCompData.selectedValue,
                        email: "",
                        privacy_essential_agree: 1,
                        privacy_optional_agree: 1,
                        birthday: "",
                        certification_uniquekey: "",
                      })
                      .then((secondResponse) => {
                        console.log(secondResponse)
                        if (secondResponse.data.data.result == true) {
                          alert(self.$t("account")[9])
                          window.open("/", "_self")
                        } else {
                          alert(self.$t("account")[10])
                        }
                      })
                    } else {
                      alert(self.$t("account")[9])
                      window.open("/", "_self")
                    }
                  } else alert(self.$t("account")[10])
                })
                .catch(function(error) {
                  console.log(error)
                })
            } else if (res.data == false) {
              return alert(this.$t("phonCheck")[4])
            }
          })
          .catch((err) => {
            console.log(err)
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
        ) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[6])
        }
        if (this.id !== this.idCheck) {
          document.getElementById("accountID").focus()
          return alert(this.$t("account")[7])
        }

        if (this.password !== this.passwordCheck) {
          document.getElementById("accountPWD").focus()
          return alert(this.$t("account")[8])
        }
        if (this.name !== this.nameCheck) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }
        if (this.EMail !== this.EMailCheck) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }

        if (this.enterpriseEnseq !== this.enterpriseCompData.selectedValue) {
          document.getElementById("accountName").focus()
          return alert(this.$t("account")[25])
        }

        if (this.enSeqCheck !== this.enterpriseCompData.selectedValue) {
          document.getElementById("accountEMail").focus()
          return alert(this.$t("account")[29])
        }
        // Qr생성 true
        this.isCreateQR = true

        const enSelect = document.querySelectorAll("select")[1]
        const hqSelect = document.querySelectorAll("select")[2]
        const brSelect = document.querySelectorAll("select")[3]

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
          enSelect[enSelect.selectedIndex].text +
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
    },
    openPolicy() {
      const curLang = sessionStorage.getItem("languageCode")
      if (curLang == "ko") {
        window.open("/policy/korean")
      } else {
        window.open("/policy/english")
      }
    },
    // 본인 인증 후 정보를 갖고 오는 로직.
    // 갖고 오면 바로 지워줘야함
    sessionStorageChange() {
      this.phoneCheck = sessionStorage.getItem("phoneNum")
      this.certificationUniqueKey = sessionStorage.getItem("uniqueKey")
      sessionStorage.removeItem("phoneNum")
      sessionStorage.removeItem("uniqueKey")
      sessionStorage.removeItem("birthday")
    },
    // 생년월일과 휴대폰번호 입력란 확인 함수
    filterKeyPress(params, type) {
      const patern = /^\d+$/
      if (type == 1) {
        if (params.length != 11) {
          return false
        } else {
          if (patern.test(params)) {
            return true
          } else {
            return false
          }
        }
      }
      else if (type == 2) {
        if (params.length != 8) {
          return false
        } else {
          if (patern.test(params)) {
            return true
          } else {
            return false
          }
        }
      }
      
    },
    // 비밀번호 규칙이 있을 경우만
    passWordPaternCheck() {
      if (this.checkPatern == "true") {
        const psw = this.password
        if (psw.length < 10) {
          alert(this.$t("checkPswPatern")[1])
          this.password = ""
          return
        }
        const capitalPatern = /[A-Z]/g
        const lowerPatern = /[a-z]/g
        const specialPatern = /[^A-Za-z0-9]/g
        const numPatern = /\d+/g
        let checkPatern = 0
        if (capitalPatern.test(psw)) {
          checkPatern = ++checkPatern
        }
        if (lowerPatern.test(psw)) {
          checkPatern = ++checkPatern
        }
        if (specialPatern.test(psw)) {
          checkPatern = ++checkPatern
        }
        if (numPatern.test(psw)) {
          checkPatern = ++checkPatern
        }
        if(checkPatern < 2) {
          alert(this.$t("checkPswPatern")[2])
          this.password = ""
          checkPatern = 0
        }
      }
      return
    }
  },
  mounted() {
    getInfo.setLang(this.$t("getInfo"))
    // dlenc 분기처리!!
    if (window.location.hostname == 'dlenc.watttalk.kr') {
      this.useEnterprise = "dlenc"
    } else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
      this.useEnterprise = "dlenc"
    }
    if (process.env.manager2serverURL !== "") {
      this.syncManager2 = true
      if (window.location.hostname.includes("localhost")) {
        this.manager2ServerUrl = "https://dev.watttalk.kr:8222" + process.env.manager2serverURL
      } else {
        this.manager2ServerUrl = window.location.origin +  process.env.manager2serverURL
      }
    }
    // 본인인증 후 data를 받아오기 위한 event
    window.addEventListener("sessionStorageUpdated", this.sessionStorageChange)
  },
  beforeDestroy() {
    window.removeEventListener("sessionStorageUpdated", this.sessionStorageChange)
    sessionStorage.removeItem("verify")
  },
  computed: {
    get2Factor() {
      return this.branchCompData.selectedValue
    },
    checkAdmin() {
      return this.id
    }
  },
  watch: {
    // 기업>본부>지사 선택시 2Factor값 확인하는 부분
    get2Factor() {
      if (this.enterpriseCompData.selectedValue && this.hqCompData.selectedValue && this.branchCompData.selectedValue) {
        const self = this
        this.$axios
          .post(process.env.backendURL + axiosJson.app.app_powertalkweb_info, {
            en_seq: this.enterpriseCompData.selectedValue,
            hq_seq: this.hqCompData.selectedValue,
            br_seq: this.branchCompData.selectedValue,
          })
          .then((res) => {
            const jsonFactorList = res.data[0].app_detail_json
            const factorList = JSON.parse(jsonFactorList)
            self.check2Factor = factorList["2factor"]
            this.bypassId = factorList["2factorBypassId"].split(",")
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
    checkAdmin(res) {
      if (res.includes("wattsupport")) {
        this.checkAdminId = true
      } else {
        this.checkAdminId = false
      }
      if (this.bypassId.length != 0)
      this.bypassId.forEach(ele => {
          if (ele == res) {
            this.checkAdminId = true
          } else {
            false
          }
      });
    },
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

input,
button,
select
	border-radius: 3px

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
	> select,
		outline: none !important
		width: 100%
		color: white
		padding: 16px
		font-size: 15px
		font-weight: bold
		margin-top: 12px
		background-color: #3E3E3E
		opacity: 1
		border: 1px solid #4B4B4B
		@media screen and (max-width: 768px)
			padding: 8px 8px

	>.idInput,
	.nameInput,
	.emailInput
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
		outline: none
		@media screen and (max-width: 768px)
			// width: inherit
			margin-right: 8px
			padding: 10px 8px
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
		float: right
		@media screen and (max-width: 768px)
			// width: inherit
			font-size: 13px
			padding: 10px 0px
			// margin-right: 10px'
    
  
::placeholder
	color: #696969


.phoneInput
  width: 77.5%
  color: white
  padding: 15px 10px
  background-color: #3E3E3E
  opacity: 1
  border: 1px solid #4B4B4B
  font-size: 15px
  font-weight: bold
  margin-top: 10px
  margin-right: 10px
  outline: none
  @media screen and (max-width: 768px)
    // width: inherit
    margin-right: 8px
    padding: 10px 8px
    font-size: 13px
.phoneChkBtn
  width: 19.5%
  padding: 15px
  margin-top: 11px
  background: #2386D2
  color: white
  float: right
  @media screen and (max-width: 768px)
    font-size: 13px
    padding: 10px 0px


.birthdayInput
.qrcode
  > .emptyQrCode
    display: flex
    justify-content: center

  > .loadQrCode
    width: 100%
    height: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

    > span
      margin-top: 20px
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
	// border: 1px solid #2386D2 !important

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
.policyNotice
  margin-top: 7px
  font-family: auto
  color: white
  width: 100%
  height: 30px
  display: flex
  justify-content: space-between
  align-items: center
  .policyWrap
    height: 30px
    display: flex
    justify-content: flex-start
    align-items: center
    input
      margin-right: 5px
  button
    color: white
.pswPatern
  color: red
  margin-top: 10px
</style>
