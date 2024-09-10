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
            <button class="verify-btn" @click="verify()">
                <span>{{ $t("verify")[3] }}</span>
            </button>
        </div>
    </div>
</template>

<script>
;
import axiosJson from "@/assets/jsons/axios";
import { danalVerify } from "@/assets/scripts/danalVerify";
import pswChangeModal from "@/components/pswChangeModal/pswChangeModal";

export default {
    props: {
        propsData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            checkChangeDate: false
        }
    },
    methods: {
        close() {
            this.$modal.hide("verifyModal")
        },
        async verify() {
            const self = this
            const parameter = {
               data: {
                user_seq: this.propsData.user_seq,
                jwt: sessionStorage.getItem("jwt")
               },
               api: process.env.backendURL + axiosJson.user.user_info_one
            }
            // this.$axios
            // .post(process.env.backendURL + axiosJson.user.user_info_one, {
            //     user_seq: this.propsData.user_seq,
            //     jwt: sessionStorage.getItem("jwt")
            // })
            await this.axiosRequest('post', parameter)
            .then(function (response) {
                const params = {
                        queryParams: self.propsData.queryParams,
                        loginData: self.propsData.loginData,
                        isMember: self.propsData.isMember,
                        userId: self.propsData.id,
                        reservId: self.propsData.reservId,
                        lang: self.propsData.language,
                        type: self.propsData.type,
                        name: response.data.name,
                        phone: response.data.phone_number,
                        birthday: response.data.birthday,
                        id: response.data.id,
                        changePsw: self.checkChangeDate
                    }
                
                danalVerify(params, 0)
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        openChangePswModal(params, type) {
            this.$modal.hide("verifyModal")
            if (params.changePsw) {
                const modalsContainerStyle =
                    document.getElementById("modalsContainer").style;
                modalsContainerStyle.display = "block";

                const modalParameter = {
                    loginData: params,
                    modalType: type
                }
                this.$modal.show(
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
        async checkPswChange() {
            const self = this
            const params = {
                data: {
                    en_seq: Number(sessionStorage.getItem("enSeq")),
                    hq_seq: Number(sessionStorage.getItem("hqSeq")),
                    br_seq: Number(sessionStorage.getItem("brSeq"))
                },
                api: process.env.backendURL + axiosJson.app.app_powertalkweb_info
            }
            // 앱 정보 확인
            // this.$axios
            //     .post(process.env.backendURL + axiosJson.app.app_powertalkweb_info, {
            //         en_seq: Number(sessionStorage.getItem("enSeq")),
            //         hq_seq: Number(sessionStorage.getItem("hqSeq")),
            //         br_seq: Number(sessionStorage.getItem("brSeq"))
            //     })
            await this.axiosRequest('post', params)
                .then((res) => {
                    if (res.data.length > 0) {
                        const jsonAppList = res.data[0].app_detail_json
                        const appList = JSON.parse(jsonAppList)
                        // 앱정보의 비밀번호 변경 안내 가 true이고 글라스가 아니며 admin이 아닌경우 비밀번호 변경일을 가져 옴
                        if (appList["pswChangeAlert"] == "True" && sessionStorage.getItem("deviceType") != 2 && sessionStorage.getItem("auth") !== 4) {
                            const parameter = {
                                data: {
                                    id: self.propsData.id
                                },
                                api: process.env.backendURL + axiosJson.account.getPasswordChangeDate
                            }
                            // self.$axios
                            // .post(process.env.backendURL + axiosJson.account.getPasswordChangeDate, {
                            //     id: self.propsData.id
                            // })
                            self.axiosRequest('post', parameter)
                            .then((response) => {
                                const changedDate =  response.data // 비밀번호 변경한 날자 (unixtime으로 옴 초까지만!!!!!!)
                                const now = Math.floor(new Date().getTime() / 1000) // 현재 시간
                                const unixChangeDuration = Number(appList["changeDuration"]) *24 * 60 * 60 // 앱정보에서 받은 설정 날자로 셋팅
                                if (now > changedDate + unixChangeDuration) {
                                    self.checkChangeDate = true
                                } else {
                                    self.checkChangeDate = false
                                }
                            })
                            .catch((err) => {
                                console.log("getChangeDate Err: ", err)
                            })
                        }
                    }
                })
                .catch((err) => {
                    console.log(`get app info one error : ${{err}}`)
                })
        }
    },
    mounted() {
        // 비밀번호 변경 안내 모달 띄울지 여부 확인
        this.checkPswChange()
        // 본인인증이 끝나고 비밀번호 변경 모달을 띄우는 것
        window.addEventListener("finishVerifyOpenChangePsw", (e) => {
            this.openChangePswModal(e.detail, 2)
        })
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
