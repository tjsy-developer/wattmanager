<template>
	<div class="modal">
		<img src="@/assets/images/bt_close.svg" @click="closeDialog()" class="button__close cursor-pointer">
		<div class="row modal__content">
			<div class="col-12">
				<h5>{{ $t("휴대폰 번호 변경") }}</h5>
				<p></p>
				<p>{{ $t("보안을 위해 OTP 인증을 진행합니다") }}</p>
				<p>{{ $t("휴대폰 번호를 변경하려면, 새 번호를 입력 후 OTP 번호를 전송해 주세요") }}</p>
			</div>
			<div class="col-12 row justify-center q-gutter-md">
				<div class="col-7 row items-center ">
					<input class="col" v-model="phoneNumber" @input="filterNonNumericInput">
				</div>
				<div id="hp2Msg"></div>
			</div>
			<p></p>
			<div class="col-12 row modal__footer">
				<button class="col-12 button button--bg-blue" @click="getOTP()">{{ $t("OTP 전송") }}</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Step3",
	props: ['user', 'func'],
	data() {
		return {
			itemLeft: 0,
			timer: '00:00',
			countdownTimer: null,
			phoneNumber: ''
		}
	},
	methods: {
		filterNonNumericInput() {
			this.phoneNumber = this.phoneNumber.replace(/[^0-9]/g, '');
		},
		validationCheckPhoneNum(number) {
			let result = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
			return result.test(number);
		},
		getOTP() {
			if (!this.phoneNumber) {
				alert("휴대폰 번호를 입력해주세요")
				return
			} else if (!this.validationCheckPhoneNum(this.phoneNumber)) {
				alert("잘못된 휴대폰 번호 형식입니다")
				return
			}
			this.func.updatePhoneSendOTP({
				id: this.user.id,
				phone_number: this.phoneNumber
			})
		},
		closeDialog() {
			this.$emit("close")
		}
	}
}
</script>

<style lang="sass" scoped>
.modal
	position: absolute
	top: 50%
	left: 50%
	transform: translate(-50%, -50%)
	max-width: 500px
	width: 100%

	div
		color: #fff
	input
		font-size: 16px
		color: #fff
		width: 100%
		border: none
		outline: none
		text-align: center
		border-bottom: 1px solid #fff
	&__content
		width: 100%
		padding: 30px
		background-color: #262627

		table
			width: 100%
			border: 1px solid #ffffff
			th, td
				padding: 10px
	&__footer
		width: 100%
		text-align: center
		display: grid
		place-items: center

.button
	color: #fff
	border-radius: 8px
	padding: 8px 18px
	&:first-child
		margin-top: 30px

.button--bg-blue
	background-color: #1C8EFF
	&:hover
		background-color: #0b71d5

.button--bg-grey
	background-color: #4d4d4d
	&:hover
		background-color: #7d7d7d

.timer
	position: absolute
	right: 0
	font-size: 16px

.button__close
    position: absolute
    right: 3px
    z-index: 1
    top: 3px
    width: 26px
</style>