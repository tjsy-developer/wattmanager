export const danalVerify = (logInData) => {
    const { IMP } = window
    IMP.init('imp67320503')

    IMP.certification(
        {
            // pg사 코드 고정값 ( DL / SMART ) 각자 다름
            pg: 'danal.B010008107',
            // 승인 리다이렉션 url
            m_redirect_url: '/',
            // mobile popup
            popup: false,
        },
        // 승인 or 실패시 callBack Function
        function (rsp) {
            const { success, name, error_msg } = rsp
            if (success) {
                alert(`본인인증 성공 ${name}`)
                // console.log(logInData)
                login()
                return "SUCESS"
            } else {
                alert(`본인인증 실패: ${name} ${error_msg}`)
                return "FAIL"
            }
        }
    )
    function login() {
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
}

