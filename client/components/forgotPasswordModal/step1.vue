<template lang="pug">
	.row.justify-center.step1
		button(@click="close").icon
			img(src="@/assets/images/ic_popup_finish.png")
		.row.justify-center.items-center.pwBox
			span.col-12.text-center.title {{ $t("find password") }}
			label.col-12 {{ $t("email confirm")[0] }}
			input(:placeholder="$t('id')", v-model="compData.inputId").col-12.id
			input(:placeholder="$t('e-mail')", v-model="inputEMail").col.eMail
			button(@click="send").col-auto.send {{ $t("send") }}
			label.col-12 {{ $t("email confirm")[1] }}
			input(:placeholder="$t('enter code')", v-model="inputCode").col-12.inputCode
			button(@click="next").col-12.button {{ $t("next") }}
</template>

<script>
import domain from "@/assets/jsons/domain/domain"

export default {
  props: ["compData"],
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
      this.$modal.hide("forgotPasswordModal")
    },
    send() {
      const self = this
      if (!this.compData.inputId || !this.inputEMail)
        return alert(this.$t("check ID/e-mail"))

      this.$axios
        // .post(accountRest/create_random_arr", {
        .post(domain.domain.backend1 + "accountRest/create_random_arr", {
          id: this.compData.inputId,
          email: this.inputEMail
        })
        .then(function(res) {
          if (res.data) {
            alert(self.$t("check your e-mail"))
            self.compData.id = self.compData.inputId
            self.eMail = self.inputEMail
            self.getCode = res.data
          } else alert(self.$t("check ID/e-mail"))
        })
        .catch(function(error) {
          console.log("step2.vue error : ", error)
          alert("fail")
        })
    },
    next() {
      if (!this.compData.inputId || !this.inputEMail || !this.inputCode)
        return alert(this.$t("account")[6])
      else if (
        this.compData.inputId !== this.compData.id ||
        this.inputEMail !== this.eMail
      )
        return alert(this.$t("check ID/e-mail"))
      else if (this.inputCode !== this.getCode)
        return alert(this.$t("check your code"))
      else if (this.inputCode && this.inputCode === this.getCode)
        this.compData.canNextStep = true
      else alert("fail")
    }
  }
}
</script>

<style lang="sass" scoped>

::-webkit-scrollbar
  width: 4px

::-webkit-scrollbar-track
  background-color: #2f3542

::-webkit-scrollbar-thumb
  background: #4D4D4D
  border-radius: 15px

input,
button
	border-radius: 3px
.step1
	width: 100%
	height: 100%
	border: 1px solid #4D4D4D
	background: #2A2A2A 0% 0% no-repeat padding-box
	overflow-y: scroll
	padding: 10px
	// opacity: 0.95

.icon
	position: absolute
	top: 2px
	right: 2px

	>img
		padding: 5px
		width: 20px
		height: 20px

.title
	font-size: 23px
	font-weight: bold
	color: white
	//margin-top: 20px

.id,
.eMail,
.inputCode
	font-size: 15px
	font-weight: 800
	padding: 16px
	color: white
	background-color: #3E3E3E
	opacity: 1
	border: 1px solid #4B4B4B
	outline: none
	@media screen and (max-width: 768px)
		padding: 12px 8px
::placeholder
	color: #696969


.eMail,
.send
	margin-top: 12px

.send
	width: 100px
	padding: 16px
	margin-left: 10px
	color: #fff
	background: #2386D2
	@media screen and (max-width: 768px)
		padding: 12px 8px

.button
	margin-top: 14px
	margin-bottom: 20px
	padding: 16px
	background: #2386D2
	color: #fff
	@media screen and (max-width: 768px)
		padding: 12px 8px

.pwBox
	width: 455px
	// height: -webkit-fill-available

input:focus
	border: 2px solid #2386D2

label
	color: white
	font-size: 16px
	font-weight: lighter
	margin-bottom: 5px
	margin-top: 17px
	padding-left: 10px

@media screen and (max-width: 500px)
	.step1
		padding: 14px
@media screen and (max-width: 400px)
	.send
		width: 60px
</style>
