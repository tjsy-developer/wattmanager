<template>
    <div class="inspectionAlertModal-component">
        <div class="inspectionAlertModal-component__header row justify-center items-center">
            <p>시스템 점검 안내</p>
        </div>
        <div class="inspectionAlertModal-component__body column justify-center items-center">
            <p style="margin: 3px">안정적인 서비스 제공을 위해 시스템 점검을 진행합니다.</p>
            <p style="margin: 3px">점검 기간동안 홈페이지 이용이 불가하오니,</p>
            <p style="margin: 3px">양해부탁드립니다.</p>
            <p style="margin: 3px">점검 시간은 상황에 따라 조기종료 또는 지연될 수 있습니다.</p>
            <p style="margin: 3px">감사합니다.</p>
        </div>
        <div class="inspectionAlertModal-component__content row justify-center items-center">
            <div class="show-inspection-content column justify-center items-center">
                <div class="inspectionDate row items-center">
                    <p class="inspection-date1 row justify-center items-center">점 검 일 시 | &nbsp;</p>
                    <p class="inspection-date2 row justify-center items-center">{{ propsData.inspectionDate }}</p>
                </div>
                <div class="inspectionPhone row items-center">
                    <p class="inspection-phonNum1 row justify-center items-center">긴급연락번호 | &nbsp;</p>
                    <p class="inspection-phonNum2 row justify-center items-center">{{ propsData.inspectionPhoneNum }}</p>
                </div>
            </div>
        </div>
        <div class="inspectionAlertModal-component__footer row justify-center items-center">
            <input class="close-for-day-btn" type="checkbox" value="true" v-model="checked" />
            <span class="close-for-day-text">오늘하루 팝업창 열지 않기</span>
            <button class="close-btn" @click="close()">닫기</button>
        </div>
    </div>
</template>

<script>
import inspectionAlertModal from "@/components/mainIndex/inspectionAlertModal"
import cookieSetting from "@/assets/scripts/data/cookie"
export default {
    components: {
        inspectionAlertModal
    },
    props: {
        propsData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            checked: []
        }
    },
    methods: {
        closeForDay() {
            if (this.checked == "true") {
                cookieSetting.setCookie("overhaulNum", this.propsData.overhaulNumber, 24)
                cookieSetting.setCookie("closeForDay", "ture", 24)
                console.log("###########")
            } else {
                return
            }
            console.log("탔다!")
        },
        close() {
            this.closeForDay()
            const closeClick = "true"
            console.log(this.checked, "###########")
            this.$emit("closeCheck", closeClick)
        }
    }
}

</script>

<style lang="sass" scoped>
.inspectionAlertModal-component
    border: 1px solid #DDDDDD
    border-radius: 8px
    background: none
    background-color: white
    top: 10px
    left: 10px
    margin: 0px
    position: fixed

    &__header
        font-size: 28px
        font-weight: bold
        top: 74px
        width: 100%
        height: 10%
        margin: 0px
    &__body
        font-size: 18px
        top: 38px
        width: 100%
        height: 50%
        margin: 0px
    &__content
        width: 100%
        height: 23%
        display: flex
        align-items: center
        justify-content: center
        .show-inspection-content
            width: 90%
            height: 100%
            background-color: rgba(224, 233, 245, 1)
            border-radius: 8px
            font-size: 18px
            position: absolute
            z-index: 1
            top: 19.5px
            .inspectionDate
                top: 10px
                margin: 0px
                width: 100%
                height: 50%
                .inspection-date1
                    margin: 0px
                    height: 100%
                    font-weight: bold
                    margin-left: 43px
                    top: 15px
                .inspection-date2
                    margin: 0px
                    height: 100%
                    top: 15px
            .inspectionPhone
                bottom: 10px
                margin: 0px
                width: 100%
                height: 50%
                .inspection-phonNum1
                    margin: 0px
                    height: 100%
                    font-weight: bold
                    margin-left: 43px
                    bottom: 15px
                .inspection-phonNum2
                    margin: 0px
                    height: 100%
                    bottom: 15px

    &__footer
        position: relative
        top: 10px
        width: 100%
        height: 20%
        .close-for-day-btn
            position: absolute
            left: 20px
            &:hover
                cursor: pointer
        .close-for-day-text
            position: absolute
            left: 40px
        .close-btn
            position: absolute
            right: 20px
</style>