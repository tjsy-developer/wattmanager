<template>
	<div class="modal">
		<img src="@/assets/images/bt_close.svg" v-on:click="closeDialog()" class="button__close cursor-pointer">
		<div class="row modal__content">
			<div class="col-12">
				<h5>{{ $t("본인 확인") }}</h5>
				<p></p>
				<p>{{ $t("휴대폰으로 전송한 OTP 번호를 입력해주세요") }}</p>
			</div>
			<div class="col-12 row justify-center q-gutter-md">
				<div class="col-7 row items-center ">
					<input class="col" v-model="verificationCode" @input="filterNonNumericInput">
					<div class="timer">({{ timer }})</div>
				</div>
				<button class="col-auto button button--bg-blue" @click="confirmOTP()" :disabled="timeLeft < 1"> {{ $t("확인") }}</button>
			</div>
			<div id="hp2Msg"></div>
			<p></p>
			<div class="col-12 row modal__footer">
				<button class="col-12 button button--bg-grey" @click="getOTP()">{{ $t("OTP 재전송") }}</button>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: "Step2",
	props: ['user', 'func'],
	data() {
		return {
			timeLeft: 0,
			timer: '00:00',
			countdownTimer: null,
			verificationCode: ''
		}
	},
	mounted() {
		this.startCountdown()
	},
	methods: {
		filterNonNumericInput() {
			this.verificationCode = this.verificationCode.replace(/[^0-9]/g, '');
			const msg = document.getElementById("hp2Msg")
			msg.innerText = ''
		},
		startCountdown() {
			const msg = document.getElementById("hp2Msg")
			const init = () => {
				clearInterval(this.countdownTimer);
				this.timeLeft = 300
				this.timer = `${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}`
				msg.innerText = ''
			}

			init();
			this.countdownTimer = setInterval(() => {
				this.timeLeft--;
				const minutes = Math.floor(this.timeLeft / 60);
				const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
				this.timer = `${minutes}:${seconds}`

				if (this.timeLeft < 1) {
					clearInterval(this.countdownTimer);
					msg.innerText = `${this.$t("인증 시간이 만료되었습니다")}\n${this.$t("OTP 재전송 버튼을 클릭하여 인증번호를 다시 받아주세요")}`
				}
			}, 1000);
		},
		async confirmOTP() {
			const msg = document.getElementById("hp2Msg")

			if (!this.verificationCode) {
				msg.innerText = this.$t("OTP를 입력해주세요")
				return
			}
			const res = await this.func.checkOTP({
				id: this.user.id,
				otp: this.verificationCode
			})
			
			if (res) msg.innerText = this.$t(res)
		},
		async getOTP() {
			await this.func.sendOTP({
				id: this.user.id
			})
			this.startCountdown()
			this.verificationCode = ''
			const msg = document.getElementById("hp2Msg")
			msg.innerText = ''
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

#hp2Msg
	color: yellow
	width: 100%
	text-align: center
	margin-top: 10px
</style>