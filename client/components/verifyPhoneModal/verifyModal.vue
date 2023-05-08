<template>
    <div class="modalWrap">
        <div class="modalWrap__head">
            <button class="close-btn" @click="close()">
                <img src="@/assets/images/ic_popup_finish.png" />
            </button>
        </div>
        <div class="modalWrap__body">
            <img src="@/assets/images/ic_phone.png" />
            <div class="verifyText">
                <span class="verifyText__bold">
                    {{ $t("verify")[0] }}<br>
                </span>
                <span>
                    {{ $t("verify")[1] }}<br>
                    {{ $t("verify")[2] }}
                </span>
            </div>
            <button class="verify-btn">
                <span>{{ $t("verify")[3] }}</span>
            </button>
        </div>
    </div>
</template>

<script>
import domain from "@/assets/jsons/domain/domain";
export default {
    props: {
        propsData: {
            type: Object,
            required: true
        }
    },
    methods: {
        close() {
            this.$modal.hide("verifyModal")
            this.login()
        },
        login() {
            let params
            const loginData = this.propsData.loginData
            const isMember = this.propsData.isMember
            const reservUserId = this.propsData.reservUserId
            const userId = this.propsData.id
            const reservId = this.propsData.reservId
            const lang = this.propsData.language
            // 회원이 이메일로 회의실입장하려고 하는 경우
            /* 1. reservUserId --> 이메일 타고 들어온 사용자의 아이디
            2. isMember -> 이메일을 클릭하여 들어왔는지판단(회원판단) (true == 이메일로 접근) */
            // 두가지 조건이 만족하면 회원입장 페이지로 이동
            if (this.propsData.type == 1) {
                window.open("/attachment/video?page=1&viewType=gallery", "_self");
            } else if (this.propsData.type == 2) {
                window.open("/attachment/memo?page=1&viewType=gallery", "_self");
            } else if (this.propsData.type == 3) {
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
}
</script>

<style lang="scss" scoped>
.modalWrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	border: 1px solid #4D4D4D;
	background: #2A2A2A 0% 0% no-repeat padding-box;
    color: white;

    &__head {
        height: 5%;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        img {
            top: 3px;
            right: 9px;
        }
    }
    &__body {
        width: 100%;
        height: 95%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        .verifyText {
            display: flex;
            flex-direction: column;
            text-align: center;
            margin-top: 24px;
            margin-bottom: 44px;
        }
        .verifyText__bold {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 14px
        }
        button {
            width: 330px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            background:#2386D2 0% 0% no-repeat padding-box;
            color: white
        }
    }
}
</style>
