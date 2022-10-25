<template lang="pug">
.row.justify-center.items-center.index
  .row.justify-center.items-center.indexWin
    //-img(src="@/assets/images/login_banner.png").indexWinImg.col-6
    .lang
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
    .col-6.row.items-center.indexRight
      .column.col-12.items-center.indexRightContent
        .col-12.row.justify-center
          img(v-if="useEnterprise == 'samsung'" src="@/assets/images/samsung_logo.png").loginContentLogo
          //- img(src="@/assets/images/kpjb_logo.png").loginContentLogo
          //-img(src="@/assets/images/samsung_engineering_logo.png").loginContentLogo
          //- img(src="@/assets/images/komipo_logo.png").loginContentLogo
          //- img(src="@/assets/images/login_logo.png").loginContentLogo
          //- span.col-12.text-center.loginContentLogoText {{ $t("login logo text") }}
          //- img(v-if="$i18n.locale == 'en'" src="@/assets/images/logo_watt_en.png").loginContentEnglishLogo
          //- img(v-else-if="$i18n.locale == 'ko'" src="@/assets/images/logo_watt.png").loginContentLogo
          img(v-if="useEnterprise == 'watt' && langImg == 'ko'", src="@/assets/images/logo_watt.png").loginContentLogo
          img(v-else-if="useEnterprise == 'watt' && langImg == 'en'", src="@/assets/images/logo_watt_en.png").loginContentEnglishLogo
          img(v-if="useEnterprise == 'ex'" src="@/assets/images/ex_pt_login.png").exloginContentLogo
          img(v-if="useEnterprise == 'cmss'" src="@/assets/images/logo_komipo.png").cmssloginContentLogo
          img(v-if="useEnterprise == 'kdhc'" src="@/assets/images/logo_kdhc.png").kdhcloginContentLogo
          //- img(src="@/assets/images/logo_komipo.png").loginContentLogo
        .col-12.maxWidth
          input(id="idInput", placeholder="ID", @keyup.enter="signInBtnClick").input
          input(id="pwdInput", placeholder="Password", type="password", @keyup.enter="signInBtnClick").input
          img(@click="pwdActivation($event)" src="@/assets/images/ic_password_disabled.png").pwdView
          button(@click="signInBtnClick").signInBtn {{ $t("login") }}
          .text
            span(@click="forgotPwdBtnClick").text1 {{ $t("forgot") }}
            span(@click="createAccountBtnClick").text2 {{ $t("create account") }}
      .text4Conatainer.row.col-12.justify-center
        .text4.col-12(:style="{marginTop: $i18n.locale == 'en' ? '30px' : '30px' }")
          span.justify-center Watt Talk 2.0
        .text4.col-12
          span.justify-center Copyright © 2020 WATT CO.LTD. All Rights Reserved.
    //-notice
</template>

<script>
import axiosJson from "@/assets/jsons/axios"
import forgotPasswordModal from "@/components/forgotPasswordModal/form"
import createAccountModal from "@/components/createAccountModal/form"
import guideAlertModal from "@/components/info/guideAlert"
import notice from "@/components/notice"
import domain from "@/assets/jsons/domain/domain"
import cookieSetting from "@/assets/scripts/data/cookie"

