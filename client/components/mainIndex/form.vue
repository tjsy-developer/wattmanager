<template>
  <div class="row justify-center items-center index">
    <div class="row justify-center items-center indexWin">
      <div class="lang">
        <div class="row localeBtn globalRight cursor-pointer">
          <div
            class="col-12 localeBtn"
            :class="'selected'"
            @click="state = !state"
          >
            <img v-if="langImg == 'ko'" class="culLangImg" :src="koflag" />
            <img v-else-if="langImg == 'en'" class="culLangImg" :src="enflag" />
            <span>{{ curLang }}</span>
            <img src="@/assets/images/bt_kr-en.png" />
          </div>
          <div
            class="col-12 localeBtn cursor-pointer"
            v-show="langImg != 'ko' && state"
          >
            <img src="@/assets/images/img.png" />
            <span
              style="width: 60%"
              @click.prevent="switchLocale('ko', $event)"
              >{{ $t("lang")[0] }}</span
            >
          </div>
          <div
            class="col-12 localeBtn cursor-pointer"
            v-show="langImg != 'en' && state"
          >
            <img src="@/assets/images/american.png" />
            <span style="width: 60%" @click.prevent="switchLocale('en', $event)"
              >{{ $t("lang")[1] }}
            </span>
          </div>
        </div>
      </div>
      <div class="col-6 row items-center indexRight">
        <div class="column col-12 items-center indexRightContent">
          <div class="col-12 row justify-center logoContainer">
            <img
              v-if="useEnterprise == 'samsung'"
              class="loginContentLogo"
              src="@/assets/images/samsung_logo.png"
            />
            <img
              v-if="useEnterprise == 'watt' && langImg == 'ko'"
              class="loginContentLogo"
              src="@/assets/images/logo_watt.png"
              style="margin-top: 15px"
            />
            <img
              v-else-if="useEnterprise == 'watt' && langImg == 'en'"
              class="loginContentEnglishLogo"
              src="@/assets/images/logo_watt_en.png"
            />
            <img
              v-if="useEnterprise == 'ex'"
              class="loginContentLogo exMainLogo"
              src="@/assets/images/ex_pt_login.png"
            />
            <img
              v-if="useEnterprise == 'cmss'"
              class="loginContentLogo cmssMainLogo"
              src="@/assets/images/logo_komipo.png"
            />
            <img
              v-if="useEnterprise == 'kdhc'"
              class="loginContentLogo kdhcMainLogo"
              src="@/assets/images/logo_kdhc.png"
            />
            <img
              v-if="useEnterprise == 'korail'"
              class="loginContentLogo korailMainLogo"
              src="@/assets/images/logo_korail.png"
            />
            <img
              v-if="useEnterprise == 'kepco'"
              class="loginContentLogo"
              src="@/assets/images/logo_kepco_watttalk.png"
            />
            <img
              v-if="useEnterprise == 'dlenc'"
              class="loginContentLogo"
              src="@/assets/images/dlenc_login_logo.png"
            />
          </div>
          <div v-if="useEnterprise == 'samsung'" class="col-12 maxWidth">
            <input
              class="input"
              id="idInput"
              placeholder="ID"
              @keyup.enter="focusingByDevice"
            />
            <input
              class="input"
              id="pwdInput"
              placeholder="Password"
              type="password"
              @keyup.enter="enterLoginBtnClick"
            />
            <img
              class="pwdView"
              @click="pwdActivation($event)"
              src="@/assets/images/ic_password_disabled.png"
            />
            <button class="signInBtn" @click="signInBtnClick">
              {{ $t("login") }}
            </button>
            <div class="text">
              <span class="text1" @click="forgotPwdBtnClick">{{
                $t("forgot")
              }}</span>
              <span class="text2" @click="createAccountBtnClick">{{
                $t("create account")
              }}</span>
            </div>
            <div v-if="useEnterprise == 'samsung'" class="personalAgreeBox">
              <span>{{ $t("personal info agree") }}</span>
              <span>{{ $t("personal info agree check") }}</span>
              <input
                class="checkBox"
                type="checkbox"
                v-model="consentvalue"
                @change="consentChecked"
              />
            </div>
          </div>
          <div v-else class="col-12 maxWidth">
            <input
              class="input"
              id="idInput"
              placeholder="ID"
              @keyup.enter="focusingByDevice"
            />
            <input
              class="input"
              id="pwdInput"
              placeholder="Password"
              type="password"
              @keyup.enter="login"
            />
            <img
              class="pwdView"
              @click="pwdActivation($event)"
              src="@/assets/images/ic_password_disabled.png"
            />
            <button class="signInBtn" @click="login">{{ $t("login") }}</button>
            <div class="text">
              <span class="text1" @click="forgotPwdBtnClick">{{
                $t("forgot")
              }}</span>
              <span class="text2" @click="createAccountBtnClick">{{
                $t("create account")
              }}</span>
              <div class="col-12 row justify-center logoContainer"></div>
            </div>
            <div
              v-if="useEnterprise == 'korail'"
              class="personalAgreeBox"
            ></div>
          </div>
          <img
            v-if="useEnterprise == 'korail'"
            class="korailBottomLogo"
            src="@/assets/images/korail_bottom_logo.png"
          />
        </div>
      </div>
      <div class="text4Conatainer row col-12 justify-center">
        <div
          class="text4 col-12 row justify-center"
          :style="{ marginTop: $i18n.locale == 'en' ? '30px' : '30px' }"
        >
          <button v-if="useEnterprise == 'dlenc'" class="policy-btn" @click="policyBtnClick()">
            <span>{{ $t("policy")[0] }}</span>
          </button>
          <span class="justify-center">Watt Talk 2.0</span>
        </div>
        <div class="text4 col-12">
          <span v-if="useEnterprise == 'dlenc'" class="justify-center">
            {{ $t("footer")[4] }}<br>
				    {{ $t("footer")[5] }}<br><br>
            Copyright © 2020 WATT CO.LTD. All Rights Reserved.
          </span>
          <span v-else class="justify-center">
            Copyright © 2020 WATT CO.LTD. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosJson from "@/assets/jsons/axios";
