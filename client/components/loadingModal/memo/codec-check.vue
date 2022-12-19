<template>
    <div class="modal">
        <div class="modal_content" v-if="modalStep == 'checkingCodec'">
            <p> {{ $t("codecCheck")[0] }} </p>
            <p> {{ $t("codecCheck")[1] }} </p>
            <p>{{ $t("codecCheck")[2] }}</p>
            <img src="@/assets/images/animation.gif" alt="">
        </div>
        <div class="modal_content" v-else-if="modalStep == 'possibleCodec'">
            <p> {{ $t("codecCheck")[3] }} </p>
            <button class="buttons buttons--save" @click="keepUploading">{{ $t("codecCheck")[4] }}</button>
        </div>
        <div class="modal_content" v-else-if="modalStep == 'impossibleCodec'">
            <p>{{ $t("codecCheck")[5] }}</p>
            <p>{{ $t("codecCheck")[6] }}</p>
            <p>{{ $t("codecCheck")[7] }}</p>
            <p>{{ $t("codecCheck")[8] }}</p>
            <a href="#" target="_blank" @click="codecConversion" class="modal_link">{{ $t("codecCheck")[9] }}</a>
            <button class="buttons buttons--cancle" @click="cancleBtnClick">{{ $t("codecCheck")[10] }}</button>
        </div>
    </div>
</template>
<script>
export default {
    props: ["modalStep"],
    data() {
        return {

        }
    },
    methods: {
        cancleBtnClick() {
            this.$modal.hide("codecCheckModal")
            // 클릭 시 해당인덱스 file 초기화 필요
        },
        codecConversion() {
            this.$modal.hide("codecCheckModal")
            window.open("/popup/codec-conversion", "", "width= 450, height= 350, status=no, toolbar=no, scrollbars=no; ")
        },
        keepUploading() {
            this.$modal.hide("codecCheckModal")
        }
    },
    mounted() {
        console.log(this.modalStep)
    }
}
</script>
<style scoped lang="sass">
.modal
    font-size: 15px
    width: inherit
    height: inherit
    &_content
        background-color: #eff0f1
        width: inherit
        height: inherit
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        font-weight: bold
        > p:first-child
            margin-top: 20px
        >img
            width: 40px
            margin-top: 10px
    &_link
        text-decoration: underline
        color: #0000ffd9
        margin-bottom: 15px
.buttons
    padding: 5px 15px
    border-radius: 6px
    color: white
    &--save
        background-color: #1dbfa4
        margin-top: 25px
        &:hover
            background-color: #26a69a
    &--cancle
        background-color: #9e9e9e
        &:hover
            background: #707070
</style>