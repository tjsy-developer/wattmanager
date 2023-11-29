import axiosJson from "@/assets/jsons/axios"
import axios from "axios"
// type: 0 => 로그인; 1 => 회원가입; 2 => 내정보 휴대폰번호 변경;
export const danalVerify = (logInData, type) => {
    const { IMP } = window
    // impId가 없는 경우 본인 인증 사용 불가 process.env.json에 값 지정.
    if (!process.env.impId) {
        let alertMsg
        if (sessionStorage.getItem("languageCode") == "ko") {
            alertMsg = "본인 인증 설정이 되어있지 않습니다. 확인 바랍니다."
        } else {
            alertMsg = "No settings in identify certification service. Please check."
        }
        return alert(alertMsg)
    }
    IMP.init(process.env.impId)

    IMP.certification(
        {
            // pg사 코드 고정값 ( DL / SMART ) 각자 다름
            // .env 파일에 값 지정
            pg: process.env.pg,
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
                let params
                // type이 1 인경우 회원가입. axios 통신시 birthday만 넘겨주면 됨
                if (type == 1) {
                    params = {
                        birthday:logInData.birthday,
                        phoneNum: logInData.phone
                    }
                } else {
                    // type이 0 || 2 인 경우. 순서대로 로그인 || 휴대폰번호 변경. id를 보내줘야한다
                    params = logInData.id
                }
                // 인증 정보를 가져오는 부분
                const verified = await getUserInfo(rsp.imp_uid, params, type)
                // 인증 정보를 갖고온 후 타는 로직
                if (verified.result == true) {
                    alertTxt = alertText("match", logInData.lang)
                    alert(alertTxt)
                    afterVerify(type, logInData, logInData.birthday, verified.phone_number, logInData.changePsw)
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
function afterVerify(type, logInInfo, birthday, phoneNum, changePsw) {
    if (changePsw) {
        const finishVerifyOpenChangePsw = new CustomEvent("finishVerifyOpenChangePsw", { detail: logInInfo })
        window.dispatchEvent(finishVerifyOpenChangePsw)
        return
    }
    if (type == 0) {
        // 로그인
        login(logInInfo)
    } else if (type == 1) {
        // 회원가입
        singUpCheck(logInInfo.phone, birthday)
    } else if (type == 2) {
        // 휴대폰번호변경
        changePhone(logInInfo, phoneNum)
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
        if (process.env.powertlakState === "loginCheck") {
            // 로컬
            if (window.location.hostname === "localhost") {
                window.open(
                    process.env.powertalkLogin_local + params,
                "_self"
                );
            } else {
                window.open(
                    process.env.powertalkLogin + params,
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
async function getUserInfo(uid, params, type) {
    let result
    console.log(type, "============================================")
    // 회원가입인 경우
    if (type == 1) {
        // impuid만 전달하면 된다.
        // verifyIamportRest/verifyIamport_list
        await axios
            .post(process.env.backendURL + axiosJson.account.verify_iamport_list, {
                imp_uid: uid
            })
            .then((response) => {
                // return이 생년월일 이름으로 옴.
                const res = response.data[0]
                if (res) {
                    // birthday return 형식이 yyyy-mm-dd
                    const birth = res.birthday.replace(/-/g, '')
                    const phoneNumber = res.phone_number
                    // return받은 생년월일과, 사용자가 입력한 생년월일을 비교해 동일인물인지 확인
                    // 추후 휴대폰 번호도 return 받으면 비교 같이 해야한다.
                    if (birth == params.birthday && phoneNumber == params.phoneNum) {
                        sessionStorage.setItem("uniqueKey", res.certification_uniquekey)
                        const returnData = {
                            result: true,
                            phone_number: phoneNumber
                        }
                        result = returnData
                    } else {
                        const returnData = {
                            result: false,
                            phone_number: phoneNumber
                        }
                        result = returnData
                    }
                }
            })
            .catch((err) => {
                console.log("getUserInfo Error : ", err)
            })
            
    } else {
        // 로그인 또는 휴대폰 번호 변경인 경우. id와 jwt토큰을 같이 보내줘야한다.
        // verifyIamportRest/verifyIamport_result
        await axios
        .post(process.env.backendURL + axiosJson.account.verify_iamport_result, {
            id: params,
            imp_uid: uid,
            jwt: sessionStorage.getItem("jwt")
        })
        .then((response) => {
            console.log(response)
            // backend에서 db 정보와 iamport 정보를 비교해서 일치하는지 아닌지 보내준다.
            const returnData = response.data
            result = {
                phone_number: returnData.phone_number,
                result: returnData.result
            }
        })
        .catch((err) => {
            console.log("comparedUserInfo Error : ", err)
        })
    }
    return result
}
function singUpCheck(phoneNum, birthday) {
    // 회원 가입시 로직
    sessionStorage.setItem("verify", true)
    sessionStorage.setItem("phoneNum", phoneNum)
    window.dispatchEvent(new Event("sessionStorageUpdated"))
}
function changePhone(logInInfo, phoneNum) {
    // 휴대폰 번호 변경 시 로직
    sessionStorage.setItem("verify", true)
    sessionStorage.setItem("phoneNum", phoneNum)
    window.dispatchEvent(new Event("sessionStorageUpdated"))
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
