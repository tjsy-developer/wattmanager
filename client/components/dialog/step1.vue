<template>
	<div class="modal">
		<img src="@/assets/images/bt_close.svg" v-on:click="closeDialog()" :title="$t('닫기')" class="button__close cursor-pointer">
		<div class="modal__content">
			<h5>{{ $t("본인인증") }}</h5>
			<p></p>
			<p>{{ $t("보안을 위해 OTP 인증을 진행합니다") }}</p>
			<p>{{ $t("회원정보에 등록된 휴대폰으로 OTP 번호를 전송합니다") }}</p>
			<table>
				<tr>
					<th>{{ $t("이름") }}</th>
					<th>{{ $t("휴대폰") }}</th>
				</tr>
				<tr>
					<td>{{ user.name }}</td>
					<td>{{ user.phone_number === 'null' ? '-' : user.phone_number }}</td>
				</tr>
			</table>
			<p></p>
			<div class="modal__footer">
				<button class="button button--bg-blue" @click="openConfirmDialog">{{ $t("OTP 전송") }}</button>
				<button class="button button--bg-grey" @click="changePhone">{{ $t("휴대폰 번호 변경") }}</button>
			</div>
		</div>
	</div>
</template>

<script>
import Step3 from "@/components/dialog/step3"

export default {
	name: "Step1",
	props: ['user', 'func'],
	methods: {
		changePhone() {
			this.$emit("change", Step3)
		},
		openConfirmDialog() {
			this.func.sendOTP({
				id: this.user.id
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
	&__content
		width: 100%
		padding: 30px
		background-color: #262627

		table
			width: 100%
			border: 1px solid #ffffff
			th, td
				padding: 10px
				text-align: center
	&__footer
		width: 100%
		text-align: center
		display: grid
		place-items: center
		.button
			color: #fff
			border-radius: 8px
			&:first-child
				width: 100%
				padding: 8px 18px
			&:last-child
				margin-top: 18px
				width: auto
				padding: 4px 18px
		.button--bg-blue
			background-color: #1C8EFF
			&:hover
				background-color: #0b71d5
		.button--bg-grey
			background-color: #4d4d4d
			&:hover
				background-color: #7d7d7d

.button__close
    position: absolute
    right: 3px
    z-index: 1
    top: 3px
    width: 26px
</style>