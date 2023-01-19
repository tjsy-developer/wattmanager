<template lang="pug">
.inspectionAlertModal-component
    .inspectionAlertModal-component__header.row.justify-center.items-center
        p 시스템 점검 안내
    .inspectionAlertModal-component__body.column.justify-center.items-center
        p 안정적인 서비스 제공을 위해 시스템 점검을 진행합니다.
        p 점검 기간동안 홈페이지 이용이 불가하오니,
        P 양해부탁드립니다.
        p 점검 시간은 상황에 따라 조기종료 또는 지연될 수 있습니다.
        p 감사합니다.
    .inspectionAlertModal-component__content.row.justify-center.items-center
        .show-inspection-content.column.justify-center.items-center
            span.inspection-date 점 검 일 시 | {{ propsData.inspectionDate }}
            span.inspection-phonNum 긴급연락번호 | {{ propsData.inspectionPhoneNum }}
    .inspectionAlertModal-component__footer.row.justify-center.items-center
        input.close-for-day-btn(type="checkbox" value="true" v-model="checked")
        span.close-for-day-text 오늘하루 팝업창 열지 않기
        button.close-btn(@click="close()") 닫기
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
    top: 20%
    left: 1%
    margin: 0px
    position: absolute

    &__header
        font-size: 28px
        top: 45px
        width: 100%
        height: 10%
    &__body
        font-size: 20px
        top: 30px
        width: 100%
        height: 50%
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
            font-size: 21px
            position: absolute
            z-index: 1
            top: 19.5px
            .inspection-date
            .inspection-phonNum
                left: -82px
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