<template>
    <div class="modalWrap">
        <div class="modalWrap__header">
            <span>휴대폰번호 변경</span>
            <button class="close-btn" @click="close()">취소</button>
        </div>
        <div class="modalWrap__body">
            <div class="beforeNum">
                <span>{{ beforePhone }}</span>
            </div>
            <div class="triangle"></div>
            <div class="changeNum">
                <input class="changeNum__input" type="text" v-model="changePhone" placeholder="변경하려는 번호를 입력해주세요" style="border: none" />
            </div>
        </div>
        <div class="modalWrap__footer">
            <button class="verifyButton" @click="changePhoneNumber()">변경</button>
        </div>
    </div>
</template>

<script>
import { danalVerify } from "@/assets/scripts/danalVerify"
export default {
    props: {
        propsData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            beforePhone: this.propsData.phone,
            changePhone: ""
        }
    },
    methods: {
        changePhoneNumber() {
            if (this.changePhone.length == 11) {
                const params = {
                    phone: this.changePhone,
                    birthday: this.propsData.data[8],
                    compData: this.propsData.data,
                    lang: sessionStorage.getItem("languageCode"),
                    closeFunc: this.close
                }
                danalVerify(params, 2)
            } else {
                alert("휴대폰번호를 정확히 입력해주세요")
            }
        },
        close() {
            this.$modal.hide("changePhoneModal")
        }
    },
}
</script>

<style lang="sass" scoped>
.modalWrap
    width: 100%
    height: 100%
    background-color: white
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    font-size: 15px
    &__header
        width: 100%
        height: 50px
        display: flex
        justify-content: center
        align-items: center
        position: relative
        font-weight: bold
    .close-btn
        position: absolute
        right: 10px
        font-weight: normal
    &__body
        width: 100%
        height: calc(100% - 100px)
        display: flex
        justify-content: center
        align-items: center
    &__footer
        width: 100%
        height: 50px
        display: flex
        justify-content: center
        align-items: center

.beforeNum
    width: calc((100% - 30px) / 2)
    display: flex
    justify-content: center
    align-items: center
.changeNum
    width: calc((100% - 30px) / 2)
    display: flex
    justify-content: center
    align-items: center
    &__input
        width: 80%
.triangle
    width: 30px
    height: 0px
    border-left: 17px solid #D1D1D1
    border-top: 12px solid transparent
    border-bottom: 12px solid transparent
    display: flex
    justify-content: center
    align-items: center
</style>