<template>
  <div class="row content-center profile">
    <button class="icon" @click="close">
      <img src="@/assets/images/list_icon_filter_x.png" />
    </button>
    <span class="col-12 text-center title">{{ $t("change password") }}</span>
    <input class="col-12 password" :placeholder="$t('profilePassword')[0]" type="password" v-model="password" />
    <input class="col-12 newPassword" :placeholder="$t('profilePassword')[1]" type="password" v-model="newPassword" />
    <input class="col-12 newPasswordCheck" :placeholder="$t('profilePassword')[2]" type="password" v-model="newPasswordCheck" />
    <button class="col-12 button" @click="confirm">{{ $t("confirm") }}</button>
  </div>
</template>

<script>

export default {
  props: ["userSeq"],
  data() {
    return {
      password: undefined,
      newPassword: undefined,
      newPasswordCheck: undefined
    }
  },
  methods: {
    close() {
      this.$modal.hide("forgotPasswordModal")
    },
    confirm() {
      if (
        this.newPassword &&
        this.newPasswordCheck &&
        this.newPassword !== this.newPasswordCheck
      )
        alert(this.$t("account")[8])
      else if (
        this.password &&
        this.newPassword &&
        this.newPasswordCheck &&
        this.newPassword === this.newPasswordCheck
      ) {
        const self = this
        this.$axios
          // .post("userRest/user_password_check_change", {
          .post(
            process.env.backendURL + "userRest/user_password_check_change",
            {
              user_seq: this.userSeq,
              password: this.password,
              password_new: this.newPassword,
              jwt: localStorage.getItem("jwt")
            }
          )
          .then(function(res) {
            if (res.data) {
              alert(self.$t("attachment")[1])
              self.close()
            } else alert(self.$t("profilePassword")[3])
          })
          .catch(function(error) {
            console.log("profile.vue error : ", error)
            alert(self.$t("attachment")[2])
          })
      } else alert(this.$t("account")[6])
    }
  }
}
</script>

<style lang="sass" scoped>
.profile
	width: 100%
	height: 100%
	border: 1px solid #d9d9d9
	padding: 30px
	background-color: white
  

.icon
	position: absolute
	top: 10px
	right: 10px
  

	>img
		padding: 16px
    

.title
	font-size: 18px
	font-weight: bold
	color: #26439a
	margin-top: 20px
  

input[type=password]
	font-family: auto
  

.password,
  
.newPassword,
  
.newPasswordCheck
	font-size: 15px
	font-weight: 800
	padding: 16px
	border: 1px solid #d9d9d9
  

.password
	margin-top: 35px
  

.newPassword,
  
.newPasswordCheck
	margin-top: 8px
  

.button
	margin-top: 14px
	padding: 16px
	background: #26439a
	color: #fff
  

@media screen and (max-width: 500px)
	.profile
		padding: 14px
</style>
