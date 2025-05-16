<template>
  <div class="row content-center profile">
	<button class="icon" @click="close">
	  <img src="@/assets/images/list_icon_filter_x.png" />
	</button>
	<span class="col-12 text-center title">{{ $t("change password") }}</span>
	<div class="input-box">
	  <input class="col-12 text password" :placeholder="$t('profilePassword')[0]" type="password" v-model="password" />
	</div>
	<div class="input-box">
	  <input class="col-12 text newPassword" :placeholder="$t('profilePassword')[1]" type="password" v-model="newPassword" @input="passWordPaternCheck"/>
	  <img
		class="fa-eye"
		@click="togglePasswordPreview"
		src="@/assets/images/ic_password_disabled.png"
	  />
	</div>
	<div class="input-box">
	  <input class="col-12 text newPasswordCheck" :placeholder="$t('profilePassword')[2]" type="password" v-model="newPasswordCheck" />
	  <img
		class="fa-eye"
		@click="togglePasswordPreview"
		src="@/assets/images/ic_password_disabled.png"
	  />
	</div>
	<span class="description" v-if="checkPatern">{{ pwdRulesDescript }}</span>
	<button class="col-12 button" @click="confirm">{{ $t("confirm") }}</button>
  </div>
</template>

<script>
import { axiosRequest } from "@/plugins/axiosRequest"
export default {
  props: {
	propsData: {
	  type: Object,
	  required: true
	}
  },
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
	  if (this.propsData.modalType === 'reset-psw') {
		this.$modal.hide("passwordResetModal", { type: "next" })
		return
	  }
	},
	// 비밀번호 규칙이 있을 경우만
	passWordPaternCheck() {
	  if (this.checkPatern != 'true') this.validPassword = true
	  else this.validPassword = this.isValidPassword(this.newPassword)
	},
	togglePasswordPreview(e) {
	  const PASSWORD_FIELD_PWD_TYPE = 'password';
	  const PASSWORD_FIELD_TEXT_TYPE = 'text'
	  if (e.target.classList.contains("active")) {
		e.target.classList.remove("active");
		e.target.src = require("@/assets/images/ic_password_disabled.png");
		e.target.previousElementSibling.type = PASSWORD_FIELD_PWD_TYPE;
	  } else {
		e.target.classList.add("active");
		e.target.src = require("@/assets/images/ic_password.png");
		e.target.previousElementSibling.type = PASSWORD_FIELD_TEXT_TYPE;
	  }
	},
	async confirm() {
	  if (
		this.newPassword &&
		this.newPasswordCheck &&
		this.newPassword !== this.newPasswordCheck
	  ) {
		alert(this.$t("account")[8])
		return
	  } else if (this.validPassword == false) {
		document.getElementsByClassName("newPassword")[0].focus()
		return alert(this.$t("incorrectPwdFormat"))
	  } else if (
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
				})
				.catch((err) => {
				  console.log(err)
				})
			  alert(self.$t("attachment")[1])
					  self.$modal.hide("passwordResetModal", { type: "next" })
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
	padding: 30px
	background-color: #2a2a2a

.icon
	position: absolute
	top: 10px
	right: 10px

	>img
		padding: 16px

.title
	font-size: 18px
	font-weight: bold
	color: #fff
	margin: 20px 0 17px 0

.input-box
	width: 100%

.input-box + .input-box
	margin-top: 10px

input[type=password],
input[type=text]
	font-family: auto
	background-color: #3e3e3e
	outline: none
	color: #fff
	width: 100%

.fa-eye
	position: absolute
	top: 50%
	right: 10px
	transform: translate(0, -50%)
	cursor: pointer

.password,
.newPassword,
.newPasswordCheck
	font-size: 15px
	font-weight: 800
	padding: 16px

.description
	margin-top: 10px
	color: #d8d9a5
	font-weight: 700

.button
	margin-top: 14px
	padding: 16px
	background: #2386d2
	color: #fff

.fa-eye

@media screen and (max-width: 500px)
	.profile
		padding: 14px
</style>
