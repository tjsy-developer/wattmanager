<template>
	<div class="form">
		<div class="title">
			<p>Consent to collect and use personal information <br>and to providepersonal information to third parties</p>
		</div>
		<div class="content">
			<p>Samsung Engineering Co., Ltd. (hereinafter referred to as the company) complies with the privacy regulations under the Personal Information Protection Act and is committed to protecting personal information.</p>

			<div class="line"></div>
			<p class="topic">● Consent to collect and use personal information</p>
			<p class="topicText">- Purpose of collection and use: Operation of non-face-to-face video call service using smart glass and video call storage video viewing</p>
			<p class="topic">● Personal information items collected and used and the retention period</p>

			<p>
				<table>
					<tr>
						<td>Collection Items</td>
						<td>Retention<br> period</td>
					</tr>
					<tr>
						<td>
							<span>Video call history (face, voice), images of files shared during the call </span>
							<span>(original data is not saved separately)</span>
						</td>
						<td>1 year</td>
					</tr>
				</table>
			</p>
			<p class="subheading">● Disclaimer of consent and disadvantages to refusal of consent</p>
			<p class="subText">- You have the right to refuse to consent to the collection and use of personal information in this Agreement. However, if rejected, the system may be restricted.</p>

			<p class="topic">●	Notification of entrustment of personal information</p>
			<p class="topicText">
				- The company entrusts the processing of personal information to an external specialized company for the implementation of services and the convenience of users as follows : <br>The relevant statutes stipulate matters necessary for the safe management of personal information in the event of a consignment contract.
			</p>
			<div class="line"></div>
			<p class="subheading">
				<label>Name of the trustee</label>
				<span>: Watts Co., Ltd.</span>
			</p>
			<p class="subheading">
				<label>Contents of entrusted work</label>
				<span>: System operation and maintenance</span>
			</p>
			<p class="subheading" style="margin-bottom: 0px">
				<label>Contact</label>
				<span>: 82-70-7124-2588</span>
			</p>
			<div class="agreeBtnBox">
				<button @click="consentStatusChecked" :style="{background: receiveStatus ? '#2386D2' : '#5b5b5b'}">{{ this.statusText }}</button>
			</div>
		</div>
	</div>
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
      status: false,
      statusText: ""
    }
  },
  methods: {
    // 개인정보 수집 이용에 동의합니다 체크 시
    consentStatusChecked() {
      if (this.statusText === "Confirm") {
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
      this.statusText = "Confirm"
    } else {
      this.statusText = "I agree to the collection of personal information"
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
	border-radius: 15px
	color: #ffffff
	word-break: break-all
	overflow-y: scroll

.title
	width: 100%
	height: 80px
	background: #404040
	font: normal normal 800 20px/26px NanumSquare
	color: #ffffff
	border-radius: 5px 5px 0px 0px
	text-align: center
	>p
		margin-top: 14px

.line
	width: 90%
	border: 1px solid grey
	margin-left: 5%
	margin-bottom: 10px

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
	margin-top: 10px
	margin-bottom: 10px

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
		font-size: 13px
		background: #ffffff
		color: black
		font-weight: 800
		>td
			padding: 1px
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
		padding: 3px 5px
		border-radius: 5px
		>input
			float: right
			margin-top: 3px
			margin-left: 4px

button:hover
	background: #2386D2 !important
// p
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
@media screen and (max-width: 600px)
	.title
		white-space: nowrap
		>p
			font-size: 16px
@media screen and (max-width: 420px)
	.title
		>p
			font-size: 14px
</style>
