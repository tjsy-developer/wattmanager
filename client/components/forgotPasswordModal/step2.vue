<template>
  <div class="row step2">
    <button class="icon" @click="close">
      <img src="@/assets/images/list_icon_filter_x.png" />
    </button>
    <span class="col-12 text-center title">{{ $t("change password") }}</span>
    <div class="row justify-center pwWidth">
      <div class="pwBox row">
        <input class="col-12 password" :placeholder="$t('password')" type="password" v-model="password" />
        <input class="col-12 passwordCheck" :placeholder="$t('password check')" type="password" v-model="passwordCheck" />
        <button class="col-12 button" @click="confirm">{{ $t("confirm") }}</button>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  props: ["compData"],
  data() {
    return {
      password: undefined,
      passwordCheck: undefined
    }
  },
  methods: {
    close() {
      this.$modal.hide("forgotPasswordModal")
    },
    confirm() {
      if (
        this.password &&
        this.passwordCheck &&
        this.password === this.passwordCheck
      ) {
        const self = this
        this.$axios
          .post(process.env.backendURL + "accountRest/change_password", {
            id: this.compData.id,
            password: this.password
          })
          .then(function(res) {
            if (res.data) {
              alert(self.$t("attachment")[1])
              self.close()
            } else alert(self.$t("attachment")[2])
          })
          .catch(function(error) {
            console.log("step2.vue error : ", error)
            alert(self.$t("attachment")[2])
          })
      } else if (!this.password || !this.passwordCheck)
        alert(this.$t("account")[6])
      else alert(this.$t("account")[8])
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

.step2
  width: 100%
  height: 100%
  border: 1px solid #4D4D4D
  padding: 30px
  background-color: #2A2A2A
  overflow-y: scroll

.icon
  position: absolute
  top: 10px
  right: 10px

  >img
    padding: 16px

.title
  font-size: 23px
  font-weight: bold
  color: white
  margin-top: 20px
  display: flex
  align-items: center
  justify-content: center

input[type=password]
  font-family: auto

.password,
.passwordCheck
  outline: none
  font-size: 15px
  font-weight: 800
  padding: 16px
  color: white
  background-color: #3E3E3E
  opacity: 1
  border: 1px solid #4B4B4B
  @media screen and (max-width: 768px)
    padding: 12px 8px
::placeholder
  color: #696969

.password
  margin-top: 15px

.passwordCheck
  margin-top: 15px

.button
  margin-top: 14px
  padding: 16px
  background: #2386D2
  color: #fff
  @media screen and (max-width: 768px)
    padding: 12px 8px

.pwBox
  width: 455px
  // height: -webkit-fill-available

.pwWidth
  width: 100%
  height: fit-content
@media screen and (max-width: 500px)
  .step2
    padding: 14px
</style>
