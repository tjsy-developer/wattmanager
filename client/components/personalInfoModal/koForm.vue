<template lang="pug">
	.form
		.title
			p 개인정보 수집∙이용 및 제3자 제공 동의
		.content
			p 삼성엔지니어링 주식회사(이하 회사)는 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 개인정보 보호에 최선을 다하고 있습니다.  

			.line
			p.topic ●	개인정보 수집ㆍ이용 동의
			p.topicText - 수집ㆍ이용 목적: 스마트 글라스 활용 비대면 영상 통화 서비스 운영 및 영상 통화 저장영상 열람
			p.topic ● 수집ㆍ이용하는 개인정보 항목 및 보유기간

			p
				table 
					tr 
						td 수집 항목
						td 보유기간
					tr 
						td 
							span 영상 통화 내역(얼굴, 음성), 통화 중 공유한 파일의 영상<br>
							span (원본 자료는 별도 저장되지 않음)
						td 1년
			p.topic ● 동의 거부권 및 동의 거부 시 불이익 내용
			p.subText - 귀하는 본 동의서의 개인정보 수집∙이용에 대한 동의를 거부할 권리가 있습니다. 단, 거부 시에는 시스템 이용이 제한될 수 있습니다.

			p.topic ●	개인정보 처리 업무 위탁 고지
			p.topicText - 회사는 서비스 이행, 이용자의 편의증진 등을 위하여 아래와 같이 개인정보 처리업무를 외부 전문업체에 위탁하여 처리하고 있습니다. 관계법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
			.line
			p.subheading 
				label 수탁업체의 명칭
				span : ㈜와트
			p.subheading 
				label 위탁업무 내용
				span : 시스템 운영 및 유지보수
			p.subheading(style="margin-bottom: 0px")
				label 연락처 
				span : 070-7124-2588
			.agreeBtnBox
				button(@click="consentStatusChecked" :style="{background: receiveStatus ? '#2386D2' : '#5b5b5b'}")  {{ this.statusText }}
</template>

<script>
export default {
  props: {
    consentStatus: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      receiveStatus: false,
      statusText: ""
    }
  },
  methods: {
    // 개인정보 수집 이용에 동의합니다 체크 시
    consentStatusChecked() {
      if (this.statusText === "확인") {
        this.$emit("consentValToggle", this.receiveStatus)
        this.$modal.hide("personalInfoModal")
      } else {
        if (this.receiveStatus) {
          this.receiveStatus = false
        } else this.receiveStatus = true
        this.$emit("consentValToggle", this.receiveStatus)
      }
    }
  },
  mounted() {
    this.receiveStatus = this.consentStatus
    if (this.receiveStatus) {
      this.statusText = "확인"
    } else {
      this.statusText = "개인정보 수집 이용에 동의합니다"
    }
  }
}
</script>
<style lang="sass" scoped>
.form
	position: absolute
	width: 100%
	height: 100%
	justify-content: center
	font-size: 16px
	border-radius: 15px 15px 0px 0px
	color: #ffffff
	word-break: break-all
	overflow-y: scroll

.title
	width: 100%
	height: 80px
	background: #404040
	font: normal normal 800 18px/26px NanumSquare
	color: #ffffff
	border-radius: 5px 5px 0px 0px
	text-align: center
	>p
		margin-top: 24px

.line
	width: 90%
	border: 1px solid grey
	margin-left: 5%
	margin-bottom: 20px

.content
	height: 80%
	>p
		padding: 0px 31px 0px 30px
		&:nth-child(1)
			color: #DBDBDB
			font: normal normal normal 14px/26px NanumSquare
			margin-top: 20px

.topic
	font: normal normal normal 16px/26px NanumSquare
	margin-top: 20px

.subheading
	>label
		color: white
	display: flex
	color: #DBDBDB
	margin-left: 5px
	font-size: 14px

.topicText
	color: #DBDBDB
	margin-left: 5px
	font-size: 14px

.subText
	color: #DBDBDB
	font-weight: 100
	margin-left: 5px
	font-size: 14px

table
	width: 100%
	>tr,td
		text-align: center
		border: 1px solid #414040
	>tr:nth-child(1)
		font-size: 14px
		background: #ffffff
		color: black
		font-weight: 800
		>td
			padding: 10px
			border: none
		>td:nth-child(1)
			width: 70%
	>tr:nth-child(2)
		font-size: 13px
		>td
			padding: 15px
			>span:nth-child(1)
				width: 100%
			>span:nth-child(2)
				width: 100%
				color: #DBDBDB
	>td:nth-child(1)
		width: 70%

.agreeBtnBox
	width: 100%
	margin-top: 10px
	padding-bottom: 10px
	text-align: center
	display: flex
	>button
		display: block
		color: white
		margin: auto
		background: #5b5b5b
		font-size: 13px
		padding: 3px 10px
		border-radius: 5px
		>input
			float: right
			margin-top: 3px
			margin-left: 4px

button:hover
	background: #2386D2 !important
// 	color: white
// 	&:not(:first-child)
// 		padding-right: 20px
// 	&:nth-child(1)
// 		font-size: 25px
// 		text-align: center
// 		margin-bottom: 30px
// 		font-weight: 700
// 		padding-top: 40px
// 		font: normal normal 800 20px/23px NanumSquare
// 	&:nth-child(2)
// 		font: normal normal normal 14px/26px NanumSquare
// 		letter-spacing: 0px
// 		color: #FFFFFF

// 	&:nth-child(6)
// 		text-align: center

// 	>table
// 		color: white
// 		width: 80%
// 		margin: auto
// 		font-size: 16px

// 		tr:nth-child(1)
// 			background-color: #5d5d5d
// 			text-align: center
// 			bolder: 1px solid white

// 		td:nth-child(2n)
// 			padding: 5px 5px
// 			width: 120px

// 		td:nth-child(2n-1)
// 			padding: 5px 5px

// 		td
// 			text-align: center
</style>
