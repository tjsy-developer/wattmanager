<template>
  <div class="row content-center justify-center step1">
    <button class="icon" @click="close">
      <img src="@/assets/images/ic_popup_finish.png" />
    </button>
    <koForm v-if="$i18n.locale == 'ko'" @consentValToggle="consentValToggle" :consentStatus="consentStatus"></koForm>
    <enForm v-if="$i18n.locale == 'en'" @consentValToggle="consentValToggle" :consentStatus="consentStatus"></enForm>
  </div>
</template>

<script>
import koForm from "@/components/personalInfoModal/koForm"
import enForm from "@/components/personalInfoModal/enForm"

export default {
  props: ["consentStatus", "consentVal"],
  components: {
    koForm,
    enForm
  },
  data() {
    return {
      inputEMail: undefined,
      eMail: undefined,
      inputCode: undefined,
      getCode: undefined
    }
  },
  methods: {
    close() {
      this.consentVal(this.consentStatus)
      this.$modal.hide("personalInfoModal")
    },
    // 수집동의서 하위컴포넌트에서 emit한 함수를 실행
    consentValToggle(val) {
      console.log(val)
      // 상위컴포넌트에서 정의한 함수를 사용
      this.consentVal(val)
    }
  }
}
</script>

<style lang="sass" scoped>
.step1
  position: fixed
  width: 700px
  height: 90%
  border: 1px solid #4D4D4D
  background: #2A2A2A 0% 0% no-repeat padding-box
  border-radius: 15px
  overflow-y: auto
  top: 4%
  // opacity: 0.95


::-webkit-scrollbar
  width: 4px

::-webkit-scrollbar-track
  background-color: #2f3542

::-webkit-scrollbar-thumb
  background: #4D4D4D
  border-radius: 15px

.icon
  position: absolute
  top: 2px
  right: 2px
  z-index: 2

  >img
    padding: 5px
    width: 25px
    height: 25px

@media only screen and (min-width: 400px) and (max-width: 776px)
  .step1
    width: 90%
    left: 5%

@media screen and (max-width: 400px)
  .step1
    width: 330px
    left: 4%
    padding-bottom: 5px
</style>
