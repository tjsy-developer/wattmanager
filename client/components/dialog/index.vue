<template>
	<div class="layer">
		<div class="layer loading" v-show="loading">
			<img src="@/assets/images/loading.gif" />
		</div>
		<keep-alive :include="['Step1', 'Step2', 'Step3']">
			<component
				:is="currentComponent"
				@close="closeDialog"
				@resolve="handling"
				@change="changeModal"
				:user="accountInfo"
				:func="{
					checkOTP: checkOTP,
					sendOTP: sendOTP,
					updatePhoneSendOTP:  updatePhoneSendOTP
				}"
				v-show="true">
			</component>
		</keep-alive>
	</div>
</template>

<script>
import Step1 from "@/components/dialog/step1"
import Step2 from "@/components/dialog/step2"
import Step3 from "@/components/dialog/step3"

export default {
	name: 'Dialog',
	components: {
		Step1,
		Step2,
		Step3
	},
	props: [
		'initComp', 'name', 'accountInfo'
	],
	data() {
		return {
			loading: false,
			currentComponent: null,
			tempPhoneNumber: null,
			BASE_URL: process.env.backendURL
		}
	},
	mounted() {
		document.getElementById("modalsContainer").style.display = "block"
		this.currentComponent = this.initComp
	},
	methods: {
		closeDialog(props) {
			this.$modal.hide(this.name, props)

			const modalWrraper = document.getElementById("modalsContainer")
			if (modalWrraper.children.length === 1) {
				modalWrraper.style.display = "none"
			}
		},
		handling() {
			return new Promise((resolve) => {
				resolve("success")
			});
		},
		changeModal(component) {
			this.currentComponent = component
		},
		async updatePhoneSendOTP(params) {
			this.loading = true
			try {
				const res = await this.$api('post', {
					data: params,
					api: `${this.BASE_URL}accountRest/sms_otp_phone_number_send`
				})
				if (res?.data) {
					if (res.data.result) {
						this.tempPhoneNumber = params.phone_number
						this.changeModal(Step2)
					} else {
						alert(this.$t(res.data.errorMessage))
					}
				} else throw res
			} catch (error) {
				alert("처리 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
			}
			this.loading = false
		},
		async sendOTP(params) {
			this.loading = true
			if (this.tempPhoneNumber) {
				this.updatePhoneSendOTP({
					...params,
					phone_number: this.tempPhoneNumber
				})
				return
			}

			try {
				const res = await this.$api('post', {
					data: params,
					api: `${this.BASE_URL}accountRest/sms_otp_send`
				})
				if (res?.data) {
					if (res.data.result) this.changeModal(Step2)
					else {
						alert(this.$t(res?.data?.errorMessage))
					}
				} else throw res
			} catch (error) {
				alert("처리 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
			}
			this.loading = false
		},
		async checkOTP(params) {
			this.loading = true
			try {
				const otpResponse = await this.$api('post', {
					data: params,
					api: `${this.BASE_URL}accountRest/sms_otp_check`
				});

				if (!otpResponse.data?.result) {
					this.loading = false
					// setTimeout(() => { alert(this.$t()) }, 0)
					return otpResponse.data.error_message
				}

				if (this.tempPhoneNumber) {
					const updatePhoneResponse = await this.$api('post', {
					data: {
						id: params.id,
						phone_number: this.tempPhoneNumber
					},
						api: `${this.BASE_URL}accountRest/phone_number_update`
					});

					if (!updatePhoneResponse.data?.result) {
						alert(this.$t(updatePhoneResponse.data.errorMessage));
						return
					}

					alert(this.$t("휴대폰 번호 변경 완료"));
				}
				this.closeDialog({ type: "success" });
			} catch (error) {
				console.log(error)
				alert("처리 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
			}
			this.loading = false
		}
	},
}
</script>

<style lang="sass" scoped>
div
	color: #fff

.loading
	z-index: 999
	position: fixed
	top: 0
	left: 0
	background-color: rgba(0, 0, 0, 0.7)
	img
		position: absolute
		left: 50%
		top: 50
		top: 50%
		transform: translate(-50%, -50%)
</style>