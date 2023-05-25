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
            name: logInData.name,
            phone: logInData.phone
        },
        // 승인 or 실패시 callBack Function
        async function (rsp) {
            console.log(rsp.imp_uid)
            const { success, error_msg } = rsp
            if (success) {
                alert(`본인인증 성공`)
                const impParams = rsp.imp_uid
                const certifyData = await getCertification(impParams)
                if (type == 0) {
                    login(logInData)
                } else if (type == 1) {
                    sessionStorage.setItem("verify", true)
                } else if (type == 2) {
                    sessionStorage.setItem("verify", true)
                }
            } else {
                alert(`본인인증 실패: ${error_msg}`)
                if (type != 0) {
                    sessionStorage.setItem("verify", false)
                }
            }
        }
    )
}
function login(logInData) {
    let params
    const loginData = logInData.loginData
    const isMember = logInData.isMember
    const reservUserId = logInData.reservUserId
    const userId = logInData.id
    const reservId = logInData.reservId
    const lang = logInData.language
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
        console.log(params);

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
async function getCertification(params) {
    console.log(params, "==============================")
    const { imp_uid } = params // request의 body에서 imp_uid 추출
    console.log(imp_uid, "==========")
    try {
        // 인증 토큰 발급 받기
        const options = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: '5072156752128376', // REST API키
            imp_secret: 'ye1LTvOn17hLG6kXd81hANil8TrEcpyUmXUNsgnjwCONVdY82aY9W7OQFSXF07IV3WJ6ZiRaH7M2sc9h', // REST API Secret
            }, options
        )
        const { access_token } = getToken.data // 인증 토큰
        console.log(access_token)
        
        const getCertifications = await axios.get(`https://api.iamport.kr/certifications/` + params, {
            headers: { Authorization: access_token }
        })
        const certificationsInfo = getCertifications.data // 조회한 인증 정보
        console.log(certificationsInfo, "=====")
        return certificationsInfo
    } catch (e) {
        console.log("날탔다?")
        console.error(e)
    }
}