export default {
  components: { notice },
  data() {
    return {
      // 수정
      id: undefined,
      password: undefined,
      langImg: "ko",
      state: false,
      curLang: this.$t("lang")[0],
      koflag: require("@/assets/images/img.png"),
      enflag: require("@/assets/images/american.png"),
      useEnterprise: domain.useEnterprise,
      isMember: false,
      reservId: undefined,
      params: "",
      reservUserId: ""
    }
  },
  methods: {
    forgotPwdBtnClick() {
      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
      modalsContainerStyle.display = "block"

      this.$modal.show(
        forgotPasswordModal,
        {},
        {
          name: "forgotPasswordModal",
          // width: innerWidth <= 500 ? 340 : 700,
          width: innerWidth <= 700 ? "90%" : 700,
          height: innerHeight <= 480 ? "90%" : 480,
          clickToClose: false,
          scrollable: innerHeight <= 750
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none"
          }
        }
      )
    },
    createAccountBtnClick() {
      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
      modalsContainerStyle.display = "block"

      this.$modal.show(
        createAccountModal,
        {},
        {
          name: "createAccountModal",
          // width: innerWidth <= 500 ? 320 : 700,
          width: innerWidth <= 700 ? "90%" : 700,
          height: innerHeight <= 886 ? "90%" : 886,
          clickToClose: false
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none"
          }
        }
      )
    },
    guideAlert() {
      const modalsContainerStyle = document.getElementById("modalsContainer")
        .style
      modalsContainerStyle.display = "block"

      this.$modal.show(
        guideAlertModal,
        {},
        {
          name: "guideAlertModal",
          clickToClose: false,
          width: innerWidth <= 350 ? 320 : 350,
          height: 270,
          pivotX: 0.5,
          pivotY: 0.5,
          styles: {
            left: "10% !important"
          }
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none"
          }
        }
      )
    },
    switchLocale(locale, e) {
      sessionStorage.setItem("languageCode", locale)
      this.curLang = e.target.innerHTML
      this.flag = e.target.previousSibling.src
      location.reload()
    },
    signInBtnClick() {
      // powertalk -> watttalk 도메인 변경 모달을 강제로 닫고 로그인시도할때
      const href = window.location.href
      if (href.includes("powertalk")) {
        this.$emit("child")
        return
      }

      // 2021.04.14 ksh :: 파워톡 -> 파워매니저 영상관리 접근 시 로그아웃 숨김으로 인해 등록했던 localStorage를 초기화
      localStorage.removeItem("logoutStatus")
      const userId = document.getElementById("idInput").value
      const userPwd = document.getElementById("pwdInput").value

      if (userId && userPwd) {
        const self = this
        this.$axios
          // .post(axiosJson.account.user_id_pw_check, {
          // 	id: this.id,
          // 	password: this.password
          // })
          .post(domain.domain.backend1 + axiosJson.account.user_id_pw_check, {
            id: userId,
            password: userPwd
          })
          .then(function(response) {
            // eslint-disable-next-line no-unused-vars
            const lang = sessionStorage.getItem("languageCode")

            if (response.data[0] === 1) {
              console.log(response.data[1])
              cookieSetting.setCookie("logined", userId, 3)
              localStorage.setItem("jwt", response.data[2])
              localStorage.setItem("userSeq", response.data[1].user_seq)
              localStorage.setItem("enSeq", response.data[1].en_seq)
              localStorage.setItem("hqSeq", response.data[1].hq_seq)
              localStorage.setItem("brSeq", response.data[1].br_seq)
              localStorage.setItem("auth", response.data[1].auth)
              localStorage.setItem("id", response.data[1].id)
              localStorage.setItem("deviceType", response.data[1].device_type)
              if (response.data[1].auth === 4)
                window.open(
                  "/attachment/video?page=1&viewType=gallery",
                  "_self"
                )
              else if (response.data[1].device_type === 2)
                window.open("/attachment/memo?page=1&viewType=gallery", "_self")
              // 수정
              else {
                // 회원이 이메일로 회의실입장하려고 하는 경우
                /* 1. reservUserId --> 이메일 타고 들어온 사용자의 아이디
									 2. isMember -> 이메일을 타고 들어왔는지판단 (true == 이메일로 접근) */

                // 두가지 조건이 만족하면 회원입장 페이지로 이동
                if (self.isMember && self.reservUserId === userId) {
                  self.params =
                    response.data[2] +
                    "&login_type=1&lang=" +
                    lang +
                    "&reservId=" +
                    self.reservId
                  // 이메일을 타고 들어온 회원이지만 (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
                } else if (self.isMember && self.reservUserId !== userId) {
                  alert(
                    self.$t("not invited meeting") +
                      "\n" +
                      self.$t("go to the contact screen")
                  )
                  self.params = response.data[2] + "&login_type=1&lang=" + lang
                  // 이메일을 타고들어온 회원이 아님  && (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
                } else {
                  self.params = response.data[2] + "&login_type=1&lang=" + lang
                }

                /* 와트톡 로그인 체크 페이지로 이동 */
                if (domain.domain.powertalk.state[0] === "loginCheck") {
                  // 로컬
                  if (window.location.hostname === "localhost") {
                    window.open(
                      domain.domain.powertalk.state[1] + self.params,
                      "_self"
                    )
                    // 와트톡
                  } else {
                    window.open(
                      domain.domain.powertalk.state[2] + self.params,
                      "_self"
                    )
                  }
                  /* powertalk1으로 이동 */
                } else {
                  const randomNumber =
                    Math.floor(Math.random() * (10000 - 1 + 1)) + 1
                  window.open("/powertalk/index.html?" + randomNumber, "_self")
                }
                // window.open(
                //   domain.powertalk.loginCheck +
                //     response.data[2] +
                //     "&login_type=1&lang=" +
                //     lang,
                //   "_self"
                // )
              }
              // else if (window.location.hostname === "localhost") {
              //   window.open(
              //     "http://localhost:3000/login/login-check?jwt_token=" +
              //       response.data[2] +
              //       "&login_type=1&lang=" +
              //       lang,
              //     "_self"
              //   )
              // } else {
              //   window.open(
              //     "https://powertalk2.powertalk.co.kr:8118/login/login-check?jwt_token=" +
              //       response.data[2] +
              //       "&login_type=1&lang=" +
              //       lang,
              //     "_self"
              //   )
              // }
            } else if (response.data[0] === 2) {
              alert(self.$t("home")[0])
            } else alert(self.$t("home")[1])
          })
          .catch(function(error) {
            console.log(error)
          })
      } else alert(this.$t("home")[2])
    },
    // 패스워드 보기 활성화/비활성화
    pwdActivation(e) {
      const pwdInput = document.getElementById("pwdInput")
      if (e.target.classList.contains("Active")) {
        e.target.classList.remove("Active")
        e.target.src = require("@/assets/images/ic_password_disabled.png")
        pwdInput.type = "password"
      } else {
        e.target.classList.add("Active")
        console.log(e)
        e.target.src = require("@/assets/images/ic_password.png")
        pwdInput.type = "text"
      }
    }
  },
  mounted() {
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

    const memberReservId = this.$route.query.reservId
    if (memberReservId) {
      console.log("reservID -> return userID")
      console.log(memberReservId)
      const self = this
      /* 회원이 이메일로 회의실 입장시도할 경우 reservId로 UserId 를 조회한다 --> 초대된 사용자인지 검증을 위함 */
      this.$axios
        .post(
          domain.domain.backend1 +
            axiosJson.account.select_id_where_reservation_uid,
          {
            reservation_uid: memberReservId
          }
        )
        .then(function(response) {
          console.log("reservId로 ID조회")
          console.log(response)
          self.reservUserId = response.data
        })
        .catch(function(error) {
          console.log(error)
        })

      /* 회원이 이메일로 회의실 접근할 경우 안내모달 띄움 */
      this.guideAlert()
      this.isMember = true
      this.reservId = memberReservId
      document.getElementById("idInput").focus()
    } else {
      /* 기존에 로그인해서 쿠키에 저장되어있던 사용자의 ID를 가져온다 */
      const loginedId = cookieSetting.getCookie("logined")

      /* 쿠키에 저장되어있던 사용자의 ID가 있다면 아이디입력칸에 ID를 넣어주고
		  비밀번호입력에 커서를 위치시킨다
			ID가 없다면 아이디 입력칸에 커서를 위치시킨다 */
      if (loginedId) {
        document.getElementById("idInput").value = `${loginedId}`
        document.getElementById("pwdInput").focus()
      } else {
        document.getElementById("idInput").focus()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.index
  width: 100%
  // min-width: $contentMaxWidth
  height: 100%
  background-image: radial-gradient(closest-side at 50% 50%, #2A2A2AF2 0%, #000000E8 100%), url("../../assets/images/login_background.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center
  overflow-y: scroll

.indexWin
  width: 618px
  height: 550px
  border: 1px solid #4D4D4D

.indexWinImg
  height: 100%

.indexRight
  height: 100%
  width: 100%
  background: #2A2A2A 0% 0% no-repeat padding-box

.indexRightContent
  margin-top: 85px

::placeholder
  color: #696969

.lang
  position: absolute
  top: 10px
  right: 20px
  z-index: 1

.maxWidth
  width: 455px

  input[type=password]
    font-family: auto

.input
  width: 100%
  padding: 20px
  color: white
  background-color: #3e3e3e
  font-size: 17px
  font-weight: 600
  outline: none

.input:nth-child(1)
  margin-top: 35px
  font-family: 'NanumSquare', sans-serif

.input:nth-child(2)
  margin-top: 8px

.signInBtn
  width: 100%
  padding: 20px
  margin-top: 8px
  background: #2386D2
  color: white

.text
  width: 100%
  font-size: 14px
  font-weight: bold
  margin-top: 15px
  margin-bottom: 120px

.text1
  color: #8D8D8D
  cursor: pointer

.text2
  float: right
  color: #2386D2
  cursor: pointer

.text3
  position: absolute
  font-size: 9px
  font-weight: bold
  color: #5B5B5B
  // margin-top: 150px //power, samsung
  // margin-top: 100px //kpjb

.text4
  font-size: 9px
  font-weight: bold
  color: #5B5B5B
  text-align: center
  >span
    width: 100%
.loginContentLogo
   width: 300px //komipo
   margin-top: 15px

.loginContentEnglishLogo
  width: 350px
  margin-bottom: 5px


.exloginContentLogo
	width: 383px
	margin-top: 15px
	margin-bottom: 10px


.cmssloginContentLogo
  width: 330px

.loginContentLogo2
  position: absolute
  color: white
  right: 1px
  bottom: 54px
  letter-spacing: 0px
  word-spacing: -2.5px
  font: normal normal bold 11.3px/18px NanumSquare

.loginContentLogoText
  font-size: 14px
  font-weight: bold
  margin-top: 4px

.localeBtn
  color: white

.pwdView
  position: absolute
  top: 125px
  right: 14px
  width: 25px
  cursor: pointer

@media screen and (max-width: 900px)
  .index
    min-width: unset
    background-color: white


  .indexWin
    width: inherit
    height: 100%

  .indexWinImg
    display: none

  .indexRight
    width: inherit
    height: 100%
    padding: 30px

  .maxWidth
    width: 100%

  .text3
    margin-top: 100px
    text-align: center

.localeBtn
	color: white
	top: 1px

.globalRight
	position: absolute
	right: -9px
	top: 3px
	width: 90px
	border: 1px solid #4d4d4d
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

@media screen and (max-width: 900px) and (orientation: landscape)
  .indexRight
    height: auto !important

@media screen and (max-width: 400px)
  .loginContentLogo,
  .loginContentEnglishLogo,
  .exloginContentLogo,
  .cmssloginContentLogo
    width: 300px !important
</style>
