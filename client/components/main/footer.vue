<template>
	<div class="row justify-center mainFooter">
		<div class="row maxWidth">
			<button v-if="useEnterprise == 'dlenc'" class="policy-btn" @click="policyBtnClick()">{{ $t("policy")[0] }}</button>
			<div class="col-12 divisionLine"></div>
			<!-- DL EnC 상호명 추가 -->
			<span v-if="useEnterprise == 'dlenc'" class="col-12 text">
				{{ $t("footer")[4] }}<br>
				{{ $t("footer")[5] }}<br><br>
				{{ $t("footer")[0] }} I {{ $t("footer")[1] }} I {{ $t("footer")[2] }}<br>{{ $t("footer")[3] }}<br><br>
				Copyright © 2020 WATT CO.LTD. All Rights Reserved.
			</span>
			<span v-else class="col-12 text">
				{{ $t("footer")[0] }} I {{ $t("footer")[1] }} I {{ $t("footer")[2] }}<br>{{ $t("footer")[3] }}<br><br>
				Copyright © 2020 WATT CO.LTD. All Rights Reserved.
			</span>
		</div>
	</div>
</template>
<script>
import domain from "@/assets/jsons/domain/domain"
export default {
	data() {
		return {
			useEnterprise: domain.useEnterprise
		}
	},
	mounted() {
		if (window.location.hostname == "kepco.watttalk.kr") {
			this.useEnterprise = "kepco";
		} else if (window.location.hostname == "dlenc.watttalk.kr") {
			// dlenc 분기처리!!
			this.useEnterprise = "dlenc";
		}else if (window.location.hostname == 'dlencmedia.watttalk.kr') {
			this.useEnterprise = "dlenc"
		}
	}
}

</script>

<style lang="sass" scoped>
.mainFooter
	width: 100%
	background: $contentBackground

.maxWidth
	width: $contentMaxWidth
	display: flex
	justify-content: center
	align-items: center

.policy-btn
	margin-top: 42px
.divisionLine
	height: 1px !important
	border: 1px solid #D9D9D9

.text
	font-size: 10px
	text-align: center
	color: #BBBBBB
	margin: 20px 0 20px
</style>
