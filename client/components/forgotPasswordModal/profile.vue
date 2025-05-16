<template>
  <div class="row content-center profile">
    <button class="icon" @click="close">
      <img src="@/assets/images/list_icon_filter_x.png" />
    </button>
    <span class="col-12 text-center title">{{ $t("change password") }}</span>
    <input class="col-12 password" :placeholder="$t('profilePassword')[0]" type="password" v-model="password" />
    <input class="col-12 newPassword" :placeholder="$t('profilePassword')[1]" type="password" v-model="newPassword" @input="passWordPaternCheck"/>
    <input class="col-12 newPasswordCheck" :placeholder="$t('profilePassword')[2]" type="password" v-model="newPasswordCheck" />
    <span class="description" v-if="checkPatern">{{ pwdRulesDescript }}</span>
    <button class="col-12 button" @click="confirm">{{ $t("confirm") }}</button>
  </div>
</template>

<script>
import { axiosRequest } from "@/plugins/axiosRequest"
export default {
  props: ["userSeq"],
  data() {
    return {
      password: undefined,
      newPassword: undefined,
      newPasswordCheck: undefined,
      checkPatern: process.env.checkPswPatern,
      pwdRulesDescript: process.env.pwdRulesType ? this.$t("checkPswPatern")[Number(process.env.pwdRulesType)] : '',
      validPassword: false,
    }
  },
  methods: {
    close() {
      this.$modal.hide("forgotPasswordModal")
      window.location.href = "/profile"
    },
    // 비밀번호 규칙이 있을 경우만
    passWordPaternCheck() {
      console.log(this.checkPatern != 'true')
      if (this.checkPatern != 'true') this.validPassword = true
      else this.validPassword = this.isValidPassword(this.newPassword)
    },
   async confirm() {
      if (
        this.newPassword &&
        this.newPasswordCheck &&
        this.newPassword !== this.newPasswordCheck
      ) {
        alert(this.$t("account")[8])
        return
      } 
        
      else if (this.validPassword == false) {
        document.getElementsByClassName("newPassword")[0].focus()
        return alert(this.$t("incorrectPwdFormat"))
      }
      else if (
        this.password &&
        this.newPassword &&
        this.newPasswordCheck &&
        this.newPassword === this.newPasswordCheck
      ) {
        const self = this
        const params = {
          data: {
            jwt: sessionStorage.getItem("jwt"),
            user_seq: Number(sessionStorage.getItem("userSeq")),
            password: this.password,
            password_new: this.newPassword
          },
          api: process.env.backendURL + "userRest/user_password_check_change"
        }
        await axiosRequest('post', params)
          .then(function(res) {
            if (res.data) {
              const parameter = {
                data: {
                  id: sessionStorage.getItem("id")
                },
                api: process.env.backendURL + "accountRest/resetPasswordChangeDate"
              }
              axiosRequest('post', parameter)
                .then((res) => {
                  console.log(res)
                  console.log(res.data)
                })
                .catch((err) => {
                  console.log(err)
                })
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
	margin-top: 20px

.newPassword,
.newPasswordCheck
	margin-top: 8px

.description
	margin-top: 10px
	color: #E91E63
	font-weight: 700

.button
	margin-top: 14px
	padding: 16px
	background: #26439a
	color: #fff
  

@media screen and (max-width: 500px)
	.profile
		padding: 14px
</style>
