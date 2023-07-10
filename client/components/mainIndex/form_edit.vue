<template>
  <div class="row justify-center items-center index">
    <div class="row justify-center items-center indexWin">
      <div class="lang">
        <div class="row localeBtn globalRight cursor-pointer">
          <div class="col-12 localeBtn" :class="'selected'" @click="state = !state">
            <img v-if="langImg == 'ko'" class="culLangImg" :src="koflag" />
            <img v-else-if="langImg == 'en'" class="culLangImg" :src="enflag" />
            <span>{{ curLang }}</span>
            <img src="@/assets/images/bt_kr-en.png" />
          </div>
          <div class="col-12 localeBtn cursor-pointer" v-show ="langImg != 'ko' && state">
            <img src="@/assets/images/img.png" />
            <span style="width:60%;" @click.prevent="switchLocale('ko', $event)">{{ $t("lang")[0] }}</span>
          </div>
          <div class="col-12 localeBtn cursor-pointer" v-show ="langImg != 'en' && state">
            <img src="@/assets/images/american.png" />
            <span style="width:60%;" @click.prevent="switchLocale('en', $event)">{{ $t("lang")[1] }}</span>
          </div>
        </div>
      </div>
      <div class="col-6 row items-center indexRight">
        <div class="column col items-center indexRightContent">
          <div class="col-12 row justify-center">
            <img v-if="useEnterprise == 'samsung'" class="loginContentLogo" src="@/assets/images/samsung_logo.png" />
            <img v-if="useEnterprise == 'watt' && langImg == 'ko'" class="loginContentLogo" src="@/assets/images/logo_watt.png" />
            <img v-else-if="useEnterprise == 'watt' && langImg == 'en'" class="loginContentEnglishLogo" src="@/assets/images/logo_watt_en.png" />
          </div>
          <div class="col-12 maxWidth">
            <input class="input" id="idInput" placeholder="ID" @keyup.enter="signInBtnClick" />
            <input class="input" id="pwdInput" placeholder="Password" type="password" @keyup.enter="signInBtnClick" />
            <button class="signInBtn" @click="signInBtnClick">{{ $t("login") }}</button>
            <div class="text">
              <span class="text1" @click="forgotPwdBtnClick">{{ $t("forgot") }}</span>
              <span class="text2" @click="createAccountBtnClick">{{ $t("create account") }}</span>
            </div>
          </div>
          <div class="text4" :style="{marginTop: $i18n.locale == 'en' ? '30px' : '30px' }">
            <span class="col-12 row justify-center">Power Talk 2.0</span>
          </div>
          <div class="text4">
            <span class="col-12 row justify-center">Copyright © 2020 WATT CO.LTD. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios"
import forgotPasswordModal from "@/components/forgotPasswordModal/form"
import createAccountModal from "@/components/createAccountModal/form"
import notice from "@/components/notice"

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
      useEnterprise: process.env.useEnterprise
    }
  },
  methods: {
    signInBtnClick() {
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
          .post(process.env.backendURL + axiosJson.account.user_id_pw_check, {
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
              sessionStorage.setItem("logined", response.data[1].id)
              if (response.data[1].auth === 4)
                window.open(
                  "/attachment/video?page=1&viewType=gallery",
                  "_self"
                )
              else if (response.data[1].device_type === 2)
                window.open("/attachment/memo?page=1&viewType=gallery", "_self")
              // 수정
              else {
                // eslint-disable-next-line no-lonely-if
                if (process.env.powertlakState === "loginCheck") {
                  if (window.location.hostname === "localhost") {
                    window.open(
                      process.env.powertalkLogin_local +
                        response.data[2] +
                        "&login_type=1&lang=" +
                        lang,
                      "_self"
                    )
                  } else {
                    window.open(
                      process.env.powertalkLogin +
                        response.data[2] +
                        "&login_type=1&lang=" +
                        lang,
                      "_self"
                    )
                  }
                } else {
                  const randomNumber =
                    Math.floor(Math.random() * (10000 - 1 + 1)) + 1
                  window.open("/powertalk/index.html?" + randomNumber, "_self")
                }
                // window.open(
                //   process.env.powertalk.loginCheck +
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
          width: 700,
          height: 480,
          clickToClose: false
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
          width: 700,
          height: 886,
          clickToClose: false
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
  // 2021.03.03 ksy :: login ID 기억기능 추가
  /* beforeMount() {
    const logined = sessionStorage.getItem("logined")
    console.log(logined)
    if (logined !== null) {
      this.id = sessionStorage.getItem("logined")
      document.getElementById("pwdInput").focus()
      document.getElementById("pwdInput").select()
    } else {
      document.getElementById("idInput").focus()
      document.getElementById("idInput").select()
    }
  } */
}
</script>

<style lang="sass" scoped>
.index
  width: 100%
  min-width: $contentMaxWidth
  height: 100%
  background-image: radial-gradient(closest-side at 50% 50%, #2A2A2AF2 0%, #000000E8 100%), url("../../assets/images/login_background.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center

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
  margin-top: 100px

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
  font-family: 'NanumSquare', sans-serif;

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



.loginContentLogo
   width: 300px //komipo
   margin-top: 15px

.loginContentEnglishLogo
  width: 350px
  margin-bottom: 5px

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

@media screen and (max-width: 900px)
  .index
    min-width: unset
    background-color: white

  .indexWin
    width: inherit
    height: inherit

  .indexWinImg
    display: none

  .indexRight
    width: inherit
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

@media only screen and (max-width: 800px) and (orientation: landscape)
	.indexRight
		height: auto !important
</style>
