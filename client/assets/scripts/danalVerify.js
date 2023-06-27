import domain from "@/assets/jsons/domain/domain"
import axiosJson from "@/assets/jsons/axios"
import axios from "axios"

// type: 0 => 로그인; 1 => 회원가입; 2 => 내정보 휴대폰번호 변경;
export const danalVerify = (logInData, type) => {
    const { IMP } = window
    IMP.init('imp67320503')

    IMP.certification(
        {
            // pg사 코드 고정값 ( DL / SMART ) 각자 다름
            pg: 'danal.B010008141',
            // 승인 리다이렉션 url
            m_redirect_url: '/',
            // mobile popup
            popup: false,
            phone: logInData.phone
        },
        // 승인 or 실패시 callBack Function
        async function (rsp) {
            const { success, error_msg } = rsp
            let alertTxt
            if (success) {
                // 인증 정보를 가져오는 부분
                // 추후 type이 0인 경우 return 받은 휴대폰 번호 까지 비교! (로그인 시 본인 인증)
                // 나머지는 휴대폰 번호 비교 필요 없음.(계정 생성 및 휴대폰번호 변경 시)
                const userInfo = await getUserInfo(rsp.imp_uid)
                if (logInData.birthday == userInfo.birthday) {
                    alertTxt = alertText("match", logInData.lang)
                    alert(alertTxt)
                    afterVerify(type, logInData, userInfo.birthday)
                } else {
                    alertTxt = alertText("unmatch", logInData.lang)
                    alert(alertTxt)
                }
            } else {
                alertTxt = alertText("fail", logInData.lang)
                alert(`${alertTxt}: ${error_msg}`)
                if (type != 0) {
                    sessionStorage.setItem("verify", false)
                }
            }
        }
    )
}
// 인증 성공 후 type별 실행 function
function afterVerify(type, logInInfo, birthday) {
    if (type == 0) {
        login(logInInfo)
    } else if (type == 1) {
        singUpCheck(logInInfo.phone, birthday)
    } else if (type == 2) {
        changePhone(logInInfo)
    }
}
// 본인 인증 후 로그인
function login(logInData) {
    let params
    const loginData = logInData.loginData
    const isMember = logInData.isMember
    const reservUserId = logInData.reservUserId
    const userId = logInData.id
    const reservId = logInData.reservId
    const lang = logInData.lang
    const logInType = logInData.type
    // 회원이 이메일로 회의실입장하려고 하는 경우
    /* 1. reservUserId --> 이메일 타고 들어온 사용자의 아이디
    2. isMember -> 이메일을 클릭하여 들어왔는지판단(회원판단) (true == 이메일로 접근) */
    // 두가지 조건이 만족하면 회원입장 페이지로 이동
    if (logInType == 1) {
        window.open("/attachment/video?page=1&viewType=gallery", "_self");
    } else if (logInType == 2) {
        window.open("/attachment/memo?page=1&viewType=gallery", "_self");
    } else if (logInType == 3) {
        if (isMember && reservUserId === userId) {
            params =
                loginData +
                "&login_type=1&lang=" +
                lang +
                "&reservId=" +
                reservId;
        // 이메일을 타고 들어온 회원이지만 (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
        } else if (isMember && reservUserId !== userId) {
            alert(
                this.$t("not invited meeting") +
                "\n" +
                this.$t("go to the contact screen")
            );
            params = loginData + "&login_type=1&lang=" + lang;
            // 이메일을 타고들어온 회원이 아님  && (이메일을 받은 회원 != 로그인 시도한 사용자)일 경우 연락처페이지로 이동시킨다
        } else {
            params = loginData + "&login_type=1&lang=" + lang;
        }

        /* 와트톡 로그인 체크 페이지로 이동 */
        // eslint-disable-next-line no-lonely-if
        if (domain.domain.powertalk.state[0] === "loginCheck") {
            // 로컬
            if (window.location.hostname === "localhost") {
                window.open(
                domain.domain.powertalk.state[1] + params,
                "_self"
                );

                // 와트톡
            } else if (window.location.hostname == "dlenc.watttalk.kr") {
                window.open(
                    "https://" +
                        window.location.hostname +
                        ":8102/login/login-check?jwt_token=" +
                        params,
                    "_self"
                );
            } else if (window.location.hostname == "dlencmedia.watttalk.kr") {
                window.open(
                    "https://" +
                        window.location.hostname +
                        ":8102/login/login-check?jwt_token=" +
                        params,
                    "_self"
                );
            } else {
                window.open(
                    domain.domain.powertalk.state[2] + params,
                    "_self"
                );
            }
            /* powertalk1으로 이동 */
        } else {
            const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
            window.open("/powertalk/index.html?" + randomNumber, "_self");
        }
    }
}
// iamport 에서 받은 imp_uid를 토대로 백엔드에서 토큰 생성 및 토큰으로 이름, 생년월일과 같은 개인정보를 가져오는 부분
async function getUserInfo(params) {
    let userInfo
        await axios
        .post(domain.domain.backend1 + axiosJson.account.verify_iamport, {
            jwt: localStorage.getItem("jwt"),
            imp_uid: params
        })
        .then((response) => {
            const res = response.data[0]
            if (res) {
                // birthday return 형식이 yyyy-mm-dd
                const birth = res.birthday.replace(/-/g, '')
                userInfo = {
                    name: res.name,
                    birthday: birth
                }
            }
        })
        .catch((err) => {
            console.log("getUserInfo Error : ", err)
        })
    return userInfo
}
function singUpCheck(phoneNum, birthday) {
    sessionStorage.setItem("verify", true)
    sessionStorage.setItem("phoneNum", phoneNum)
    sessionStorage.setItem("birthday", birthday)
    window.dispatchEvent(new Event("sessionStorageUpdated"))
}
function changePhone(logInInfo) {
    sessionStorage.setItem("verify", true)
    sessionStorage.setItem("phoneNum", logInInfo.phone)
    window.dispatchEvent(new Event("sessionStorageUpdated"))
    logInInfo.closeFunc()
}
// langCode와 type에 따라서 alert문구 지정
function alertText(type, langCode) {
    let alertTxt
    if (type == "match") {
        if (langCode == "ko") {
            alertTxt = "인증이 완료되었습니다."
        } else {
            alertTxt = "Verified"
        }
    } else if (type == "unmatch") {
        if (langCode == "ko") {
            alertTxt = "등록된 정보와 인증 정보가 일치하지 않습니다."
        } else {
            alertTxt = "Registered information and authentication information are different."
        }
    } else if (type == "fail") {
        if (langCode == "ko") {
            alertTxt = "인증에 실패하였습니다."
        } else {
            alertTxt = "Identification failed."
        }
    }
    return alertTxt
}
