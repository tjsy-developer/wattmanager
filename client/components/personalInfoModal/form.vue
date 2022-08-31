<template lang="pug">
  .row.content-center.justify-center.step1
    button(@click="close").icon
      img(src="@/assets/images/ic_popup_finish.png")
    koForm(v-if="$i18n.locale == 'ko'" @consentValToggle="consentValToggle" :consentStatus="consentStatus")
    enForm(v-if="$i18n.locale == 'en'" @consentValToggle="consentValToggle" :consentStatus="consentStatus")
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
    // send() {
    //   const self = this
    //   if (!this.compData.inputId || !this.inputEMail)
    //     return alert(this.$t("check ID/e-mail"))

    //   this.$axios
    //     // .post(accountRest/create_random_arr", {
    //     .post(domain.domain.backend1 + "accountRest/create_random_arr", {
    //       id: this.compData.inputId,
    //       email: this.inputEMail
    //     })
    //     .then(function(res) {
    //       if (res.data) {
    //         alert(self.$t("check your e-mail"))
    //         self.compData.id = self.compData.inputId
    //         self.eMail = self.inputEMail
    //         self.getCode = res.data
    //       } else alert(self.$t("check ID/e-mail"))
    //     })
    //     .catch(function(error) {
    //       console.log("step2.vue error : ", error)
    //       alert("fail")
    //     })
    // },
    // next() {
    //   if (!this.compData.inputId || !this.inputEMail || !this.inputCode)
    //     return alert(this.$t("account")[6])
    //   else if (
    //     this.compData.inputId !== this.compData.id ||
    //     this.inputEMail !== this.eMail
    //   )
    //     return alert(this.$t("check ID/e-mail"))
    //   else if (this.inputCode !== this.getCode)
    //     return alert(this.$t("check your code"))
    //   else if (this.inputCode && this.inputCode === this.getCode)
    //     this.compData.canNextStep = true
    //   else alert("fail")
    // }
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
