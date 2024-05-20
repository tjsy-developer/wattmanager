<template>
  <div class="row justify-center mainHeader">
    <div class="row justify-between items-center maxWidth" :style="{ width: pathName == '/logsheet' || pathName == '/safetyPatrol' ? '90vw' : '1260px', maxWidth: pathName == '/logsheet' || pathName == '/safetyPatrol' ? '1554px' : '1260px' }">
      <button v-if="$i18n.locale != 'ko'" class="localeBtn" @click="switchLocale('ko')">한국어</button>
      <button v-else-if="$i18n.locale != 'en'" class="localeBtn" @click="switchLocale('en')">English</button>
      <img v-if="useEnterprise == 'samsung'" class="col-auto" src="@/assets/images/samsung_logo_2.png" />
      <img v-if="useEnterprise == 'watt'" class="col-auto" src="@/assets/images/logo_header.png" />
      <img v-if="useEnterprise == 'ex'" class="col-auto" src="@/assets/images/ex_pm.png" />
      <img v-if="useEnterprise == 'cmss'" class="col-auto" src="@/assets/images/logo_komipo_cloud.png" />
      <img v-if="useEnterprise == 'kdhc'" class="col-auto" src="@/assets/images/logo_kdhc_cloud.png" />
      <img v-if="useEnterprise == 'korail'" class="col-auto" src="@/assets/images/logo_korail_cloud.png" />
      <img v-if="useEnterprise == 'kepco'" class="col-auto" src="@/assets/images/logo_kepco_cloud.png" />
      <img v-if="useEnterprise == 'dlenc'" class="col-auto" src="@/assets/images/dlenc_logo.png" style="height: 38px" />
      <img v-if="useEnterprise == 'kwater'" class="col-auto" src="@/assets/images/logos/k_water_logo_2.svg" style="height: 38px" />
      <div class="col-auto row menus">
        <nuxt-link v-if="authority == '4' && elecQR" to="/qr/elecQr" class="col-auto">{{ $t("qrTab") }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && qrStatus == 'safety'" to="/qr" class="col-auto">{{ $t("safetyQR") }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && qrStatus == 'power'" to="/qr" class="col-auto">{{ $t("powerQR") }}</nuxt-link>
        <nuxt-link v-if="authority == '4'" to="/integrationQr">{{ $t("printQR")[0] }}</nuxt-link>
        <nuxt-link v-if="authority == '4'" to="/upload?page=1&viewType=upload" class="col-auto">{{ $t("upload")}}</nuxt-link>
        <nuxt-link v-if="showSafetyPatrol || authority == '4'" to="/workflows" class="col-auto" id="tbmBtn" @click.native="openIframe(1)" style="cursor: pointer;">{{  $i18n.locale == 'ko' ? safetyPatrolKo : safetyPatrolEn }}</nuxt-link>
        <nuxt-link v-if="showDailyCheck || authority == '4'" to="/workflows" id="logsheetBtn" name="logsheetTitle" class="col-auto" @click.native="openIframe(2)">{{ $i18n.locale == 'ko' ? dailyCheckTitleKo : dailyCheckTitleEn }}</nuxt-link>
        <nuxt-link v-if="showMemo2 || authority == '4'" to="/workflows" id="logsheetBtn" name="logsheetTitle" class="col-auto" @click.native="openIframe(3)">{{ $i18n.locale == 'ko' ? memo2TitleKo : memo2TitleEn }}</nuxt-link>
        <nuxt-link v-if="showTbm || authority == '4'" to="/workflows" id="logsheetBtn" name="logsheetTitle" class="col-auto" @click.native="openIframe(4)">{{ $i18n.locale == 'ko' ? tbmTitleKo : tbmTitleEn }}</nuxt-link>
        <nuxt-link class="col-auto" to="/upload?page=1&viewType=filebox">{{ $t("fileBox") }}</nuxt-link>
        <nuxt-link class="col-auto" to="/notice?page=1">{{ $t("notice")[0] }}</nuxt-link>
        <nuxt-link class="col-auto" to="/profile">{{ $t("profile") }}</nuxt-link>
        <nuxt-link v-if="authority != '0' && deviceType != '2'" to="/user?page=1" class="col-auto">{{ $t("headerComp")[0] }}</nuxt-link>
        <nuxt-link v-if="authority != '0' && authority != '1' && deviceType != '2'" to="/device?page=1" class="col-auto">{{ $t("headerComp")[1] }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && deviceType != '2'" to="/app?page=1" class="col-auto">{{ $t("headerComp")[2] }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && deviceType != '2'" to="/enterprise?page=1" class="col-auto">{{ $t("headerComp")[3] }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && deviceType != '2'" to="/headquarters?page=1" class="col-auto">{{ $t("headerComp")[4] }}</nuxt-link>
        <nuxt-link v-if="authority == '4' && deviceType != '2'" to="/branch?page=1" class="col-auto">{{ $t("headerComp")[5] }}</nuxt-link>
        <nuxt-link
          class="col-auto"
          :to="attViewAuth == true || deviceType == '2' ? '/attachment/memo?page=1&viewType=gallery' : '/attachment/video?page=1&viewType=gallery'"
          @click="clearsessionStorage"
        >
          {{ $t("headerComp")[6] }}
        </nuxt-link>
        <nuxt-link v-if="authority == '3'" :to="'/callHistory?page=1'" class="col-auto">{{ $t("callHistory") }}</nuxt-link>
        <!-- <button  @click="closeTab()">닫기</button> -->
        <!-- admin계정인 경우 로그아웃 버튼 활성화 -->
        <button v-if="logoutStatus != 0 && checkAdmin" class="col-auto" @click="logoutBtnClick">{{ $t("header")[0] }}</button>
        <!-- 글라스 계정인 경우 로그아웃 버튼 활성화 -->
        <button v-if="logoutStatus != 0 && glassLogin" class="col-auto" @click="logoutBtnClick">{{ $t("header")[0] }}</button>
        <button v-if="logoutStatus == 0" class="col-auto" @click="logoutBtnClose">{{ $t("header")[1] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import jwt_decode from "jwt-decode"
import cookieSetting from "@/assets/scripts/data/cookie"
import axiosJson from "@/assets/jsons/axios";
import { mapState } from "vuex"

export default {
  data() {
    return {
      authority: undefined,
      deviceType: undefined,
      attViewAuth: false,
      pageIndex: 0,
      qrInfo: [],
      qrStatus: process.env.qr,
      elecQR: process.env.elecQR,
      // 2021.04.14 ksh :: 파워톡 -> 파워매니저 자료관리 이동 시 로그인 버튼 관리
      logoutStatus: 1,
      useEnterprise: process.env.useEnterprise,
      checkAdmin: false,
      glassLogin: false,
      showSafetyPatrol: false,
      showDailyCheck: false,
      showMemo2: false,
      showTbm: false,
      safetyPatrolKo: "",
      safetyPatrolEn: "",
      dailyCheckTitleKo: "",
      dailyCheckTitleEn: "",
      memo2TitleKo: "",
      memo2TitleEn: "",
      tbmTitleKo: "",
      tbmTitleEn: "",
      location: "",
      pathName: ""
    }
  },
  computed: {
		...mapState({
			allState: (state) => state
		})
  },
  methods: {
    switchLocale(locale) {
      console.log(locale)
      sessionStorage.setItem("languageCode", locale)
      location.reload()
    },
    testFunc() {
      // removeEventListener 때문. 제거시 오류 발생
      return
    },
    logoutBtnClick() {
      if (process.env.forceLogout24) {
        window.removeEventListener("forceLogoutEvent", this.testFunc())
      }
      const lang = sessionStorage.getItem("languageCode")
      const jwtToken = sessionStorage.getItem("jwt")
      sessionStorage.clear()
      const languageCode = sessionStorage.getItem("languageCode")
      sessionStorage.clear()
      sessionStorage.setItem("languageCode", languageCode)
      if (process.env.powertlakState === "loginCheck") {
        if (window.location.hostname === "localhost") {
          window.open(
            process.env.powertalkLogin_local +
              jwtToken +
              "&login_type=3&lang=" +
              lang,
            "_self"
          )
        } else {
          if(window.location.hostname == 'kepco.watttalk.kr') {
             window.open(
              process.env.kepcoLogin +
                jwtToken +
                "&login_type=3&lang=" +
                lang,
              "_self"
             )
          }  else if (window.location.hostname == 'dlenc.watttalk.kr') {
            window.open(
              'https://' + window.location.hostname + ':8102/login/login-check?jwt_token=' +
              jwtToken +
              "&login_type=3&lang=" +
              lang,
              "_self"
            )
          } else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
            window.open(
              'https://' + window.location.hostname + ':8102/login/login-check?jwt_token=' +
              jwtToken +
              "&login_type=3&lang=" +
              lang,
              "_self"
            )
          }  else if (window.location.hostname == 'seoyoneh.watttalk.kr') {
            window.open(
              'https://' + window.location.hostname + ':7220/login/login-check?jwt_token=' +
              jwtToken +
              "&login_type=3&lang=" +
              lang,
              "_self"
            )
          } else {
            window.open(
              process.env.powertalkLogin +
                jwtToken +
                "&login_type=3&lang=" +
                lang,
              "_self"
            )
          }
        }
      } else {
        open("/", "_self")
      }
    },
    clearsessionStorage() {
      sessionStorage.removeItem("selectedFilters")
      sessionStorage.removeItem("selectedFiltersOptions")
      sessionStorage.clear
    },
    // 2021.04.14 ksh :: 파워톡 -> 파워매니저 자료관리로 접근 시 "종료" 버튼 클릭 시 창 닫기
    logoutBtnClose() {
      sessionStorage.clear()
      window.close()
    },
    serviceInPreparation(e) {
      e.preventDefault()
      alert(this.$t("servicePreParation"))
    },
    openIframe(type) {
      // type => 1: 안전패트롤, 2: 일일점검, 3: 메모, 4: TBM
      sessionStorage.setItem("init", true)
      sessionStorage.removeItem("taskType")
      sessionStorage.removeItem("path_name")
      sessionStorage.removeItem("path_trans")
      sessionStorage.setItem("taskType", type)
      if (window.location.pathname == "/workflows") {
        window.postMessage("workflow content modified")
      }
    },
    closeTab() {
      window.close()
    },
    checkLoginTime() {
      // 현재 시간
      const currentTime = Math.floor(Date.now() / 1000)
      const cookieName = sessionStorage.getItem("id") + "ManagerLoginTime"
      // 로그인 시에 기록된 시간
      const loginTime = cookieSetting.getCookie(cookieName)
      if (!loginTime) return
      const forceLogoutEvent = new CustomEvent("forceLogoutEvent", {detail: true})
      const unix24Hour = 8 * 60 * 60
      if (loginTime == "calling") {
        return
      } else if(loginTime == "logout") {
        window.dispatchEvent(forceLogoutEvent)
        console.log(currentTime)
      } else if (currentTime > Number(loginTime) + Number(unix24Hour)) {
        cookieSetting.deleteCookie(cookieName)
        cookieSetting.setCookie(cookieName, "")
        window.dispatchEvent(forceLogoutEvent)
      }
    },
    getAppInfo() {
      this.$axios
        .post(process.env.backendURL + axiosJson.app.app_powertalkweb_info, {
          en_seq: Number(sessionStorage.getItem("enSeq")),
          hq_seq: Number(sessionStorage.getItem("hqSeq")),
          br_seq: Number(sessionStorage.getItem("brSeq"))
        })
        .then((res) => {
          if (res.data.length > 0) {
            const jsonAppList = res.data[0].app_detail_json
            const appList = JSON.parse(jsonAppList)
            this.setAppInfo(appList)
          } else {
            if (this.authority == '4') {
              sessionStorage.setItem("safetypatrolTitle", `안전패트롤`)
              sessionStorage.setItem("safetypatrolTemplateID", `""`)

              sessionStorage.setItem("dailyCheckTitle", "일일점검")
              sessionStorage.setItem("dailyCheckTemplateID", "")

              sessionStorage.setItem("memo2Title", "메모")
              sessionStorage.setItem("memo2TemplateID", "")

              sessionStorage.setItem("tbmTitle", "로그시트")
              sessionStorage.setItem("tbmTemplateID", `""`)

              this.safetyPatrolKo = `안전패트롤관리`
              this.safetyPatrolEn = `Safety Patrol Management`

              this.dailyCheckTitleKo = "일일점검"
              this.dailyCheckTitleEn = "Daily Patrol"

              this.memo2TitleKo = "메모"
              this.memo2TitleEn = "Memo"

              this.tbmTitleKo = "로그시트관리"
              this.tbmTitleEn = "Logsheet Management"
            }
            const params = {
              safety: this.showSafetyPatrol,
              daily: this.showDailyCheck,
              memo2: this.showMemo2,
              tbm: this.showTbm,

              safetyKo: this.safetyPatrolKo,
              safetyEn: this.safetyPatrolEn,

              dailyKo: this.dailyCheckTitleKo,
              dailyEn: this.dailyCheckTitleEn,

              moemo2Ko: this.memo2TitleKo,
              moemo2En: this.memo2TitleEn,
              
              tbmKo: this.tbmTitleKo,
              tbmEn: this.tbmTitleEn
            }
            this.$store.commit("setHeaderInfo", params)
          }
        })
        .catch((err) => {
          if (err == "TypeError: Cannot read properties of undefined (reading 'app_detail_json')") {
            this.showSafetyPatrol = false
          } else {
            console.log("get App info one Error :", err)
          }
        })
    },
    getUserName() {
      this.$axios
          // .post(axiosJson.user.user_info_one, {
          .post(process.env.backendURL + axiosJson.user.user_info_one, {
              user_seq: Number(sessionStorage.getItem("userSeq")),
              jwt: sessionStorage.getItem("jwt")
          })
          .then(function(res) {
              sessionStorage.setItem("userName", res.data.name)
              console.log(res.data.name)
          })
          .catch(function(error) {
              console.log("user profile page error : ", error)
          })
    },
    setAppInfo(appList) {
      if (appList["safetyPatrol"] == "True") {
        this.showSafetyPatrol = true
        if (appList["safetypatrolTitle"]) {
          sessionStorage.setItem("safetypatrolTitle", appList["safetypatrolTitle"])
          this.safetyPatrolKo = appList["safetypatrolMenuKo"]
          this.safetyPatrolEn = appList["safetypatrolMenuEn"]
        } else {
          sessionStorage.setItem("safetypatrolTitle", `""`)
        }
        if (appList["safetypatrolTemplateID"]) {
          sessionStorage.setItem("safetypatrolTemplateID", appList["safetypatrolTemplateID"])
        } else {
          sessionStorage.setItem("safetypatrolTemplateID", `""`)
        }
      }
      if (appList["dailyCheck"] == "True") {
        this.showDailyCheck = true
        if (appList["dailyCheckTitle"]) {
          sessionStorage.setItem("dailyCheckTitle", appList["dailyCheckTitle"])
          this.dailyCheckTitleKo = appList["dailyCheckMenuKo"]
          this.dailyCheckTitleEn = appList["dailyCheckMenuEn"]
        } else {
          sessionStorage.setItem("dailyCheckTitle", `""`)
        }
        if (appList["dailyCheckTemplateID"]) {
          sessionStorage.setItem("dailyCheckTemplateID", appList["dailyCheckTemplateID"])
        } else {
          sessionStorage.setItem("dailyCheckTemplateID", `""`)
        }
      }
      if (appList["memo2"] == "True") {
        this.showMemo2 = true
        if (appList["memo2Title"]) {
          sessionStorage.setItem("memo2Title", appList["memo2Title"])
          this.memo2TitleKo = appList["memo2MenuKo"]
          this.memo2TitleEn = appList["memo2MenuEn"]
        } else {
          sessionStorage.setItem("memo2Title", "")
        }
        if (appList["memo2TemplateID"]) {
          sessionStorage.setItem("memo2TemplateID", appList["memo2TemplateID"])
        } else {
          sessionStorage.setItem("memo2TemplateID", "")
        }
      }
      if (appList["TBM"] == "True") {
        this.showTbm = true
        if (appList["tbmTitle"]) {
          sessionStorage.setItem("tbmTitle", appList["tbmTitle"])
          this.tbmTitleKo = appList["tbmMenuKo"]
          this.tbmTitleEn = appList["tbmMenuEn"]
        } else {
          sessionStorage.setItem("tbmTitle", "로그시트")
        }
        if (appList["tbmTemplateID"]) {
          sessionStorage.setItem("tbmTemplateID", appList["tbmTemplateID"])
        } else {
          sessionStorage.setItem("tbmTemplateID",`""`)
        }
      }
      const params = {
        safety: this.showSafetyPatrol,
        daily: this.showDailyCheck,
        memo2: this.showMemo2,
        tbm: this.showTbm,

        safetyKo: this.safetyPatrolKo,
        safetyEn: this.safetyPatrolEn,

        dailyKo: this.dailyCheckTitleKo,
        dailyEn: this.dailyCheckTitleEn,

        moemo2Ko: this.memo2TitleKo,
        moemo2En: this.memo2TitleEn,
        
        tbmKo: this.tbmTitleKo,
        tbmEn: this.tbmTitleEn
      }
      this.$store.commit("setHeaderInfo", params)
    }
  },
  mounted() {
    this.pathName= window.location.pathname
    this.location = window.location.hostname
    // 로그인한 계정이 admin인지 확인
    if (sessionStorage.getItem("id") === "administrator") {
      this.checkAdmin = true
    }
    // 로그인한 계정이 글라스인지 확인
    if (sessionStorage.getItem("deviceType") == 2) {
      this.glassLogin = true
    }
    
    // 파워톡 -> 파워매니저 영상관리로 접근 시 jwt_token을 파라미터로 보낸다.

    if (this.$route.query.jwt_token !== undefined) {
      // 파라미터로 받은 jwt_token을 복호화하여 로그인에 필요한 데이터를 담는다.
      const decodeData = jwt_decode(this.$route.query.jwt_token)

      sessionStorage.setItem("auth", decodeData.auth)
      sessionStorage.setItem("userSeq", decodeData.user_seq)
      sessionStorage.setItem("id", decodeData.id)
      sessionStorage.setItem("hqSeq", decodeData.hq_seq)
      sessionStorage.setItem("enSeq", decodeData.en_seq)
      sessionStorage.setItem("brSeq", decodeData.br_seq)
      sessionStorage.setItem("deviceType", decodeData.device_type)
      sessionStorage.setItem("jwt", this.$route.query.jwt_token)

      // 2021.04.14 ksh :: 로그인 버튼 숨김 설정
      sessionStorage.setItem("logoutStatus", 0)
    }
    this.authority = sessionStorage.getItem("auth")
    this.deviceType = sessionStorage.getItem("deviceType")

    // 2021.04.14 ksh :: 파워톡 -> 파워매니저 자료관리 이동 시 로그인 버튼 숨김
    this.logoutStatus = sessionStorage.getItem("logoutStatus")

    if (!this.authority) open("/", "_self")

    if (
      this.$route.query.lang !== undefined &&
      this.$route.query.lang !== null &&
      this.$route.query.lang !== ""
    ) {
      if (this.$route.query.lang !== sessionStorage.getItem("languageCode")) {
        let langCode = this.$route.query.lang
        if (langCode == 'es') langCode = 'en'
        sessionStorage.setItem("languageCode", this.$route.query.lang)
        const queryParmas = new URLSearchParams(this.$route.query)
        queryParmas.delete("lang")
        const newQuery = queryParmas.toString()
        window.open(
          `${ this.$route.path}?${newQuery}`,
          "_self"
        )
      }
    }
    this.getAppInfo()
    this.getUserName()
    // att_access_user = false 일 경우 일반 사용자 tab권한 없음 --> 삼성엔지니어링 요구사항
    // att_access_user = true 일 경우 기존 권한 조건
    // eslint-disable-next-line eqeqeq
    if (process.env.att_access_user === false && this.authority == 0) {
      // 일반사용자만 tab 권한 없음
      this.attViewAuth = true
    } else {
      // 1. att_access_user 이 true 이거나
      // 2. att_access_user 이 false 일경우 auth > 0 이라면 tab 권한 있음
      this.attViewAuth = false
    }
     // 한국 전력공사 로고이미지 변경
    if(window.location.hostname == 'kepco.watttalk.kr') {
      this.useEnterprise = "kepco"
    }
    if (window.location.hostname == "kwater.watttalk.kr") {
      this.useEnterprise = "kwater"
    }
    if (window.location.hostname == 'dlenc.watttalk.kr') {
      // dlenc 분기처리!!
      this.useEnterprise = "dlenc"
    }else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
      this.useEnterprise = "dlenc"
    }
    if (process.env.forceLogout24) {
      window.addEventListener("forceLogoutEvent",(e) => {
        if (e.detail == true) {
          this.logoutBtnClick()
        }
      })
      setInterval(() => {
        this.checkLoginTime()
      }, 600000);
    }
  }
}
</script>

<style lang="sass" scoped>

@media print 
	.mainHeader
		display: none

.mainHeader
	width: 100%
	height: $headerHeight
	box-shadow: 0px 3px 10px #0000004A
	z-index: 1

.maxWidth
	width: 1260px

.menus
	padding-top: 10px

.menus>a,
.menus>button
	font-size: 13px
	font-weight: 800
	margin-left: 15px
	padding: 5px

.localeBtn
	position: absolute
	right: 4px
	top: 8px
	font-size: 14px
#logsheetBtn
  &:hover
    cursor: pointer
</style>
