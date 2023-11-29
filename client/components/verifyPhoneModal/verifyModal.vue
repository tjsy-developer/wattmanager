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
import { danalVerify } from "@/assets/scripts/danalVerify"
import pswChangeModal from "@/components/pswChangeModal/pswChangeModal";

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
        },
        verify() {
            const self = this
            this.$axios
            .post(process.env.backendURL + axiosJson.user.user_info_one, {
                user_seq: this.propsData.user_seq,
                jwt: sessionStorage.getItem("jwt")
            })
            .then(function (response) {
                const params ={
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
                        changePsw: self.propsData.changePsw
                    }
                
                danalVerify(params, 0)
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        openChangePswModal(params, type) {
            this.$modal.hide("verifyModal")
            const modalsContainerStyle =
                document.getElementById("modalsContainer").style;
            modalsContainerStyle.display = "block";

            const modalParameter = {
                loginData: params,
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
