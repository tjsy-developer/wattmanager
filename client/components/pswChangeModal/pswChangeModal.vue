<template>
    <div class="modalWrap">
        <div class="modalWrap__header">
            <span>{{ $t("alertChangePsw")[0] }}</span>
        </div>
        <div class="modalWrap__body">
            <span>{{ $t("alertChangePsw")[1] }}</span>
            <span>{{ $t("alertChangePsw")[2] }}</span>
        </div>
        <div class="modalWrap__footer">
            <button @click="close()">
                <span>{{ $t("alertChangePsw")[3] }}</span>
            </button>
            <button @click="changePsw()">
                <span>{{ $t("alertChangePsw")[4] }}</span>
            </button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        propsData: {
            type: Object,
            required: true
        }
    },
    methods: {
        close() {
            this.$modal.hide("pswChangeModal")
            this.login()
        },
        login() {
            if (this.propsData.modalType == 1) {
                window.open(this.propsData.url, _self)
            } else {
                this.checkLoginType(this.propsData.loginData)
            }
        },
        changePsw() {
            // 이런 경우는 거의 없지만 혹여라도 sessionStorage에 셋팅이 안된 경우를 위해
            const managerParameter =
				"&jwt=" + sessionStorage.getItem("jwt") + "&id=" + sessionStorage.getItem("id") +
				"&auth=" + sessionStorage.getItem("auth") + "&hqSeq=" + sessionStorage.getItem("hqSeq") +
				"&enSeq=" + sessionStorage.getItem("enSeq") + "&brSeq=" + sessionStorage.getItem("brSeq") +
				"&logined=" + sessionStorage.getItem("logined") + "&userSeq=" + sessionStorage.getItem("userSeq") +
				"&deviceType=" + sessionStorage.getItem("deviceType") + "&type=profile"

            // ?changePsw=ture <- profile edit page로 이동시 자동으로 비밀번호 변경 모달을 띄우기위해
            if (this.propsData.modalType == 1) {
                
                window.open("/profile?changePsw=true", "_self")
                return
            } else {
                window.open(
                    "/loginCheck?lang=" + sessionStorage.getItem("languageCode") +
                    managerParameter
                )
            }
            this.close()
        },
        checkLoginType(logInData) {
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
                    // const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
                    // window.open("/powertalk/index.html?" + randomNumber, "_self");
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.modalWrap {
    width: 100%;
    height: 100%;
    background: #2A2A2A;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    &__header {
        width: 100%;
        height: 90px;
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &__body {
        width: 100%;
        height: calc(100% - 180px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 15px;
    }
    &__footer {
        width: 100%;
        height: 90px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        button {
            width: 30%;
            height: 40px;
            background-color: #2386D2;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
    }
}
</style>