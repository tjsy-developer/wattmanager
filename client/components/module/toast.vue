<template>
	<transition name="slide" type="animation">
		<div v-if="guideDialogToggle" class="alert">
			<div v-if="guideDialogType == 'error'" class="alert__err-box">
				<img class="alert__err-img" src="@/assets/images/module/ic_check_r_30.svg" />
				<span class="alert__err-text">{{ guideDialogInfo }}</span>
			</div>
			<div v-if="guideDialogType == 'confirm'" class="alert__confirm-box">
				<img class="alert__confirm-img" src="@/assets/images/module/ic_check_30.svg" />
				<span class="alert__confirm-text">{{ guideDialogInfo }}</span>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	data() {
		return {
            guideDialogToggle: false,
            guideDialogType: "",
            guideDialogInfo: "",
			marginTop: "",
			marginLeft: ""
		}
	},
	// computed: {
	// 	changePosition() {
	// 		return this.guideDialogToggle
	// 	}
	// },
	// watch: {
	// 	changePosition() {
	// 		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	// 		const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	// 		// 토스트 크기 가져오기
	// 		const toastHeight = 50;

	// 		// 정중앙 위치 계산
	// 		const left = vw / 2;
	// 		const top = vh / 2 - toastHeight / 2;
	// 		return {
	// 			top: `${top}px`,
	// 			left: `${left}px`
	// 		}
	// 	}
	// },
    mounted() {
        sessionStorage.setItem("opendDialog", true)
        window.addEventListener("openDialog", (e) => {
            const detail = e.detail
            this.guideDialogToggle = detail.guideDialogToggle
            this.guideDialogType = detail.guideDialogType
            this.guideDialogInfo = detail.guideDialogInfo
        })
        window.addEventListener("closeDialog", (e) => {
            const detail = e.detail
            this.guideDialogToggle = detail.guideDialogToggle
            this.guideDialogType = detail.guideDialogType
            this.guideDialogInfo = detail.guideDialogInfo
            sessionStorage.setItem("opendDialog", false)
        })
    }
}
</script>
<style lang="scss" scoped>
.alert {
	// 신규 생성 모달에서 호출 시 뜨지 않아서 아래와 같이 z-index 지정함.
	z-index: 2147483647;
	position: fixed;
	top: 30px;
	width: 100%;
	height: 50px;
	display: flex;
	justify-content: center;
	font: normal normal bold 16px/18px "Noto Sans KR";
	&__box {
		width: auto;
		height: 50px;
		background: #fff;
		padding: 10px 13px 10px 13px;
		border-radius: inherit;
		display: flex;
		align-items: center;
		box-shadow: 0px 0px 8px #00000029;
		border-radius: 25px;
		opacity: 1;
	}
	&__img {
		width: 30px;
	}
	&__text {
		margin: 0 44px 0 51px;
		letter-spacing: 0px;
	}
	&__close-btn {
		width: 17px;
		margin-left: 10px;
		&:hover {
			background: #c7ccc7;
			border-radius: 5px;
		}
	}
	&__err-box {
		width: auto;
		height: 50px;
		background: #fff;
		padding: 10px 13px 10px 13px;
		border-radius: inherit;
		display: flex;
		align-items: center;
		border: 1px solid #db2a2a;
		color: #db2a2a;
		box-shadow: 0px 0px 8px #00000029;
		border-radius: 25px;
		opacity: 1;
	}

	&__confirm-box {
		width: auto;
		height: 50px;
		background: #fff;
		padding: 10px 13px 10px 13px;
		border-radius: inherit;
		display: flex;
		align-items: center;
		border: 1px solid #005fb8;
		color: #005fb8;
		box-shadow: 0px 0px 8px #00000029;
		border-radius: 25px;
		opacity: 1;
	}
	&__err-img {
		width: 30px;
	}
	&__err-text {
		margin: 0 44px 0 51px;
		letter-spacing: 0px;
	}
	&__confirm-img {
		width: 30px;
	}
	&__confirm-text {
		margin: 0 44px 0 51px;
		letter-spacing: 0px;
	}
}
.slide-enter-active {
	animation: slide-in 0.3s ease-in forwards;
}

.slide-leave-active {
	animation: slide-out 0.3s ease-out forwards;
}

@keyframes slide-in {
	from {
		transform: translateY(20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@keyframes slide-out {
	from {
		transform: translateY(0);
		opacity: 1;
	}
	to {
		transform: translateY(20px);
		opacity: 0;
	}
}
</style>