import forgotPasswordModal from "@/components/forgotPasswordModal/form";
import personalInfoModal from "@/components/personalInfoModal/form";
import createAccountModal from "@/components/createAccountModal/form";
import guideAlertModal from "@/components/info/guideAlert";
import notice from "@/components/notice";
;
import cookieSetting from "@/assets/scripts/data/cookie";
import verifyModal from "@/components/verifyPhoneModal/verifyModal";
import pswChangeModal from "@/components/pswChangeModal/pswChangeModal";


// import createAccountModalSecl from "@/components/createAccountModal/form_secl"

export default {
  components: { notice, personalInfoModal },
  data() {
    return {
      // 수정
      id: undefined,
      password: undefined,
      langImg: "ko",
      state: false,
      consentvalue: false, // input 값
      consentStatus: false, //
      curLang: this.$t("lang")[0],
      koflag: require("@/assets/images/img.png"),
      enflag: require("@/assets/images/american.png"),
      directCheck: true,
      useEnterprise: process.env.useEnterprise,
      isMember: false,
      reservId: undefined,
      params: "",
      reservUserId: "",
      check2Factor: "",
      bypassID: [],
      changePsw: false
    };
  },
  methods: {
    forgotPwdBtnClick() {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";

      this.$modal.show(
        forgotPasswordModal,
        {},
        {
          name: "forgotPasswordModal",
          width: innerWidth <= 700 ? "90%" : 700,
          height: innerHeight <= 468 ? "90%" : 468,
          clickToClose: false,
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      );
    },
    createAccountBtnClick() {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";

      this.$modal.show(
        // eslint-disable-next-line eqeqeq
        createAccountModal,
        {},
        {
          name: "createAccountModal",
          width: innerWidth <= 700 ? "90%" : 700,
          height: innerHeight <= 886 ? "90%" : 886,
          clickToClose: false,
          scrollable: true,
          adaptive: true,
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      );
    },
    switchLocale(locale, e) {
      sessionStorage.setItem("languageCode", locale);
      this.curLang = e.target.innerHTML;
      this.flag = e.target.previousSibling.src;
      location.reload();
    },
    // 개인정보 수집 동의 체크 시 수집동의서 modal show
    consentStatusChecked(changedValue) {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";

      this.$modal.show(
        personalInfoModal,
        { consentStatus: changedValue, consentVal: this.consentVal },
        {
          name: "personalInfoModal",
          // width: innerWidth <= 500 ? 320 : 700,
          width: 700,
          height: 886,
          clickToClose: false,
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      );
    },
    // 수집동의서 모달에 props로 함수 넘김
    consentVal(val) {
      if (val) {
        // 엔터키로 수집동의서 모달을 열었을경우
        // eslint-disable-next-line eqeqeq
        if (!this.directCheck) {
          this.consentvalue = true;
          this.login();
        } else {
          this.consentvalue = true;
          this.$modal.hide("personalInfoModal");
        }
      }
    },
    focusingByDevice() {
      const deviceType = this.deviceCheck();
      if (deviceType === "Mobile") {
        document.getElementById("pwdInput").focus();
      } else if (deviceType === "PC" && this.useEnterprise === "samsung") {
        this.enterLoginBtnClick();
      } else if (deviceType === "PC" && this.useEnterprise !== "samsung") {
        this.login();
      }
    },
    // 엔터키로 로그인 접근
    enterLoginBtnClick() {
      this.directCheck = false;
      const userId = document.getElementById("idInput").value;
      const userPwd = document.getElementById("pwdInput").value;
      if (userId && userPwd) {
        if (this.consentvalue) {
          this.login();
        } else {
          this.consentStatusChecked(this.consentvalue);
        }
      } else alert(this.$t("home")[2]);
    },
    // 마우스로 직접 로그인 버튼 클릭해서 접근
    signInBtnClick() {
      const userId = document.getElementById("idInput").value;
      const userPwd = document.getElementById("pwdInput").value;
      if (userId && userPwd) {
        if (this.consentvalue) {
          this.login();
        } else {
          alert(this.$t("personal info Unconsent"));
        }
      } else alert(this.$t("home")[2]);
    },
    // 수집동의서 동의를 직접 클릭 후 consentvalue 값이 변경될때 실행
    consentChecked() {
      this.directCheck = true;
      // 체크박스가 체크되어있는경우 체크박스 해제 상태로 변경
      if (this.consentvalue) {
        this.consentStatusChecked(this.consentvalue);
      }
    },
    guideAlert() {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";

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
            left: "10% !important",
          },
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      );
    },
    // 로그인 함수
    login() {
      // powertalk -> watttalk 도메인 변경 모달을 강제로 닫고 로그인시도할때
      const href = window.location.href;
      if (href.includes("powertalk")) {
        this.$emit("child");
        return;
      }
      // 2021.04.14 ksh :: 파워톡 -> 파워매니저 영상관리 접근 시 로그아웃 숨김으로 인해 등록했던 sessionStorage를 초기화
      sessionStorage.removeItem("logoutStatus");
      const userId = document.getElementById("idInput").value;
      const userPwd = document.getElementById("pwdInput").value;
      const self = this;
      this.$axios
        .post(process.env.backendURL + axiosJson.account.user_id_pw_check, {
          id: userId,
          password: userPwd,
        })
        .then(function (response) {
          // eslint-disable-next-line no-unused-vars
          let lang = sessionStorage.getItem("languageCode");
          if (!lang || lang == null || lang == "null"){
            lang = "ko"
            sessionStorage.setItem("languageCode", "ko")
          }
          if (response.data[0] === 1) {
            sessionStorage.removeItem("forcedLogout")
            sessionStorage.removeItem("managerLogOut")
            sessionStorage.removeItem("jwt")
            sessionStorage.removeItem("userSeq")
            sessionStorage.removeItem("auth")
            sessionStorage.removeItem("id")
            sessionStorage.removeItem("hqSeq")
            sessionStorage.removeItem("enSeq")
            sessionStorage.removeItem("opendDialog")
            sessionStorage.removeItem("brSeq")
            sessionStorage.removeItem("deviceType")
            cookieSetting.setCookie("managerLogined", true)
            /* sessionStorage ID 기억기능 추가 */
            // sessionStorage.setItem("logined", userId)

            /* ID 기억기능 쿠키저장 */
            // cookieSetting.setCookie("logined", userId, 3)

            /* 로그인 사용자의 정보 저장 */
            sessionStorage.setItem("jwt", response.data[2]);
            sessionStorage.setItem("userSeq", response.data[1].user_seq);
            sessionStorage.setItem("enSeq", response.data[1].en_seq);
            sessionStorage.setItem("hqSeq", response.data[1].hq_seq);
            sessionStorage.setItem("brSeq", response.data[1].br_seq);
            sessionStorage.setItem("auth", response.data[1].auth);
            sessionStorage.setItem("id", response.data[1].id);
            sessionStorage.setItem("deviceType", response.data[1].device_type);
            sessionStorage.setItem("logined", response.data[1].id);
            self.$axios
              .post(process.env.backendURL + axiosJson.app.app_powertalkweb_info, {
                en_seq: response.data[1].en_seq,
                hq_seq: response.data[1].hq_seq,
                br_seq: response.data[1].br_seq
              })
              .then((res) => {
                const jsonFactorList = res.data[0].app_detail_json
                const factorList = JSON.parse(jsonFactorList)
                self.check2Factor = factorList["2factor"]
                self.bypassID =  factorList["2factorBypassId"].split(",")
              })
              .catch((err) => {
                if (err == "TypeError: Cannot read properties of undefined (reading 'app_detail_json')") {
                  self.check2Factor = "False"
                } else {
                  console.log("2Factor Error :", err)
                }
              })
              .then(() => {
                // 접근 주소가 dlenc인 경우 본인 인증 모달로 먼저 보냄
                let checkAdmin = false
                if (userId == "administrator" || response.data[1].device_type === 2) {
                  // id가 admin이거나 watt면 관리자로 판단하고 본인 인증 pass
                  // devie type이 2이면, glass사용자. 본인 인증 pass
                  checkAdmin = true
                }
                let checkByPass
                if (self.check2Factor == "True") {
                  if (checkAdmin == true) {
                    // 2factor의 값이 true이나 관리자 및 glass 계정이면 bypass 활성화
                    checkByPass = true
                  }
                  else {
                    // 2factor의 값이 true이고 checkAdmin이 false 이면 bypass 비활성화
                    checkByPass = false
                  }
                } else if (self.check2Factor == "False") {
                  // 2factor의 값이 false면 bypass 활성화
                  checkByPass = true
                }
                self.bypassID.forEach((ele) => {
                  if (ele == userId) {
                    checkByPass = true
                  }
                })
                if (process.env.useEnterprise == "dlenc") {
                  const loginTime = Math.floor(new Date().getTime() / 1000)
                  cookieSetting.setCookie("managerLoginTime", loginTime)
                }
                if (checkByPass == false) {
                  let modalType
                  if (response.data[1].auth === 4) {
                    modalType = 1
                    self.changePsw = false
                  } else if (response.data[1].device_type === 2) {
                    modalType = 2
                    self.changePsw = false
                  } else {
                    modalType = 3
                  }
                  self.openVerifyModal(response.data[2], userId, userPwd, lang, modalType, response.data[1].user_seq, self.changePsw);
                  return
                }
                if (response.data[1].auth === 4)
                  window.open("/attachment/video?page=1&viewType=gallery", "_self");
                else if (response.data[1].device_type === 2) {
                  if (self.changePsw) {
                    self.openChangePswModal("/attachment/memo?page=1&viewType=gallery", 1)
                    return
                  }
                  window.open("/attachment/memo?page=1&viewType=gallery", "_self");
                  
                }
                  
                // 수정
                else {
                  // 회원이 이메일로 회의실입장하려고 하는 경우
                  /* 1. reservUserId --> 이메일 타고 들어온 사용자의 아이디
                    2. isMember -> 이메일을 클릭하여 들어왔는지판단(회원판단) (true == 이메일로 접근) */
                  // 두가지 조건이 만족하면 회원입장 페이지로 이동
                  if (self.isMember && self.reservUserId === userId) {
                    self.params =
                      response.data[2] +
                      "&login_type=1&lang=" +
                      lang +
                      "&reservId=" +
                      self.reservId;
                    // 이메일을 타고 들어온 회원이지만 (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
                  } else if (self.isMember && self.reservUserId !== userId) {
                    alert(
                      self.$t("not invited meeting") +
                        "\n" +
                        self.$t("go to the contact screen")
                    );
                    self.params = response.data[2] + "&login_type=1&lang=" + lang;
                    // 이메일을 타고들어온 회원이 아님  && (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
                  } else {
                    self.params = response.data[2] + "&login_type=1&lang=" + lang;
                  }

                  /* 와트톡 로그인 체크 페이지로 이동 */
                  // eslint-disable-next-line no-lonely-if
                  if (process.env.powertlakState === "loginCheck") {
                    // 로컬
                    if (window.location.hostname === "localhost") {
                      window.open(
                        process.env.powertalkLogin_local + self.params,
                        "_self"
                      );

                      // 와트톡
                    } else {
                      if (window.location.hostname == "kepco.watttalk.kr") {
                        window.open(
                          process.env.kepcoLogin + self.params,
                          "_self"
                        );
                      } else {
                        window.open(
                          process.env.powertalkLogin + self.params,
                          "_self"
                        );
                      }
                    }
                    /* powertalk1으로 이동 */
                  } else {
                    const randomNumber =
                      Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
                    window.open("/powertalk/index.html?" + randomNumber, "_self");
                  }
                }
              })
          } else if (response.data[0] === 2) {
            // 미승인
            if (self.useEnterprise === "samsung") {
              self.$modal.hide("personalInfoModal");
              self.consentvalue = false;
            }
            alert(self.$t("home")[0]);
          } else if (response.data[0] === 5) {
            // psw가 일치하지 않는 경우!
            if (self.loginErrBlock) {
              self.countLoginErr = ++self.countLoginErr
            }
            alert(self.$t("home")[1]);
          } else {
            // id || psw err
            if (self.useEnterprise === "samsung") {
              self.$modal.hide("personalInfoModal");
              self.consentvalue = false;
            }
            if (process.env.useEnterprise == "dlenc") {
              if (response.data[3] > 4) {
                alert("비밀번호 5회 오류로 인해 미승인되었습니다. 관리자에게 문의 바랍니다")
                return
              }
            }
            alert(self.$t("home")[1]);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 패스워드 보기 활성화/비활성화
    pwdActivation(e) {
      const pwdInput = document.getElementById("pwdInput");
      if (e.target.classList.contains("Active")) {
        e.target.classList.remove("Active");
        e.target.src = require("@/assets/images/ic_password_disabled.png");
        pwdInput.type = "password";
      } else {
        e.target.classList.add("Active");
        console.log(e);
        e.target.src = require("@/assets/images/ic_password.png");
        pwdInput.type = "text";
      }
    },
    openVerifyModal(params, userId, userPwd, lang, modalType, userSeq, checkChangePsw) {
      const modalsContainerStyle =
        document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";
      const modalParameter = {
        loginData: params,
        isMember: this.isMember,
        reservUserId: this.reservUserId,
        reservId: this.reservId,
        id: userId,
        pwd: userPwd,
        language: lang,
        type: modalType,
        user_seq: userSeq,
        changePsw: checkChangePsw
      }

      this.$modal.show(
        // eslint-disable-next-line eqeqeq
        verifyModal,
        {
          propsData: modalParameter
        },
        {
          name: "verifyModal",
          width: 400,
          height: 588,
          clickToClose: false,
          adaptive: true,
        },
        {
          "before-close": () => {
            modalsContainerStyle.display = "none";
          },
        }
      );
    },
    openChangePswModal(params, type) {
      const modalsContainerStyle =
          document.getElementById("modalsContainer").style;
      modalsContainerStyle.display = "block";

      const modalParameter = {
        url: params,
        modalType: type
      }
      
      this.$modal.show(
          // eslint-disable-next-line eqeqeq
          pswChangeModal,
          {
            propsData: modalParameter
          },
          {
            name: "pswChangeModal",
            width: 400,
            height: 300,
            clickToClose: false,
            adaptive: true,
          },
          {
            "before-close": () => {
                modalsContainerStyle.display = "none";
            },
          }
      );
    }
  },
  mounted() {
    const currentLang = sessionStorage.getItem("languageCode");
    if (sessionStorage.getItem("languageCode") != null) {
      this.langImg = sessionStorage.getItem("languageCode");
    }
    // 초기 언어 설정
    // eslint-disable-next-line eqeqeq
    if (currentLang == "ko") {
      this.curLang = this.$t("lang")[0];
    } else {
      this.curLang = this.$t("lang")[1];
    }
    const memberReservId = this.$route.query.reservId;
    if (memberReservId) {
      console.log("reservID -> return userID");
      const self = this;
      /* 회원이 이메일로 회의실 입장시도할 경우 reservId로 UserId 를 조회한다 --> 초대된 사용자인지 검증을 위함 */
      this.$axios
        .post(
          process.env.backendURL +
            axiosJson.account.select_id_where_reservation_uid,
          {
            reservation_uid: memberReservId,
          }
        )
        .then(function (response) {
          console.log("reservId로 ID조회");
          console.log(response);
          self.reservUserId = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      /* 회원이 이메일로 회의실 접근할 경우 안내모달 띄움 */
      this.guideAlert();
      this.isMember = true;
      this.reservId = memberReservId;
      document.getElementById("idInput").focus();
    } else {
      /* 기존에 로그인해서 쿠키에 저장되어있던 사용자의 ID를 가져온다 */
      const loginedId = cookieSetting.getCookie("logined");

      /* 쿠키에 저장되어있던 사용자의 ID가 있다면 아이디입력칸에 ID를 넣어주고
		  비밀번호입력에 커서를 위치시킨다
			ID가 없다면 아이디 입력칸에 커서를 위치시킨다 */
      if (loginedId) {
        document.getElementById("idInput").value = `${loginedId}`;
        document.getElementById("pwdInput").focus();
      } else {
        document.getElementById("idInput").focus();
      }
    }

    // 한국 전력공사 로고이미지 변경
    if (window.location.hostname == "kepco.watttalk.kr") {
      this.useEnterprise = "kepco";
    } else if (window.location.hostname == "dlenc.watttalk.kr") {
      // dlenc 분기처리!!
      this.useEnterprise = "dlenc";
    } else if (window.location.hostname == "dlencmedia.watttalk.kr") {
      this.useEnterprise = "dlenc";
    }
    if (sessionStorage.getItem("managerLogOut")) {
      cookieSetting.deleteCookie("managerLogined")
      cookieSetting.deleteCookie("managerLoginTime")
    }
    /* 로그인한 사용자의 아이디 쿠키값 삭제 */
    // this.deleCookie("logined")
    
    // 크롬에서 간혹가다가 세션스토리지 및 로컬스토리지가 초기화 되지 않는 현상 발견
    // 로컬스토리지의 경우 다른 탭들도 영향을 받을 수 있어 wattmanager에서 쓰는 값들만 일일이 제거!
    this.$nextTick(() => {
        let langCode = ""
        
        if (sessionStorage.getItem("languageCode")) {
          langCode = sessionStorage.getItem("languageCode")
        }
        if (langCode) {
          sessionStorage.setItem("languageCode", langCode)
        }
        // const checkLogined = cookieSetting.getCookie("managerLogined")
        // if (checkLogined) {
        //   if (sessionStorage.getItem("jwt")) {
        //     if (sessionStorage.getItem("auth") == 4 || sessionStorage.getItem("deviceType") == 2) {
        //       window.location.href = "attachment/video?page=1&viewType=gallery&lang=" + langCode
        //     } else {
        //       const urlParameter = sessionStorage.getItem("jwt") + "&login_type=1&lang=" + langCode
        //       if (window.location.hostname === "localhost") {
        //         window.open(
        //           process.env.powertalkLogin_local + urlParameter,
        //           "_self"
        //         );

        //         // 와트톡
        //       } else {
        //         if (window.location.hostname == "kepco.watttalk.kr") {
        //           window.open(
        //             process.env.kepcoLogin + urlParameter,
        //             "_self"
        //           );
        //         } else {
        //           window.open(
        //             process.env.powertalkLogin + urlParameter,
        //             "_self"
        //           );
        //         }
        //       }
        //     }
        //   }
        // }
        // if (sessionStorage.getItem("forcedLogout")) {
        //   return
        // } else {
        //   console.log("===================================================")
        //   sessionStorage.removeItem("managerLogOut")
        //   sessionStorage.removeItem("jwt")
        //   sessionStorage.removeItem("userSeq")
        //   sessionStorage.removeItem("auth")
        //   sessionStorage.removeItem("id")
        //   sessionStorage.removeItem("hqSeq")
        //   sessionStorage.removeItem("enSeq")
        //   sessionStorage.removeItem("opendDialog")
        //   sessionStorage.removeItem("brSeq")
        //   sessionStorage.removeItem("deviceType")
        //   sessionStorage.clear()
        // }
    })
  }
};
</script>

<style lang="sass" scoped>
.row.justify-center.items-center.index
.index
  width: 100%
  // min-width: $contentMaxWidth
  height: 100%
  background-image: radial-gradient(closest-side at 50% 50%, #2A2A2AF2 0%, #000000E8 100%), url("../../assets/images/login_background.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center
  @media screen and (min-width: 1023px)
    overflow-y: auto

.indexWin
  width: 618px
  height: 550px
  border: 1px solid #4D4D4D

.indexWinImg
  height: 100%

.indexRight
  width: 100%
  height: 100%
  background: #2A2A2A 0% 0% no-repeat padding-box

.indexRightContent
  margin: auto
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
  font-size: 16px
  font-weight: 600
  border-radius: 5px
  text-indent: 20px
  outline: none

.input:nth-child(1)
  margin-top: 30px
  font-family: 'NanumSquare', sans-serif

.input:nth-child(2)
  margin-top: 8px

.signInBtn
  width: 100%
  padding: 20px
  margin-top: 8px
  background: #2386D2
  color: white
  border-radius: 5px

.text
  width: 100%
  font-size: 14px
  font-weight: bold
  margin-top: 15px
  margin-bottom: 20px

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

.personalAgreeBox
  width: 100%
  margin-top: 10px
  align-items: center
  display: flex
  justify-content: center
  >span
    color: white
    font-size: 14px
    &:nth-child(2)
      margin-left: 5px
  >input
    margin-left: 5px

.loginContentLogo
  width: 100% //komipo
  max-width: 280px

.cmssMainLogo,
.kdhcMainLogo
  height: 70px

.korailBottomLogo
  position: absolute
  bottom: -60px
  width: 90px
  margin: auto

.loginContentEnglishLogo
  width: 100%
  margin-bottom: 5px

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

.text4Conatainer
  position: fixed
  bottom: 15px
  @media screen and (max-height: 678px)
    display: none !important
@media screen and (max-width: 1023px)
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
    height: 100% !important
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

@media screen and (max-width: 1023px) and (max-height: 768px)
  .indexRightContent
    display: flex
  .indexRight
    height: 100% !important
    align-item: center
    padding: 0px 30px
    @media screen and (orientation: landscape)
      padding: 0px 30px
      overflow-y: auto
  .maxWidth
    width: 90%

  .input
    padding: 12px 12px
    font-size: 12px

  .input:nth-child(1)
    margin-top: 10px

  .signInBtn
    padding: 9px
  .input::placeholder
    font-size: 12px

  .loginContentLogo:not(.exMainLogo, .korailMainLogo)
    width: 100% //komipo
    height: 55px

  .exMainLogo
    height: 35px

  .korailMainLogo
    height: 65px

  .loginContentEnglishLogo
    width: 100%
    margin-bottom: 5px

  .pwdView
    width: 20px
    top: 70px

  .text
    margin-bottom: 0px

  .text4
    margin-top: 0px

  .text4Conatainer
    display: flex
    justify-content: center
    align-items: center

  .personalAgreeBox
    margin-bottom: 0px

@media screen and (max-width: 420px)
  .personalAgreeBox
    white-space: nowrap
    >span
      font-size: 13px

.policy-btn
  color: white
  font-size: 5px
</style>
